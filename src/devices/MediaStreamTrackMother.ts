import { initialMediaStreamTrackProperties, MediaStreamTrackFake, MediaStreamTrackProperties } from './MediaStreamTrackFake';

export const anyMediaStreamTrack = (overrides: Partial<MediaStreamTrackProperties> = {}) => {
    const initial = initialMediaStreamTrackProperties();
    const properties = { ...initial, ...overrides };
    return new MediaStreamTrackFake(properties);
};
