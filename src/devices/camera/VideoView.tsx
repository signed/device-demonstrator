import React, { CSSProperties, useState } from 'react';
import { MediaStreamTrackView } from './MediaStreamTrackView';
import { VideoElement } from './VideoElement';

export interface VideoViewProps {
    title: string;
}

export const VideoView: React.FC<VideoViewProps> = (props) => {
    const { title } = props;
    const [source, setSource] = useState<MediaStream | null>(null);

    const handleStart = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream: MediaStream) => setSource(() => stream))
            .catch((err: Error) => alert(err));
    };

    const triggerRender = () => {
        setSource(prev => prev);
    };

    const tracks = (): Array<MediaStreamTrack> => {
        const maybeStream = source;
        if (null === maybeStream) {
            return [];
        }
        return maybeStream.getTracks();
    };

    const handlePause = () => {
        tracks().forEach(track => track.enabled = false);
        triggerRender();
    };

    const handleContinue = () => {
        tracks().forEach(track => track.enabled = true);
        triggerRender();
    };

    const handleStop = () => {
        tracks().forEach(track => track.stop());
        triggerRender();
    };

    const handleDetach = () => {
        setSource(null);
    };

    const topStyles: CSSProperties = {
        display: 'flex'
    };

    const controlStyles: CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };

    const tracks1 = tracks().map(track => {
        return (<li key={track.id}>
            <MediaStreamTrackView enabled={track.enabled} id={track.id} kind={track.kind} label={track.label} muted={track.muted} readyState={track.readyState} track={track}/>
        </li>);
    });
    return (
        <div style={topStyles}>
            <h1>{title}</h1>
            <div style={controlStyles}>
                <button onClick={handleStart}>start</button>
                <button onClick={handlePause}>pause</button>
                <button onClick={handleContinue}>continue</button>
                <button onClick={handleStop}>stop</button>
                <button onClick={handleDetach}>detach</button>
            </div>
            <VideoElement id="video-chat" srcObject={source} autoPlay={true}/>
            <div>
                <h2>tracks</h2>
                <ul>
                    {tracks1}
                </ul>
            </div>
        </div>
    );
};
