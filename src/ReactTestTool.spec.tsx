import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

interface ButtonProps {
    onClick: () => void;
    label: string;
}

const Button = (props: ButtonProps) => <button onClick={props.onClick}>{props.label}</button>;

it('callback should be executed', async () => {
    jest.useFakeTimers();
    const deep = jest.fn();
    const callback = () => {
        setTimeout(() => {
            setTimeout(() => {
                deep();
            }, 1000);
        }, 1000);
    };

    const { getByText } = render(<Button onClick={callback} label={'hello'}/>);
    fireEvent.click(getByText('hello'));
    jest.runAllTimers();
    expect(deep).toHaveBeenCalled();
}, 500);
