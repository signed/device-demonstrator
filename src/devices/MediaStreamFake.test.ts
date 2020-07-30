import { MediaStreamFake, mediaStreamId } from './MediaStreamFake';
import { anyMediaStreamTrack } from './MediaStreamTrackMother';

describe('MediaStreamFake', () => {
    test('create a new one', () => {
        expect(new MediaStreamFake(mediaStreamId(),[])).toBeDefined();
    });
    test('do not leak internal state ', () => {
        const fake = new MediaStreamFake(mediaStreamId(),[]);
        fake.getTracks().push(anyMediaStreamTrack())
        expect(fake.getTracks()).toHaveLength(0);
    });
});

describe('mediaStreamId', () => {
    test('length of 36 characters', () => {
        expect(mediaStreamId()).toHaveLength(36)
    });
});
