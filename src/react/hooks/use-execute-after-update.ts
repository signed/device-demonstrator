import { useLayoutEffect, useRef } from 'react';

export type AfterUpdateTask = () => {};

export const useExecuteAfterUpdate = () => {
    const afterUpdateTasks = useRef<AfterUpdateTask[]>([]);
    useLayoutEffect(() => {
        const toExecute = afterUpdateTasks.current;
        afterUpdateTasks.current = [];
        toExecute.forEach(task => task());
        if (afterUpdateTasks.current.length > 0) {
            throw new Error('Adding new tasks to')
        }
    });
    return (task: AfterUpdateTask) => afterUpdateTasks.current.push(task)
};
