import { MediaDeviceDescription } from './MediaDeviceDescription';
import { MediaDevicesFake } from './MediaDevicesFake';
import { passUndefined, Scenario } from '../test-rig/Scenarios';
import '../../to-be-uuid'

// this looks interesting
// https://github.com/fippo/dynamic-getUserMedia/blob/master/content.js

const anyDevice = (override: Partial<MediaDeviceDescription> = {}): MediaDeviceDescription => {
    return {
        deviceId: 'camera-device-id',
        groupId: 'camera-group-id',
        kind: 'videoinput',
        label: 'Acme camera (HD)',
        ...override
    };
};

const runAndReport = async (fake: MediaDevicesFake, scenario: Scenario) => {
    const stream = fake.getUserMedia(scenario.constraints);
    const results = await Promise.all(scenario.expected.checks.map(async check => {
        return {
            what: check.what,
            details: await check.predicate(stream)
        };
    }));

    return results.filter(check => !check.details.success)
        .map((failed) => {
            const lines = [];
            lines.push('check: ' + failed.what);
            const messages = failed.details.messages ?? ['no message'];
            messages.map(message => ` - ${message}`).forEach(line => lines.push(line));
            return lines.join('\n');
        }).join('\n');
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
        test('no longer inform removed listeners', () => {
            const ondevicechange = jest.fn();
            const eventListener = jest.fn();

            fake.ondevicechange = ondevicechange;
            fake.addEventListener('devicechange', eventListener);

            fake.ondevicechange = null;
            fake.removeEventListener('devicechange', eventListener);

            fake.attach(anyDevice());
            expect(ondevicechange).not.toHaveBeenCalled();
            expect(eventListener).not.toHaveBeenCalled();
        });
        test('enumerate devices lists attached device', () => {
            const device = anyDevice({
                kind: 'audioinput',
                label: 'device label',
                groupId: 'the group id',
                deviceId: 'the device id'
            });
            fake.attach(device);
            return fake.enumerateDevices().then((devices) => {
                expect(devices).toHaveLength(1);
                const deviceInfo = devices[0];
                expect(deviceInfo.kind).toBe('audioinput');
                expect(deviceInfo.label).toBe('device label');
                expect(deviceInfo.groupId).toBe('the group id');
                expect(deviceInfo.deviceId).toBe('the device id');
            });
        });
        test('rejects adding two devices with the same groupId:deviceId', () => {
            const one = anyDevice({ groupId: 'group id', deviceId: 'device id' });
            const two = anyDevice({ groupId: 'group id', deviceId: 'device id' });
            fake.attach(one);
            expect(() => fake.attach(two)).toThrow();
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
        test('enumerate devices no longer lists the device', () => {
            const device = anyDevice();
            fake.attach(device);
            fake.remove(device);
            return fake.enumerateDevices()
                .then(devices => expect(devices).toHaveLength(0));
        });
    });

    describe('getUserMedia', () => {

        describe('no constraints', () => {
            test('returns type error', () => {
                const stream = fake.getUserMedia();
                return expect(stream).rejects.toThrow(new TypeError(`Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested`));
            });

            test('scenario', async () => {
                expect(await runAndReport(fake, passUndefined)).toBe('');
            });

        });

        test('not passing video and audio property results in type error with message ', () => {
            const stream = fake.getUserMedia({});
            return expect(stream).rejects.toThrow(new TypeError(`Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested`));
        });

        test.skip('reject promise in case no videoinput device is attached', () => {
            const stream = fake.getUserMedia({
                video: {
                    deviceId: 'no-videoinput-device'
                }
            });
            return expect(stream).rejects.toBeDefined();
        });

        test('return videoinput with matching device id', async () => {
            fake.attach(anyDevice({ kind: 'videoinput', deviceId: 'attached' }));
            const stream = await fake.getUserMedia({ video: { deviceId: 'attached' } });
            expect(stream).toBeDefined();
            expect(stream.getTracks()).toHaveLength(1)
            const track = stream.getTracks()[0];
            expect(track.id).toBeUuid()
            expect(track.enabled).toBe(true)
            expect(track.readyState).toBe('live')
        });
    });
});
