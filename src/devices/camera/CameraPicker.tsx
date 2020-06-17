import React, { CSSProperties, useEffect, useState } from 'react';
import { Device, MediaStreamSubscription, RecordingDirector } from './RecordingDirector';
import { VideoElement } from './VideoElement';

export interface CameraPreviewProps {
    recordingDirector: RecordingDirector;
    device: Device;
    index: number;
}

export interface CameraPreviewState {
    mediaStreamSubscription: MediaStreamSubscription | undefined
    stream: MediaStream | null;
    streamError: boolean;
}

export class CameraPreview extends React.Component<CameraPreviewProps, CameraPreviewState> {

    constructor(props: CameraPreviewProps) {
        super(props);
        this.state = { mediaStreamSubscription: undefined, streamError: false, stream: null };
    }

    componentDidMount(): void {
        const mediaStreamSubscription = this.props.recordingDirector.videoStreamSubscriptionFor(this.props.device);
        this.setState({ mediaStreamSubscription });
        mediaStreamSubscription.stream
            .then(stream => this.setState({ stream }))
            .catch(() => this.setState({ streamError: true }));
    }

    componentWillUnmount(): void {
        const maybeSubscription = this.state.mediaStreamSubscription;
        if (maybeSubscription !== undefined) {
            maybeSubscription.cancel();
            this.setState({ stream: null, mediaStreamSubscription: undefined });
        }
    }

    render() {
        const maybeStream = this.state.stream;
        const device = this.props.device;
        return (
            <div>
                <h4>Camera {this.props.index}</h4>
                <ul>
                    <li>device label: {device.label}</li>
                    <li>device id: {device.deviceId}</li>
                    <li>group id: {device.groupId}</li>
                    <li>stream id: {maybeStream?.id ?? 'no-stream'}</li>
                </ul>
                {<VideoElement onClick={this.handleSelect} width={150} srcObject={maybeStream} autoPlay={true}/>}
            </div>
        );
    }

    private handleSelect = () => {
        this.props.recordingDirector.selectCamera(this.props.device);
    };
}

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
