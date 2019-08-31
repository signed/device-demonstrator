import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

interface HTMLVideoElementProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    srcObject: MediaSource | null;
}

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

class VideoView extends React.Component {
    state = {
        source: null
    };

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(this.handleVideo)
            .catch(this.videoError);
    }

    handleVideo = (stream: MediaStream) => {
        this.setState({
            source: stream
        });
    };

    videoError = (err: Error) => {
        alert(err);
    };

    render() {
        return (
            <VideoElement id="video-chat" srcObject={this.state.source} autoPlay={true}/>
        );
    }
}

const renderApplication = () => {
    ReactDOM.render(<div>
        <VideoView/>
        <App/>
    </div>, document.getElementById('root'));
};


renderApplication();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
