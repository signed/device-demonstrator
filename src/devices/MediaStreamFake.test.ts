import { MediaStreamFake, MediaStreamTrackFake } from './MediaStreamFake';

describe('MediaStreamFake', () => {
    test('create a new one', () => {
        expect(new MediaStreamFake([])).toBeDefined();
    });
    test('do not leak internal state ', () => {
        const fake = new MediaStreamFake([]);
        fake.getTracks().push(new MediaStreamTrackFake())
        expect(fake.getTracks()).toHaveLength(0);
    });
});
