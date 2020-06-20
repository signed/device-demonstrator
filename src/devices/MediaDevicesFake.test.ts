import { MediaDeviceDescription, MediaDevicesFake } from './MediaDevicesFake';


// this looks interesting
// https://github.com/fippo/dynamic-getUserMedia/blob/master/content.js

const camera: MediaDeviceDescription = {
    deviceId: 'camera-device-id',
    groupId: 'camera-group-it',
    kind: 'videoinput',
    label: 'Acme camera (HD)'
};

describe('attach device', () => {
    describe('inform listeners', () => {
        test('ondevicechange property', () => {
            const listener = jest.fn();
            const fake = new MediaDevicesFake();
            fake.ondevicechange = listener;
            fake.attach(camera);
            expect(listener).toHaveBeenCalled();
        });

        test('device change listener ', () => {
            const listener = jest.fn();
            const fake = new MediaDevicesFake();
            fake.addEventListener('devicechange', listener)
            fake.attach(camera);
            expect(listener).toHaveBeenCalled();
        });

    });
});
