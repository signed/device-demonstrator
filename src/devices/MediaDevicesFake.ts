/**
 * Describes a media device that you an plug into the {@link MediaDevicesFake.attach}
 */
export interface MediaDeviceDescription {
    deviceId: string
    groupId: string
    kind: MediaDeviceKind
    label: string
}

export interface MediaDeviceInfoFake extends MediaDeviceInfo {

}

export class MediaDeviceInfoFake implements MediaDeviceInfoFake {
    get deviceId(): string {
        return '';
    }

    get groupId(): string {
        return '';
    }

    get kind(): MediaDeviceKind {
        return 'audiooutput';
    }

    get label(): string {
        return 'fake';
    }

    toJSON(): any {

    }

}

type DeviceChangeListener = (this: MediaDevices, ev: Event) => any

export class MediaDevicesFake implements MediaDevices {
    private _onDeviceChangeListener: DeviceChangeListener | null = null;
    private readonly deviceChangeListeners: DeviceChangeListener [] = [];

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
            throw new Error('not implemented')
        }
        if (type !== 'devicechange') {
            throw new Error('not implemented')
        }
        this.deviceChangeListeners.push(listener);
    }

    dispatchEvent(event: Event): boolean {
        throw new Error('not implemented');
    }

    enumerateDevices(): Promise<MediaDeviceInfo[]> {
        return Promise.resolve([]);
    }

    getSupportedConstraints(): MediaTrackSupportedConstraints {
        throw new Error('not implemented');
    }

    getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
        throw new Error('not implemented');
    }

    removeEventListener<K extends keyof MediaDevicesEventMap>(type: K, listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    removeEventListener(type: any, listener: any, options?: boolean | EventListenerOptions): void {
        throw new Error('not implemented');
    }

    public attach(_device: MediaDeviceDescription) {
        const event = new Event('stand-in');
        if (this._onDeviceChangeListener) {
            this._onDeviceChangeListener(event);
        }
        this.deviceChangeListeners.forEach(listener => listener.call(this, event))
    }

    public remove(_device: MediaDeviceDescription) {

    }
}
