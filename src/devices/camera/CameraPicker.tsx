import React, { CSSProperties, useEffect, useState } from 'react';
import { Device, RecordingDirector } from './RecordingDirector';
import { VideoElement } from './VideoElement';

export interface CameraPreviewProps {
    recordingDirector: RecordingDirector;
    device: Device;
    index: number;
}

export interface CameraPreviewState {
    stream: MediaStream | null;
    streamError: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = (props) => {
    const { recordingDirector, device, index } = props;
    const [{ stream, streamError }, setState] = useState<CameraPreviewState>({ streamError: false, stream: null });

    useEffect(() => {
        const mediaStreamSubscription = recordingDirector.videoStreamSubscriptionFor(device);
        mediaStreamSubscription.stream
            .then(stream => setState(prev => ({ ...prev, stream })))
            .catch(() => setState(prev => ({ ...prev, streamError: true })));
        return () => {
            mediaStreamSubscription.cancel();
            setState(prev => ({ ...prev, stream: null, streamError: false }));
        };
    }, [recordingDirector, device]);

    const handleSelect = () => {
        recordingDirector.selectCamera(device);
    };

    const maybeStream = stream;
    return (
        <div>
            <h4>Camera {index}</h4>
            <ul>
                <li>device label: {device.label}</li>
                <li>device id: {device.deviceId}</li>
                <li>group id: {device.groupId}</li>
                <li>stream id: {maybeStream?.id ?? 'no-stream'}</li>
            </ul>
            {streamError && <div>error loading stream</div>}
            {!streamError && <VideoElement onClick={handleSelect} width={150} srcObject={maybeStream} autoPlay={true}/>}
        </div>
    );
};

export interface CameraPickerProps {
    recordingDirector: RecordingDirector
}

export const CameraPicker: React.FC<CameraPickerProps> = (props) => {
    const { recordingDirector } = props;
    const [{ showPreviews }, setState] = useState({ showPreviews: false, forceReRender: 0 });
    useEffect(() => {
        const availableDevicesChanged = () => {
            setState((cur) => ({
                ...cur,
                forceReRender: cur.forceReRender + 1
            }));
        };
        recordingDirector.addOnUpdateDevicesListener(availableDevicesChanged);
        return () => {
            recordingDirector.removeOnUpdateDevicesListener(availableDevicesChanged);
        };
    }, [recordingDirector]);

    const handleShowPreview = () => setState(cur => ({ ...cur, showPreviews: true }));

    const handleHidePreview = () => setState(cur => ({ ...cur, showPreviews: false }));

    const button = showPreviews ? <button onClick={handleHidePreview}>Hide Previews</button> : <button onClick={handleShowPreview}>Show Previews</button>;
    const previews = showPreviews ? recordingDirector.cameras()
        .map((device, index) => <CameraPreview key={device.deviceId} index={index} device={device} recordingDirector={recordingDirector}/>) : null;
    const style: CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };
    return (
        <div style={style}>
            {button}
            {previews}
        </div>
    );
};
