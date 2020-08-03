import { Deferred } from './Deffered';
import { MediaDeviceDescription } from './MediaDeviceDescription';
import { MediaDeviceInfoFake } from './MediaDeviceInfoFake';
import { MediaStreamFake, mediaStreamId } from './MediaStreamFake';
import { initialMediaStreamTrackProperties, MediaStreamTrackFake } from './MediaStreamTrackFake';
import { notImplemented } from './not-implemented';

type DeviceChangeListener = (this: MediaDevices, ev: Event) => any

const deviceMatching = (description: MediaDeviceDescription) => (device: MediaDeviceInfoFake) => device.deviceId === description.deviceId && device.groupId === description.groupId;

export const uuidV4 = () => {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

const toMediaDeviceDescription = (device: MediaDeviceInfoFake): MediaDeviceDescription => ({ deviceId: device.deviceId, groupId: device.groupId, label: device.label, kind: device.kind });

export class MediaDevicesFake implements MediaDevices {
    private readonly deviceChangeListeners: DeviceChangeListener [] = [];
    private readonly devices: MediaDeviceInfoFake [] = [];
    private _onDeviceChangeListener: DeviceChangeListener | null = null;

    get ondevicechange(): DeviceChangeListener | null {
        return this._onDeviceChangeListener;
    }

    set ondevicechange(listener: DeviceChangeListener | null) {
        this._onDeviceChangeListener = listener;
    }

    addEventListener<K extends keyof MediaDevicesEventMap>(type: K, listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: any, listener: any, options?: boolean | AddEventListenerOptions): void {
        if (options) {
            throw notImplemented();
        }
        if (type !== 'devicechange') {
            throw notImplemented();
        }
        this.deviceChangeListeners.push(listener);
    }

    removeEventListener<K extends keyof MediaDevicesEventMap>(type: K, listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    removeEventListener(type: any, listener: any, options?: boolean | EventListenerOptions): void {
        if (options) {
            throw notImplemented();
        }
        if (type !== 'devicechange') {
            throw notImplemented();
        }
        const index = this.deviceChangeListeners.indexOf(listener);
        if (index >= 0) {
            this.deviceChangeListeners.splice(index, 1);
        }
    }

    dispatchEvent(event: Event): boolean {
        throw notImplemented();
    }

    enumerateDevices(): Promise<MediaDeviceInfo[]> {
        return Promise.resolve([...this.devices]);
    }

    getSupportedConstraints(): MediaTrackSupportedConstraints {
        throw notImplemented();
    }

    // https://w3c.github.io/mediacapture-main/#methods-5
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    // https://blog.addpipe.com/common-getusermedia-errors/
    getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
        if (constraints === undefined ||
            Object.keys(constraints).length === 0 ||
            (constraints.video === false && constraints.audio === false)) {
            return Promise.reject(new TypeError(`Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested`));
        }
        if (constraints?.peerIdentity) {
            throw notImplemented('peerIdentity constraint not implemented');
        }
        if (constraints?.audio) {
            throw notImplemented('audio constraint not implemented');
        }
        const video = constraints?.video;
        if (video === undefined) {
            throw notImplemented('current implementation requires a video constraint');
        }

        if (typeof video === 'boolean') {
            const maybeDevice = this.devices.find(device => device.kind === 'videoinput');
            if (maybeDevice === undefined) {
                return Promise.reject(new DOMException('Requested device not found'));
            }
            const mediaTrack = new MediaStreamTrackFake(initialMediaStreamTrackProperties(maybeDevice.label, 'video'));
            const mediaTracks = [mediaTrack];
            return Promise.resolve(new MediaStreamFake(mediaStreamId(), mediaTracks));
        }

        const passedProperties = Object.getOwnPropertyNames(video);
        const implementedProperties: (keyof MediaTrackConstraintSet) [] = ['deviceId'];
        const unsupported = passedProperties.filter(arg => !implementedProperties.some(im => im === arg));
        if (unsupported.length) {
            throw notImplemented(`constraint not implemented ${unsupported}`);
        }
        if (video.deviceId === undefined) {
            throw notImplemented('current implementation requires a deviceId');
        }
        const requestedKind = 'videoinput';
        const matchingKind = this.devices.filter(device => device.kind === requestedKind);
        if (matchingKind.length === 0) {
            return Promise.reject(new DOMException('Requested device not found'));
        }
        let device = matchingKind.find(device => device.deviceId === video.deviceId);
        if (device === undefined) {
            device = matchingKind[0];
        }
        //todo permission management
        const mediaTrack = new MediaStreamTrackFake(initialMediaStreamTrackProperties(device.label, 'video'));
        const mediaTracks = [mediaTrack];
        const deferred = new Deferred<MediaStream>();
        deferred.resolve(new MediaStreamFake(mediaStreamId(), mediaTracks));
        return deferred.promise;
    }

    public noDevicesAttached() {
        this.devices.map(device => toMediaDeviceDescription(device))
            .forEach(descriptor => this.remove(descriptor));
    }

    public attach(toAdd: MediaDeviceDescription) {
        if (this.devices.some(deviceMatching(toAdd))) {
            throw notImplemented(`device with this description already attached
${JSON.stringify(toAdd, null, 2)}`);
        }
        // make a defensive copy to stop manipulation after attaching the device
        const infoDefaultFake = new MediaDeviceInfoFake({ ...toAdd });
        this.devices.push(infoDefaultFake);
        this.informDeviceChangeListener();
    }

    public remove(toRemove: MediaDeviceDescription) {
        const index = this.devices.findIndex(deviceMatching(toRemove));
        if (index >= 0) {
            this.devices.splice(index, 1);
            this.informDeviceChangeListener();
        }
    }

    private informDeviceChangeListener() {
        const event = new Event('stand-in');
        if (this._onDeviceChangeListener) {
            this._onDeviceChangeListener(event);
        }
        this.deviceChangeListeners.forEach(listener => listener.call(this, event));
    }
}
