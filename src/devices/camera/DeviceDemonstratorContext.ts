import React, { useContext } from 'react';
import { RecordingDirector } from './RecordingDirector';

export interface DeviceDemonstratorContext {
    recordingDirector: RecordingDirector;
}

export const Context = React.createContext<DeviceDemonstratorContext | void>(undefined);

export const useRecordingDirector = (): RecordingDirector => {
    const maybe = useContext(Context);
    if (undefined === maybe) {
        throw new Error('Context not available in component tree parents');
    }
    return maybe.recordingDirector;
};
