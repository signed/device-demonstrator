import { uuidV4 } from './MediaDevicesFake';
import { initialMediaStreamTrackProperties, MediaStreamTrackFake, MediaStreamTrackProperties } from './MediaStreamTrackFake';

export const anyMediaStreamTrack = (overrides: Partial<MediaStreamTrackProperties> = {}) => {
    const initial = initialMediaStreamTrackProperties();
    const properties = { ...initial, ...overrides };
    return new MediaStreamTrackFake(uuidV4(), properties);
};
