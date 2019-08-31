import React, { CSSProperties } from 'react';
import { MediaStreamTrackView } from './MediaStreamTrackView';
import { VideoElement } from './VideoElement';

export interface VideoViewProps {
    title: string;
}

interface VideoViewState {
    source: MediaStream | null;
}

export class VideoView extends React.Component<VideoViewProps, VideoViewState> {

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

        const tracks = this.tracks().map(track => {
            return (<li key={track.id}>
                <MediaStreamTrackView enabled={track.enabled} id={track.id} kind={track.kind} label={track.label} muted={track.muted} readyState={track.readyState} track={track}/>
            </li>);
        });
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
