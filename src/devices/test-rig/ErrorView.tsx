import React from 'react';
import { Json } from './Json';

export const ErrorView: React.FC<{ error: Error }> = (props) => {
    const { error } = props;
    return <div>
        <h1>{error.name}</h1>
        <Json content={error}/>
    </div>
};
