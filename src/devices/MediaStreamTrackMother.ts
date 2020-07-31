import { initialMediaStreamTrackProperties, MediaStreamTrackFake, MediaStreamTrackProperties, TrackKind } from './MediaStreamTrackFake';

export const anyTrackKind = (): TrackKind => 'video';

export const anyMediaStreamTrack = (overrides: Partial<MediaStreamTrackProperties> = {}) => {
    const initial = initialMediaStreamTrackProperties(anyTrackKind());
    const properties = { ...initial, ...overrides };
    return new MediaStreamTrackFake(properties);
};
