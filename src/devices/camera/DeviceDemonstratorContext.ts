import React, { useContext, useEffect, useState } from 'react';
import { Device, RecordingDirector } from './RecordingDirector';

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

export interface VideoStream {
    stream: MediaStream | null;
    streamError: boolean;
}

export const useVideoStreamFrom = (device: Device | void): VideoStream => {
    const recordingDirector = useRecordingDirector();
    const [state, setState] = useState<VideoStream>({ streamError: false, stream: null });
    useEffect(() => {
        if (undefined === device) {
            return;
        }
        const mediaStreamSubscription = recordingDirector.videoStreamSubscriptionFor(device);
        mediaStreamSubscription.stream
            .then(stream => setState(prev => ({ ...prev, stream })))
            .catch(() => setState(prev => ({ ...prev, streamError: true })));
        return () => {
            mediaStreamSubscription.cancel();
            setState(prev => ({ ...prev, stream: null, streamError: false }));
        };
    }, [recordingDirector, device]);
    return state;
};
