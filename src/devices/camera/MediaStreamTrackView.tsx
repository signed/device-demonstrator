import React from 'react';
import { Json } from './Json';

export type MediaStreamTrackViewProps = Pick<MediaStreamTrack, 'id' | 'enabled' | 'kind' | 'label' | 'muted' | 'readyState'> & { track: MediaStreamTrack }

export class MediaStreamTrackView extends React.Component<MediaStreamTrackViewProps> {
    render() {
        const track = this.props.track;
        return (
            <dl>
                <dt>id</dt>
                <dd>{this.props.id}</dd>
                <dt>readyState</dt>
                <dd>{this.props.readyState}</dd>
                <dt>enabled</dt>
                <dd>{String(this.props.enabled)}</dd>
                <dt>kind</dt>
                <dd>{this.props.kind}</dd>
                <dt>label</dt>
                <dd>{this.props.label}</dd>
                <dt>muted</dt>
                <dd>{String(this.props.muted)}</dd>
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
    }
}
