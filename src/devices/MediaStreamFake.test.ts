import { MediaStreamFake, mediaStreamId, MediaStreamTrackFake } from './MediaStreamFake';

describe('MediaStreamFake', () => {
    test('create a new one', () => {
        expect(new MediaStreamFake(mediaStreamId(),[])).toBeDefined();
    });
    test('do not leak internal state ', () => {
        const fake = new MediaStreamFake(mediaStreamId(),[]);
        fake.getTracks().push(new MediaStreamTrackFake())
        expect(fake.getTracks()).toHaveLength(0);
    });
});

describe('mediaStreamId', () => {
    test('length of 36 characters', () => {
        expect(mediaStreamId()).toHaveLength(36)
    });
});
