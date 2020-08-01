import React from 'react';

export const ErrorView: React.FC<{ error: Error }> = (props) => {
    const { error } = props;

    return <dl>
        <dt>error.name</dt>
        <dd>{error.name}</dd>

        <dt>error.constructor.name</dt>
        <dd>{error.constructor.name}</dd>

        <dt>JSON.stringify(error, null, 2)</dt>
        <dd>{JSON.stringify(error, null, 2)}</dd>
    </dl>
};
