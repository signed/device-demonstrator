import React from 'react';
import { Json } from './Json';

export type MediaStreamTrackViewProps = Pick<MediaStreamTrack, 'id' | 'enabled' | 'kind' | 'label' | 'muted' | 'readyState'> & { track: MediaStreamTrack }

export const MediaStreamTrackView: React.FC<MediaStreamTrackViewProps> = (props) => {
    const { track } = props;
    return (
        <dl>
            <dt>id</dt>
            <dd>{props.id}</dd>
            <dt>readyState</dt>
            <dd>{props.readyState}</dd>
            <dt>enabled</dt>
            <dd>{String(props.enabled)}</dd>
            <dt>kind</dt>
            <dd>{props.kind}</dd>
            <dt>label</dt>
            <dd>{props.label}</dd>
            <dt>muted</dt>
            <dd>{String(props.muted)}</dd>
            <dt>capabilities</dt>
            <dd>
                <Json content={track.getCapabilities()}/>
            </dd>
            <dt>constraints</dt>
            <dd>
                <Json content={track.getConstraints()}/>
            </dd>
            <dt>settings</dt>
            <dd>
                <Json content={track.getSettings()}/>
            </dd>
        </dl>
    );
};
