import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

type SelectionDirection = 'forward' | 'backward' | 'none';

interface Selection {
    start: number;
    end: number;
    direction: SelectionDirection
}

const select = (start: number, end: number, direction: SelectionDirection): Selection => {
    return { start, end, direction };
};

const log = (source: string, selection: Selection) => {
    console.log(`${source} ${selection.start}-${selection.end} ${selection.direction}`);
};

const toSelectionDirection = (value: String | null | undefined): SelectionDirection => {
    if (value === null || value === undefined) {
        return 'none';
    }
    if (value === 'forward' || value === 'backward' || value === 'none') {
        return value as SelectionDirection;
    }
    throw new Error('this should not happen');
};



export const inputWithCaretTrackingDemonstrator = () => () => {
    const [text, setText] = useState('initial text');
    const [selection, setSelection] = useState(select(0, 0, 'none'));
    const textInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let textInput = textInputRef.current;
        if (textInput === null) {
            return;
        }
        let writeCaretPositionToState = () => {
            const start = textInput?.selectionStart ?? 0;
            const end = textInput?.selectionEnd ?? 0;
            let selection = select(start, end, toSelectionDirection(textInput?.selectionDirection));
            log('listener', selection);
            setSelection(selection);
        };
        textInput.addEventListener('keyup', writeCaretPositionToState);
        textInput.addEventListener('click', writeCaretPositionToState);
        return () => {
            textInput?.removeEventListener('keyup', writeCaretPositionToState);
            textInput?.removeEventListener('click', writeCaretPositionToState);
        };
    }, []);

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        let inputElement = ev.target;
        let caretFallback = inputElement.value.length;
        let selection = select(inputElement.selectionStart ?? caretFallback, inputElement.selectionEnd ?? caretFallback, toSelectionDirection(inputElement.selectionDirection));
        log('change', selection);
        setSelection(selection);
        setText(inputElement.value.toUpperCase());
    };

    useEffect(() => {
        textInputRef.current?.setSelectionRange(selection.start, selection.end, selection.direction);
    });

    return <>
        <div>{selection.start}/{selection.end}/{selection.direction}</div>
        <input ref={textInputRef} type='text' placeholder='some stuff' onChange={handleChange} value={text}/>
    </>;
};
