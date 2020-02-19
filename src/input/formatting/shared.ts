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
