import { uuidV4 } from './MediaDevicesFake';
import { MediaStreamTrackFake } from './MediaStreamTrackFake';
import '../to-be-uuid';

describe('MediaStreamTrackFake', () => {
    let track: MediaStreamTrackFake;

    beforeEach(() => {
        track = new MediaStreamTrackFake(uuidV4());
    });

    test('enabled by default', () => {
        expect(track.enabled).toBe(true);
    });

    test('id is a uuid', () => {
        expect(track.id).toBeUuid();
    });

    test('can be paused', () => {
        track.enabled = false;
        expect(track.enabled).toBe(false);
    });

    test('live by default', () => {
        expect(track.readyState).toBe('live')
    });

    test('ended after stop', () => {
        track.stop()
        expect(track.readyState).toBe('ended')
    });
});

test('actual uuid', () => {
    expect('407aa314-56a7-40ff-815c-60c52baed9b3').toBeUuid();
});

test('generated uuid', () => {
    expect(uuidV4()).toBeUuid();
});
