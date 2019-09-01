import React from 'react';
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

export class BigScreen extends React.Component<BigScreenProps, BigScreenState> {

    constructor(props: BigScreenProps) {
        super(props);
        this.state = { streamError: false, stream: null, device: undefined };
    }

    componentDidMount(): void {
        this.props.recordingDirector.addOnCameraSelectionChanged(this.handleDeviceSelectionChange);
    }

    componentWillUnmount(): void {
        this.props.recordingDirector.removeOnCameraSelectionChanged(this.handleDeviceSelectionChange);
        this.closeExistingStream();
        this.setState({ device: undefined, streamError: false });
    }

    render() {
        if (this.state.device === undefined) {
            return <div>No device selected</div>;
        }
        if (this.state.stream === null) {
            return <div>Opening stream</div>;
        }
        return (
            <div>
                {<VideoElement srcObject={this.state.stream} autoPlay={true}/>}
            </div>
        );
    }

    private handleDeviceSelectionChange = (device: Device | void): void => {
        this.closeExistingStream();
        this.setState({ device }, () => {
            if (device === undefined) {
                return;
            }
            this.props.recordingDirector.videoStreamFor(device)
                .then(stream => this.setState({ stream }))
                .catch(() => this.setState({ streamError: true }));
        });
    };

    private closeExistingStream() {
        this.props.recordingDirector.close(this.state.stream);
        this.setState({ stream: null });
    }
}
