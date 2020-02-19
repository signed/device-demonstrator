import { AsYouType } from 'libphonenumber-js/max';
import { CountryCode as LibCountryCode } from 'libphonenumber-js/types';
import { Selection } from 'react/hooks/use-selection';

export interface ToFormat<Context> {
    readonly selection: Selection;
    readonly value: string;
    readonly context: Context;
}

export interface Formatted {
    readonly selection: Selection;
    readonly value: string;
}

export type Formatter<Context = void> = (previous: Formatted, toFormat: ToFormat<Context>) => Formatted;

export const log: (formatter: Formatter) => Formatter = (toLog) => {
    return (previous, toFormat) => {
        const result = toLog(previous, toFormat);
        console.log('previous', previous.selection, previous.value);
        console.log('toFormat', toFormat.selection, toFormat.value);
        console.log('result  ', result.selection, result.value);
        return result;
    };
};

export const toUpperCaseFormatter = (previous: Formatted, toFormat: ToFormat<void>): Formatted => {
    return {
        selection: toFormat.selection,
        value: toFormat.value.toUpperCase()
    };
};

export const phoneNumberFormatter = (previous: Formatted, toFormat: ToFormat<string>): Formatted => {
    const asYouType = new AsYouType(toFormat.context as LibCountryCode);
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
};
