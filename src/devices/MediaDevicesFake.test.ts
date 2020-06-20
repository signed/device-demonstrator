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
    let fake: MediaDevicesFake;
    beforeEach(() => {
        fake = new MediaDevicesFake();
    });

    describe('attach', () => {
        test('inform the listeners', () => {
            const ondevicechange = jest.fn();
            const eventListener = jest.fn();

            fake.ondevicechange = ondevicechange;
            fake.addEventListener('devicechange', eventListener);
            fake.attach(camera);
            expect(ondevicechange).toHaveBeenCalled();
            expect(eventListener).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        test('inform the listeners', () => {
            const ondevicechange = jest.fn();
            const eventListener = jest.fn();

            fake.attach(camera);
            fake.ondevicechange = ondevicechange;
            fake.addEventListener('devicechange', eventListener);

            fake.remove(camera);

            expect(ondevicechange).toHaveBeenCalled();
            expect(eventListener).toHaveBeenCalled();
        });
    });
});
