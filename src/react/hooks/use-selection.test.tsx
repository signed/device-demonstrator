import React from 'react';
import { render } from '@testing-library/react';
import { select, useSelection } from 'react/hooks/use-selection';

const UseSelectionSandbox: React.FC = () => {
    const [selection, setSelection, textInputRef] = useSelection();
    return <ul>
        <li>{`${selection.start}|${selection.end}|${selection.direction}`}</li>
        <li><input ref={textInputRef} type='text'/></li>
        <button onClick={() => {
            textInputRef.current?.focus();
            setSelection(() => select(1, 2, 'forward'));
        }}>
            Quick and Dirty
        </button>
    </ul>;
};

test('get initial selection from input', () => {
    const { getByText } = render(<UseSelectionSandbox/>);
    expect(getByText('0|0|none')).toBeInTheDocument();
});
