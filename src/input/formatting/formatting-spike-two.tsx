import { CountryCode, CountrySelection } from 'input/formatting/shared';
import React, { CSSProperties, useState } from 'react';

interface PhoneNumberDigitsProps {
    value: string;
    onChange: (phoneNumber: string) => void
}

const PhoneNumberDigits: React.FC<PhoneNumberDigitsProps> = ({ value }) => {
    return <input value={value}/>;
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

    return (<div style={style}>
        <CountrySelection onChange={onCountryCodeChange} value={countryCode}/>
        <PhoneNumberDigits value={formattedDigits} onChange={onFormattedDigitsChange}/>
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
