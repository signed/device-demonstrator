import { CountryCode, CountrySelection, Formatted, Formatter, ToFormat } from 'input/formatting/shared';
import { AsYouType } from 'libphonenumber-js/max';
import { CountryCode as LibCountryCode } from 'libphonenumber-js/types';
import React, { CSSProperties, useCallback, useState } from 'react';
import { useSelection } from 'react/hooks/use-selection';
import { useCallbackRef, useMergeRefs } from 'use-callback-ref';

interface PhoneNumberDigitsProps {
    value: string;
    onChange: (phoneNumber: string) => void;
    formatter: Formatter;
}

const useFormatter = (formatter: Formatter) => {
    const [selection, setSelection, textInputRef] = useSelection();
    const inputRef = useCallbackRef<HTMLInputElement>(null, (newValue, lastValue) => {
        console.log(newValue, lastValue);
    });
    const combinedInputRef =useMergeRefs([inputRef, textInputRef]);
    return [combinedInputRef]
};

const PhoneNumberDigits: React.FC<PhoneNumberDigitsProps> = ({ value, onChange, formatter }) => {
    const [inputRef] = useFormatter(formatter);
    return <input ref={inputRef} value={value} onChange={(e) => onChange(e.target.value)}/>;
};

const PhoneNumberInput: React.FC = () => {
    const [countryCode, setCountryCode] = useState<CountryCode>('DE');
    const [formattedDigits, setFormattedDigits] = useState('');

    const onFormattedDigitsChange = (formattedDigits: string) => setFormattedDigits(() => formattedDigits);
    const onCountryCodeChange = (countryCode: CountryCode) => setCountryCode(() => countryCode);
    const style: CSSProperties = {
        display: 'flex',
        flexDirection: 'row'
    };

    const phoneNumberFormatter = useCallback<Formatter>((previous: Formatted, toFormat: ToFormat<void>): Formatted => {
        const asYouType = new AsYouType(countryCode as LibCountryCode);
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
    }, [countryCode]);


    return (<div style={style}>
        <CountrySelection onChange={onCountryCodeChange} value={countryCode}/>
        <PhoneNumberDigits value={formattedDigits} onChange={onFormattedDigitsChange} formatter={phoneNumberFormatter}/>
    </div>);
};

export const formattedInputTwo = () => () => {
    const [enabled, setEnabled] = useState(true);
    return <ul>
        <li>
            <button onClick={() => setEnabled((old) => !old)}> magic</button>
        </li>
        <li>{enabled ? <PhoneNumberInput/> : null}</li>
    </ul>;
};
