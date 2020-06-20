import { MediaDeviceDescription, MediaDevicesFake } from './MediaDevicesFake';

// this looks interesting
// https://github.com/fippo/dynamic-getUserMedia/blob/master/content.js

const anyDevice = (override: Partial<MediaDeviceDescription> = {}): MediaDeviceDescription => {
    return {
        deviceId: 'camera-device-id',
        groupId: 'camera-group-it',
        kind: 'videoinput',
        label: 'Acme camera (HD)',
        ...override
    };
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
            fake.attach(anyDevice());
            expect(ondevicechange).toHaveBeenCalled();
            expect(eventListener).toHaveBeenCalled();
        });
        test('enumerate devices lists attached devices', () => {
            const device = anyDevice({
                kind: 'audioinput',
                label: 'device label',
                groupId: 'the group id',
                deviceId: 'the device id',
            });
            fake.attach(device);
            return fake.enumerateDevices().then((devices) => {
                expect(devices).toHaveLength(1);
                const deviceInfo = devices[0];
                expect(deviceInfo.kind).toBe('audioinput')
                expect(deviceInfo.label).toBe('device label')
                expect(deviceInfo.groupId).toBe('the group id')
                expect(deviceInfo.deviceId).toBe('the device id')
            });
        });
    });

    describe('remove', () => {
        test('inform the listeners', () => {
            const ondevicechange = jest.fn();
            const eventListener = jest.fn();

            const device = anyDevice();
            fake.attach(device);
            fake.ondevicechange = ondevicechange;
            fake.addEventListener('devicechange', eventListener);

            fake.remove(device);

            expect(ondevicechange).toHaveBeenCalled();
            expect(eventListener).toHaveBeenCalled();
        });
    });
});
