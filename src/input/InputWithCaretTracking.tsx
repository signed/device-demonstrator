import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AsYouType } from 'libphonenumber-js/min';

type SelectionDirection = 'forward' | 'backward' | 'none';

export interface Selection {
    readonly start: number;
    readonly end: number;
    readonly direction: SelectionDirection
}

const select = (start: number, end: number, direction: SelectionDirection): Selection => {
    return { start, end, direction };
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

interface Changed {
    readonly selection: Selection;
    readonly value: string;
}

type Formatter = (previous: Formatted, toFormat: Changed) => Formatted;

interface FormattedInputProps {
    value: string;
    onChange: (value: string) => void
    placeholder?: string;
}

const inputFormattedWith = (formatter: Formatter): React.FC<FormattedInputProps> => {
    return (props) => {
        const [value, setValue] = useState(props.value);
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
                setSelection(selection);
            };
            textInput.addEventListener('keyup', writeCaretPositionToState);
            textInput.addEventListener('click', writeCaretPositionToState);
            return () => {
                textInput?.removeEventListener('keyup', writeCaretPositionToState);
                textInput?.removeEventListener('click', writeCaretPositionToState);
            };
        }, []);

        const { onChange } = props;
        const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
            let inputElement = ev.target;
            let caretFallback = inputElement.value.length;
            let selectionAfterChange = select(inputElement.selectionStart ?? caretFallback, inputElement.selectionEnd ?? caretFallback, toSelectionDirection(inputElement.selectionDirection));
            const previous = { selection, value };
            const toFormat = { selection: selectionAfterChange, value: inputElement.value };
            const formatted = formatter(previous, toFormat);
            // selection has to be stored to give the formatter a chance to chance to position the
            // caret left of a formatting character
            setSelection(() => formatted.selection);
            if (previous.value === formatted.value) {
                // todo there was a change made in the dom that we have
                // 1. to revert because formatting the changed input resulted in the previous text
                // 2. restore the selection
                return;
            }
            setValue(() => formatted.value);
            onChange(formatted.value);
        }, [selection, value, onChange]);

        useEffect(() => {
            textInputRef.current?.setSelectionRange(selection.start, selection.end, selection.direction);
        });

        return <>
            <div>{selection.start}/{selection.end}/{selection.direction}</div>
            <input ref={textInputRef} type='text' placeholder={props.placeholder} onChange={handleChange} value={value}/>
        </>;
    };
};

const log: (formatter: Formatter) => Formatter = (toLog) => {
    return (previous, toFormat) => {
        const result = toLog(previous, toFormat);
        console.log('previous', previous.selection, previous.value);
        console.log('toFormat', toFormat.selection, toFormat.value);
        console.log('result  ', result.selection, result.value);
        return result;
    };
};

const UppercaseCharacters: React.FC<FormattedInputProps> = inputFormattedWith(log((previous, toFormat) => {
    return {
        selection: toFormat.selection,
        value: toFormat.value.toUpperCase()
    };
}));

const PhoneNumberInput: React.FC<FormattedInputProps> = inputFormattedWith(log((previous, toFormat) => {
    const asYouType = new AsYouType('US');
    const formatted = asYouType.input(toFormat.value);
    const caret = toFormat.selection.end === toFormat.value.length ? formatted.length : toFormat.selection.end;
    return {
        selection: {
            start: caret,
            end: caret,
            direction: 'forward'
        },
        value: formatted
    };
}));

const onChange = (value: string) => console.log(value);
export const inputWithCaretTrackingDemonstrator = () => () => {
    return <>
        <PhoneNumberInput onChange={onChange} value='' placeholder='(213) 373-4253'/>
        <UppercaseCharacters onChange={onChange} value={'banana'}/>
    </>;
};
