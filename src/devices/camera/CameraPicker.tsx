import React, { CSSProperties } from 'react';
import { VideoElement } from './VideoElement';
import { Device, MediaStreamSubscription, RecordingDirector } from './RecordingDirector';

export interface CameraPreviewProps {
    recordingDirector: RecordingDirector;
    device: Device;
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
            this.setState({stream:null, mediaStreamSubscription: undefined})
        }
    }

    render() {
        const maybeStream = this.state.stream;
        return (
            <div>
                <h4>{this.props.device.label}</h4>
                {maybeStream !== null && <div>{maybeStream.id}</div>}
                {this.state !== undefined && <VideoElement onClick={this.handleSelect} width={150} srcObject={maybeStream} autoPlay={true}/>}
            </div>
        );
    }

    private handleSelect = () => {
        this.props.recordingDirector.selectCamera(this.props.device)
    }
}

export interface CameraPickerProps {
    recordingDirector: RecordingDirector
}

export interface CameraPickerState {
    showPreviews: boolean;
}

export class CameraPicker extends React.Component<CameraPickerProps, CameraPickerState> {

    constructor(props: CameraPickerProps) {
        super(props);
        this.state = { showPreviews: false };
    }

    render() {
        const button = this.state.showPreviews ? <button onClick={this.handleHidePreview}>Hide Previews</button> : <button onClick={this.handleShowPreview}>Show Previews</button>;
        const previews = this.state.showPreviews ? this.props.recordingDirector.cameras().map(device => <CameraPreview key={device.deviceId} device={device} recordingDirector={this.props.recordingDirector}/>) : null;
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
    }

    private handleShowPreview = () => {
        this.setState({ showPreviews: true });
    };

    private handleHidePreview = () => {
        this.setState({ showPreviews: false });
    };
}
