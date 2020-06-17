import React, { useCallback, useEffect, useState } from 'react';
import { Device, MediaStreamSubscription, RecordingDirector } from './RecordingDirector';
import { VideoElement } from './VideoElement';

export interface BigScreenProps {
    recordingDirector: RecordingDirector;
}

export interface BigScreenState {
    device: Device | void;
    stream: MediaStream | null;
    mediaStreamSubscription: MediaStreamSubscription | undefined;
    streamError: boolean;
}

export const BigScreen: React.FC<BigScreenProps> = (props) => {
    console.log('BigScreen called');
    const { recordingDirector } = props;
    const [state, setState] = useState<BigScreenState>({ streamError: false, stream: null, mediaStreamSubscription: undefined, device: undefined });
    const { mediaStreamSubscription } = state;

    console.log('mss: ' + mediaStreamSubscription)

    const closeExistingStream = useCallback(() => {
        if (mediaStreamSubscription !== undefined) {
            mediaStreamSubscription.cancel();
            setState((prev) => ({ ...prev, stream: null, mediaStreamSubscription: undefined }));
        }
    }, [mediaStreamSubscription]);

    useEffect(() => {
        const handleDeviceSelectionChange = (device: Device | void): void => {
            closeExistingStream();
            setState((prev => {
                return { ...prev, device };
            }));
            if (device === undefined) {
                return;
            }
            const mediaStreamSubscription = recordingDirector.videoStreamSubscriptionFor(device);
            setState(prev => {
                return { ...prev, mediaStreamSubscription };
            });
            mediaStreamSubscription.stream
                .then(stream => setState(prev => ({ ...prev, stream })))
                .catch(() => setState(prev => ({ ...prev, streamError: true })));
        };
        recordingDirector.addOnCameraSelectionChanged(handleDeviceSelectionChange);
        return () => {
            recordingDirector.removeOnCameraSelectionChanged(handleDeviceSelectionChange);
            console.log('removed OnCameraSelectionChanged listener');
        };
    }, [recordingDirector, closeExistingStream]);

    useEffect(() => {
        console.log('empty setup')
        return () => {
            console.log('tear down no unmount at least that is the intend')
            closeExistingStream();
            setState(prev => ({ ...prev, device: undefined, streamError: false }));
        };
    }, [closeExistingStream]);

    if (state.device === undefined) {
        return <div>No device selected</div>;
    }
    if (state.stream === null) {
        return <div>Opening stream</div>;
    }

    const handleVideoClicked = () => {
        props.recordingDirector.clearCameraSelection();
    };
    return (
        <div>
            {<VideoElement srcObject={state.stream} autoPlay={true} onClick={handleVideoClicked}/>}
            <div>{state.stream.id}</div>
        </div>
    );
};

export class BigScreenOld extends React.Component<BigScreenProps, BigScreenState> {

    constructor(props: BigScreenProps) {
        super(props);
        this.state = { streamError: false, stream: null, mediaStreamSubscription: undefined, device: undefined };
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
                {<VideoElement srcObject={this.state.stream} autoPlay={true} onClick={this.handleVideoClicked}/>}
                <div>{this.state.stream.id}</div>
            </div>

        );
    }

    private handleVideoClicked = () => {
        this.props.recordingDirector.clearCameraSelection();
    };

    private handleDeviceSelectionChange = (device: Device | void): void => {
        this.closeExistingStream();
        this.setState({ device }, () => {
            if (device === undefined) {
                return;
            }
            const mediaStreamSubscription = this.props.recordingDirector.videoStreamSubscriptionFor(device);
            this.setState({ mediaStreamSubscription });
            mediaStreamSubscription.stream
                .then(stream => this.setState({ stream }))
                .catch(() => this.setState({ streamError: true }));
        });
    };

    private closeExistingStream() {
        const maybeSubscription = this.state.mediaStreamSubscription;
        if (maybeSubscription !== undefined) {
            maybeSubscription.cancel();
            this.setState({ stream: null, mediaStreamSubscription: undefined });
        }
    }
}
