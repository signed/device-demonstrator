import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

type SelectionDirection = 'forward' | 'backward' | 'none';

export interface Selection {
    readonly start: number;
    readonly end: number;
    readonly direction: SelectionDirection
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

interface Formatted {
    readonly selection: Selection;
    readonly value: string;
}

interface Altered {
    readonly selection: Selection;
    readonly value: string;
}

type Formatter = (previous: Formatted, toFormat: Altered) => Formatted;

interface FormattedInputProps {
    value: string;
    onChange: (value: string) => void;
}

const inputFormattedWith = (formatter: Formatter): React.FC<FormattedInputProps> => {
    return (props) => {
        const [text, setText] = useState(props.value);
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
            let currentSelection = select(inputElement.selectionStart ?? caretFallback, inputElement.selectionEnd ?? caretFallback, toSelectionDirection(inputElement.selectionDirection));
            const previous = { selection, value: text };
            const toFormat = { selection: currentSelection, value: inputElement.value };
            const formatted = formatter(previous, toFormat);
            // selection has to be stored to give the formatter a chance to chance to position the
            // caret left of a formatting character
            setSelection(formatted.selection);
            if (previous.value === formatted.value) {
                // todo there was a change made in the dom that we have
                // 1. to revert because the text was formatted again
                // 2. restore the selection
                return;
            }
            setText(formatted.value);
            props.onChange(formatted.value);
        };

        useEffect(() => {
            textInputRef.current?.setSelectionRange(selection.start, selection.end, selection.direction);
        });

        return <>
            <div>{selection.start}/{selection.end}/{selection.direction}</div>
            <input ref={textInputRef} type='text' placeholder='some stuff' onChange={handleChange} value={text}/>
        </>;
    };
};

const UppercaseCharacters: React.FC<FormattedInputProps> = inputFormattedWith((previous, toFormat) => {
    return {
        selection: toFormat.selection,
        value: toFormat.value.toUpperCase()
    };
});

const onChange = (value: string) => console.log(value);

export const inputWithCaretTrackingDemonstrator = () => () => {
    return <UppercaseCharacters onChange={onChange} value={'banana'}/>;
};
