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

export type StreamError = 'CouldNotOpen' | 'DeviceRemoved';

export interface VideoStream {
    stream: MediaStream | null;
    streamError: StreamError | 'none';
}

export const useVideoStreamFrom = (device: Device | void): VideoStream => {
    const recordingDirector = useRecordingDirector();
    const [state, setState] = useState<VideoStream>({ stream: null, streamError: 'none' });
    useEffect(() => {
        if (undefined === device) {
            return;
        }
        const mediaStreamSubscription = recordingDirector.videoStreamSubscriptionFor(device);
        mediaStreamSubscription.onDeviceRemoved(() => {
            mediaStreamSubscription.cancel()
            setState({ stream: null, streamError: 'DeviceRemoved' });
        });
        mediaStreamSubscription.stream
            .then(stream => setState(() => ({ stream, streamError: 'none' })))
            .catch(() => setState(() => ({ stream: null, streamError: 'CouldNotOpen' })));
        return () => {
            mediaStreamSubscription.cancel();
            setState(() => ({ stream: null, streamError: 'none' }));
        };
    }, [recordingDirector, device]);
    return state;
};
