import React, { CSSProperties, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

interface HTMLVideoElementProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    srcObject: MediaSource | null;
}

const logDeviceInformation = () => {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                console.log(device.kind + ': ' + device.label +
                    ' id = ' + device.deviceId);
            });
        })
        .catch(function (err) {
            console.log(err.name + ': ' + err.message);
        });
};

const VideoElement: React.FC<HTMLVideoElementProps> = ({ srcObject = null, muted = false, ...rest }) => {
    const videoElement = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const node = videoElement.current;
        if (node === null) {
            return;
        }
        if (node.srcObject !== srcObject) {
            node.srcObject = srcObject;
        }
        if (node.muted !== muted) {
            node.muted = muted;
        }
    }, [srcObject, muted]);
    return <video {...rest} ref={videoElement}/>;
};

interface VideoViewProps {
    title: string;
}

interface VideoViewState {
    source: MediaStream | null;
}

class VideoView extends React.Component<VideoViewProps, VideoViewState> {
    state = {
        source: null
    };

    private handleVideo = (stream: MediaStream) => {
        logDeviceInformation();
        this.setState({
            source: stream
        });
    };

    private handleStart = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(this.handleVideo)
            .catch(this.videoError);
    };

    private handlePause = () => {
        const maybeStream = this.state.source;
        if (null === maybeStream) {
            return;
        }
        const stream = maybeStream as MediaStream;
        stream.getVideoTracks().forEach(track => track.enabled=false);
    };

    private handleContinue = () => {
        const maybeStream = this.state.source;
        if (null === maybeStream) {
            return;
        }
        const stream = maybeStream as MediaStream;
        stream.getVideoTracks().forEach(track => track.enabled=true);
    };


    private handleStop = () => {
        const maybeStream = this.state.source;
        if (null === maybeStream) {
            return;
        }
        const stream = maybeStream as MediaStream;
        stream.getVideoTracks().forEach(track => track.stop());
        this.setState({ source: null });
    };

    videoError = (err: Error) => {
        alert(err);
    };

    render() {
        const topStyles: CSSProperties = {
            display: 'flex'
        };
        const controlStyles: CSSProperties = {
            display: 'flex',
            flexDirection: 'column'
        };
        return (
            <div style={topStyles}>
                <h1>{this.props.title}</h1>
                <div style={controlStyles}>
                    <button onClick={this.handleStart}>start</button>
                    <button onClick={this.handlePause}>pause</button>
                    <button onClick={this.handleContinue}>continue</button>
                    <button onClick={this.handleStop}>stop</button>
                </div>
                <VideoElement id="video-chat" srcObject={this.state.source} autoPlay={true}/>
            </div>
        );
    }
}

const renderApplication = () => {
    ReactDOM.render(<div>
        <VideoView title={'one'}/>
        <VideoView title={'two'}/>
    </div>, document.getElementById('root'));
};

logDeviceInformation();
renderApplication();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
