import React from 'react';

export interface HideProps {
    hide: boolean;
}

export class Hide extends React.Component<HideProps> {
    render(){
        if (this.props.hide) {
            return null;
        }
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}
