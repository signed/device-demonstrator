import React from 'react';

interface JsonProps {
    content: any;
}

export const Json: React.FC<JsonProps> = ({ content}) => {
    const contentAsJsonString = JSON.stringify(content, null, 2);
    return <pre>{contentAsJsonString}</pre>
};
