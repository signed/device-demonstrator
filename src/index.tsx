import React, { CSSProperties, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

interface HTMLVideoElementProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    srcObject: MediaStream | null;
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

    constructor(props: VideoViewProps) {
        super(props);
        this.state = { source: null };
    }

    private handleStart = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream: MediaStream) => {
                this.setState({
                    source: stream
                });
            }).catch((err: Error) => {
            alert(err);
        });
    };

    private handlePause = () => {
        this.tracks().forEach(track => track.enabled = false);
        this.triggerRender();
    };

    private handleContinue = () => {
        this.tracks().forEach(track => track.enabled = true);
        this.triggerRender();
    };

    private handleStop = () => {
        this.tracks().forEach(track => track.stop());
        this.triggerRender();
    };

    private tracks(): Array<MediaStreamTrack> {
        const maybeStream = this.state.source;
        if (null === maybeStream) {
            return [];
        }
        return maybeStream.getTracks();
    }

    private handleDetach = () => {
        this.setState({ source: null });
    };

    render() {
        const topStyles: CSSProperties = {
            display: 'flex'
        };
        const controlStyles: CSSProperties = {
            display: 'flex',
            flexDirection: 'column'
        };

        const tracks = this.tracks().map(track => (<li key={track.id}>{track.id + ' enabled: ' + track.enabled + ' kind: ' + track.kind + ' label: ' + track.label + ' muted: ' + track.muted + ' readyState: ' + track.readyState}</li>));
        return (
            <div style={topStyles}>
                <h1>{this.props.title}</h1>
                <div style={controlStyles}>
                    <button onClick={this.handleStart}>start</button>
                    <button onClick={this.handlePause}>pause</button>
                    <button onClick={this.handleContinue}>continue</button>
                    <button onClick={this.handleStop}>stop</button>
                    <button onClick={this.handleDetach}>detach</button>
                </div>
                <VideoElement id="video-chat" srcObject={this.state.source} autoPlay={true}/>
                <div>
                    <h2>tracks</h2>
                    <ul>
                        {tracks}
                    </ul>
                </div>
            </div>
        );
    }

    private triggerRender() {
        this.setState(this.state);
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
