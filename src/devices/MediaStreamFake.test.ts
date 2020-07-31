import { MediaStreamFake, mediaStreamId } from './MediaStreamFake';
import { anyMediaStreamTrack } from './MediaStreamTrackMother';

describe('MediaStreamFake', () => {
    test('create a new one', () => {
        expect(new MediaStreamFake(mediaStreamId(), [])).toBeDefined();
    });

    test('do not leak internal state ', () => {
        const fake = new MediaStreamFake(mediaStreamId(), []);
        fake.getTracks().push(anyMediaStreamTrack());
        expect(fake.getTracks()).toHaveLength(0);
    });

    test('derive active state from contained tracks', () => {
        const liveTrack = anyMediaStreamTrack({ readyState: 'live' });
        const fake = new MediaStreamFake(mediaStreamId(), [liveTrack]);
        expect(fake.active).toBe(true)
        liveTrack.stop()
        expect(fake.active).toBe(false)
    });

    test('filtered tracks', () => {
        const audioTrack = anyMediaStreamTrack({ kind: 'audio' });
        const videoTrack = anyMediaStreamTrack({ kind: 'video' });
        const fake = new MediaStreamFake(mediaStreamId(), [audioTrack, videoTrack]);
        expect(fake.getAudioTracks()).toEqual([audioTrack])
        expect(fake.getVideoTracks()).toEqual([videoTrack])
    });
});

describe('mediaStreamId', () => {
    test('length of 36 characters', () => {
        expect(mediaStreamId()).toHaveLength(36);
    });
});
