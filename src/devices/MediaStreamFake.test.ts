import { uuidV4 } from './MediaDevicesFake';
import { MediaStreamFake, mediaStreamId } from './MediaStreamFake';
import { MediaStreamTrackFake } from './MediaStreamTrackFake';

describe('MediaStreamFake', () => {
    test('create a new one', () => {
        expect(new MediaStreamFake(mediaStreamId(),[])).toBeDefined();
    });
    test('do not leak internal state ', () => {
        const fake = new MediaStreamFake(mediaStreamId(),[]);
        fake.getTracks().push(new MediaStreamTrackFake(uuidV4()))
        expect(fake.getTracks()).toHaveLength(0);
    });

    new MediaStreamFake(mediaStreamId(), [new MediaStreamTrackFake(uuidV4())])
});

describe('mediaStreamId', () => {
    test('length of 36 characters', () => {
        expect(mediaStreamId()).toHaveLength(36)
    });
});
