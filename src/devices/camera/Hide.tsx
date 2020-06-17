import React from 'react';

export interface HideProps {
    hide: boolean;
}

export const Hide: React.FC<HideProps> = (props) => {
    if (props.hide) {
        return null;
    }
    return <React.Fragment>
        {props.children}
    </React.Fragment>;
};
