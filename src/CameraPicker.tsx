import React, { CSSProperties } from 'react';
import { VideoElement } from './VideoElement';
import { Device, RecordingDirector } from './RecordingDirector';

export interface CameraPreviewProps {
    streamSource: RecordingDirector;
    device: Device;
}

export interface CameraPreviewState {
    stream: MediaStream | null;
    streamError: boolean;
}

export class CameraPreview extends React.Component<CameraPreviewProps, CameraPreviewState> {

    constructor(props: CameraPreviewProps) {
        super(props);
        this.state = { streamError: false, stream: null };
    }

    componentDidMount(): void {
        this.props.streamSource.videoStreamFor(this.props.device)
            .then(stream => this.setState({ stream }))
            .catch(() => this.setState({ streamError: true }));
    }

    componentWillUnmount(): void {
        const stream = this.state.stream;
        if (stream === null) {
            return;
        }
        stream.getTracks().forEach(track => track.stop());
        this.setState({ stream: null });
    }

    render() {
        return (
            <div>
                <h4>{this.props.device.label}</h4>
                {this.state !== undefined && <VideoElement width={150} srcObject={this.state.stream} autoPlay={true}/>}
            </div>
        );
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
        const previews = this.state.showPreviews ? this.props.recordingDirector.cameras().map(device => <CameraPreview key={device.deviceId} device={device} streamSource={this.props.recordingDirector}/>) : null;
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
