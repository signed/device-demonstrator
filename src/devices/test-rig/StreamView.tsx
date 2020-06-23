import React, { CSSProperties, useState } from 'react';
import { MediaStreamTrackView } from './MediaStreamTrackView';
import { VideoElement } from '../VideoElement';

export interface StreamViewProps {
    stream: MediaStream | null
}

export const StreamView: React.FC<StreamViewProps> = (props) => {
    const { stream } = props;
    const [_, forceRender] = useState(true);

    const triggerRender = () => {
        forceRender(prev => !prev);
    };

    const tracks = (): Array<MediaStreamTrack> => {
        const maybeStream = stream;
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

    const topStyles: CSSProperties = {
        display: 'flex'
    };

    const controlStyles: CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };

    const tracksNode = tracks().map(track => {
        return (<li key={track.id}>
            <MediaStreamTrackView enabled={track.enabled} id={track.id} kind={track.kind} label={track.label} muted={track.muted} readyState={track.readyState} track={track}/>
        </li>);
    });
    return (
        <div style={topStyles}>
            <h1>Scenario View</h1>
            <div style={controlStyles}>
                <button onClick={handlePause}>pause</button>
                <button onClick={handleContinue}>continue</button>
                <button onClick={handleStop}>stop</button>
            </div>
            <VideoElement id="video-chat" srcObject={stream} autoPlay={true}/>
            {stream && <div>
                <h2>stream</h2>
                <ul>
                    <li>id: {stream.id}</li>
                    <li>active: {JSON.stringify(stream.active)}</li>
                </ul>
                <h2>tracks</h2>
                <ul>
                    {tracksNode}
                </ul>
            </div>}
        </div>
    );
};
