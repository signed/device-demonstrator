import { uuidV4 } from './MediaDevicesFake';
import { MediaStreamTrackFake } from './MediaStreamTrackFake';

export const anyMediaStreamTrack = () => {
    return new MediaStreamTrackFake(uuidV4())
}
