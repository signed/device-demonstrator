import React, { useEffect, useState } from 'react';
import { useRecordingDirector, useVideoStreamFrom } from './DeviceDemonstratorContext';
import { Device } from './RecordingDirector';
import { VideoElement } from './VideoElement';

export const BigScreen: React.FC = () => {
    const [device, setDevice] = useState<Device | void>(undefined);
    const recordingDirector = useRecordingDirector();

    useEffect(() => {
        const handleDeviceSelectionChange = (device: Device | void): void => {
            setDevice(() => device);
        };
        recordingDirector.addOnCameraSelectionChanged(handleDeviceSelectionChange);
        return () => {
            recordingDirector.removeOnCameraSelectionChanged(handleDeviceSelectionChange);
        };
    }, [recordingDirector]);
    const { streamError, stream } = useVideoStreamFrom(device);

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
