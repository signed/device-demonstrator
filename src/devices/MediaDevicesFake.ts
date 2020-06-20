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

export class MediaDeviceInfoDefaultFake implements MediaDeviceInfoFake {
    constructor(
        private readonly mediaDeviceDescription: MediaDeviceDescription
    ) {
    }

    get deviceId(): string {
        return this.mediaDeviceDescription.deviceId;
    }

    get groupId(): string {
        return this.mediaDeviceDescription.groupId;
    }

    get kind(): MediaDeviceKind {
        return this.mediaDeviceDescription.kind;
    }

    get label(): string {
        return this.mediaDeviceDescription.label;
    }

    toJSON(): any {
        throw new Error('not implemented')
    }
}

type DeviceChangeListener = (this: MediaDevices, ev: Event) => any

export class MediaDevicesFake implements MediaDevices {
    private readonly deviceChangeListeners: DeviceChangeListener [] = [];
    private readonly devices: MediaDeviceInfoDefaultFake [] = [];
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
            throw new Error('not implemented');
        }
        if (type !== 'devicechange') {
            throw new Error('not implemented');
        }
        this.deviceChangeListeners.push(listener);
    }

    dispatchEvent(event: Event): boolean {
        throw new Error('not implemented');
    }

    enumerateDevices(): Promise<MediaDeviceInfo[]> {
        return Promise.resolve([...this.devices]);
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

    public attach(mediaDeviceDescription: MediaDeviceDescription) {
        // make a defensive copy to stop manipulation after attaching the device
        const infoDefaultFake = new MediaDeviceInfoDefaultFake({ ...mediaDeviceDescription });
        this.devices.push(infoDefaultFake);
        this.informDeviceChangeListener();
    }

    public remove(_device: MediaDeviceDescription) {
        this.informDeviceChangeListener();
    }

    private informDeviceChangeListener() {
        const event = new Event('stand-in');
        if (this._onDeviceChangeListener) {
            this._onDeviceChangeListener(event);
        }
        this.deviceChangeListeners.forEach(listener => listener.call(this, event));
    }
}
