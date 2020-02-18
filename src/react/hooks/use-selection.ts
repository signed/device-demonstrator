import React, { useEffect, useState } from 'react';
import { useCallbackRef } from 'use-callback-ref';

type SelectionUpdater = (selectionUpdater: (currentSelection: Selection) => Selection) => void;
type SelectionDirection = 'forward' | 'backward' | 'none';

export interface Selection {
    readonly start: number;
    readonly end: number;
    readonly direction: SelectionDirection
}

export const select = (start: number, end: number, direction: SelectionDirection): Selection => {
    return { start, end, direction };
};

export const toSelectionDirection = (value: String | null | undefined): SelectionDirection => {
    if (value === null || value === undefined) {
        return 'none';
    }
    if (value === 'forward' || value === 'backward' || value === 'none') {
        return value as SelectionDirection;
    }
    throw new Error('this should not happen');
};

const updateIfNeeded = (updatedSelection: Selection) => (previousSelection: Selection) => {
    const nothingChanged = previousSelection.start === updatedSelection.start &&
        previousSelection.end === updatedSelection.end &&
        previousSelection.direction === updatedSelection.direction;
    if (nothingChanged) {
        return previousSelection;
    }
    return updatedSelection;
};

const extractSelectionFrom = (textInput: HTMLInputElement | null) => {
    const start = textInput?.selectionStart ?? 0;
    const end = textInput?.selectionEnd ?? 0;
    const selectionDirection = toSelectionDirection(textInput?.selectionDirection);
    return select(start, end, selectionDirection);
};

export const useSelection = (): [Selection, SelectionUpdater, React.MutableRefObject<HTMLInputElement | null>] => {
    const [selection, setSelection] = useState<Selection>(select(0, 0, 'none'));
    const textInputRef = useCallbackRef<HTMLInputElement>(null, (newValue) => {
        //this is vital to trigger a re-render, because otherwise useSelection
        //is not called again and the listeners to track the selection
        //are not added to the input element
        setSelection(extractSelectionFrom(newValue));
    });
    const textInput = textInputRef.current;
    useEffect(() => {
        if (textInput === null) {
            return;
        }
        const writeSelectionToState = () => {
            setSelection(updateIfNeeded(extractSelectionFrom(textInput)));
        };
        textInput.addEventListener('keyup', writeSelectionToState);
        textInput.addEventListener('click', writeSelectionToState);
        return () => {
            textInput.removeEventListener('keyup', writeSelectionToState);
            textInput.removeEventListener('click', writeSelectionToState);
        };
    }, [textInput]);

    useEffect(() => {
        if (textInput === null) {
            return;
        }
        textInput.setSelectionRange(selection.start, selection.end, selection.direction);
    }, [textInput, selection]);

    return [selection, setSelection, textInputRef];
};
