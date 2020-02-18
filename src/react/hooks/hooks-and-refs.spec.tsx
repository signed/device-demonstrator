import React from 'react';
import { useHookWithRefCallback } from 'react/hooks/hooks-and-refs';

it('should ', () => {
    const Component = () => {
        const [ref] = useHookWithRefCallback();
        return <div ref={ref}> Ref; element </div>;
    };
});
