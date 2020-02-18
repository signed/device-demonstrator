import { useCallback, useRef } from 'react';

//https://gist.github.com/thebuilder/fb07c989093d4a82811625de361884e7
export const useHookWithRefCallback = <ElementType>() => {
    const ref = useRef<ElementType>();
    const setRef = useCallback((node: ElementType) => {
        if (ref.current !== undefined) {
            // Make sure to cleanup any events/references added to the last instance
            console.log('clean up old ref');
        }
        if (node) {
            // Check if a node is actually passed. Otherwise node would be null.
            // You can now do what you need to, addEventListeners, measure, etc.
            console.log('process new ref');
        }
        // Save a reference to the node
        ref.current = node;
    }, []);
    return [setRef];
};

// https://github.com/theKashey/use-callback-ref
