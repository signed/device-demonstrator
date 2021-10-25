import React from 'react';
import { BasicContextExample } from './basic-context';
import { ContextRoot } from './context';

export default {
    title: 'Context',
    component: ContextRoot
};

export const Emoji = () => (
    <ContextRoot/>
);

export const HandleMissingContext = () => {
    return <BasicContextExample/>
}
