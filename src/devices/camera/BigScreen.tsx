import React, { useEffect, useState } from 'react';
import { Device, RecordingDirector } from './RecordingDirector';
import { VideoElement } from './VideoElement';

export interface BigScreenProps {
    recordingDirector: RecordingDirector;
}

export interface BigScreenState {
    device: Device | void;
    stream: MediaStream | null;
    streamError: boolean;
}

export const BigScreen: React.FC<BigScreenProps> = (props) => {
    const { recordingDirector } = props;
    const [{ streamError, stream, device }, setState] = useState<BigScreenState>({ streamError: false, stream: null, device: undefined });

    useEffect(() => {
        const handleDeviceSelectionChange = (device: Device | void): void => {
            setState(prev => ({...prev, device}))
        };
        recordingDirector.addOnCameraSelectionChanged(handleDeviceSelectionChange);
        return () => {
            recordingDirector.removeOnCameraSelectionChanged(handleDeviceSelectionChange);
        };
    }, [recordingDirector]);

    useEffect(() => {
        if (undefined === device ) {
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

    if (device === undefined) {
        return <div>No device selected</div>;
    }
    if (stream === null) {
        return <div>Opening stream</div>;
    }
    const handleVideoClicked = () => {
        recordingDirector.clearCameraSelection();
    };
    return (
        <div>
            {!streamError && <>
                <VideoElement srcObject={stream} autoPlay={true} onClick={handleVideoClicked}/>
                <div>{stream.id}</div>
            </>}
            {streamError && <div>error loading stream</div>}
        </div>
    );
};
