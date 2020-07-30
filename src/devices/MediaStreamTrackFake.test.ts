import { uuidV4 } from './MediaDevicesFake';
import { MediaStreamTrackFake } from './MediaStreamTrackFake';
import '../to-be-uuid'

describe('MediaStreamTrackFake', () => {
    test('enabled by default', () => {
        expect(new MediaStreamTrackFake(uuidV4()).enabled).toBe(true);
    });

    test('id is a uuid', () => {
        expect(new MediaStreamTrackFake(uuidV4()).id).toBeUuid();
    });
    test('can be paused', () => {
        const track = new MediaStreamTrackFake(uuidV4());

        track.enabled = false
        expect(track.enabled).toBe(false);
    });
});

test('actual uuid', () => {
    expect('407aa314-56a7-40ff-815c-60c52baed9b3').toBeUuid()
});

test('generated uuid', () => {
    expect(uuidV4()).toBeUuid();
});
