import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

interface ButtonProps {
    onClick: () => void;
    label: string;
}

const Button = (props: ButtonProps) => <button onClick={props.onClick}>{props.label}</button>;

it('callback should be executed', () => {
    const nothing = jest.fn();
    const { getByText } = render(<Button onClick={nothing} label={'hello'}/>);
    fireEvent.click(getByText('hello'));
});
