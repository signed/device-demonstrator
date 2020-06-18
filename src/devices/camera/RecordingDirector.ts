import { uuid } from 'uuidv4';

export type Device = Pick<MediaDeviceInfo, 'groupId' | 'deviceId' | 'kind' | 'label'>;

export type OnCameraSelectionChangedListener = (newCamera: Device | void) => void;
export type OnUpdateDevicesListener = () => void;

interface SubscriptionDetails {
    readonly deviceIdentifier: DeviceIdentifier
    readonly subscriptionIdentifier: SubscriptionIdentifier;
    stream: Promise<MediaStream>
}

const doNothing = () => {
};

export interface MediaStreamSubscription {
    readonly stream: Promise<MediaStream>;

    onDeviceRemoved: (listener: () => void) => void

    cancel(): void;
}

class DefaultMediaStreamSubscription implements MediaStreamSubscription {
    private _onDeviceRemoved = () => {
    };
    private _canceled = false;
    private _deviceRemoved = false;

    constructor(
        private readonly recordingDirector: RecordingDirector,
        public readonly subscriptionDetails: SubscriptionDetails) {
    }

    get stream() {
        if (this._canceled || this._deviceRemoved) {
            return Promise.reject('subscription canceled');
        }
        return this.subscriptionDetails.stream;
    }

    onDeviceRemoved(listener: () => void) {
        this._onDeviceRemoved = listener;
    }

    deviceRemoved() {
        this._deviceRemoved = true;
        this._onDeviceRemoved();
    }

    cancel() {
        this.recordingDirector.cancelSubscription(this.subscriptionDetails);
        this._canceled = true;
    }
}

const getOrAdd = <Key, Value>(map: Map<Key, Value>, key: Key, creator: (key: Key) => Value): Value => {
    const maybeValue = map.get(key);
    if (maybeValue !== undefined) {
        return maybeValue;
    }
    const value = creator(key);
    map.set(key, value);
    return value;
};

type DeviceIdentifier = string;
type SubscriptionIdentifier = string;

interface SubscriptionLedgerEntry {
    subscriptions: Map<SubscriptionIdentifier, DefaultMediaStreamSubscription>;
    stream: Promise<MediaStream>;
}

class SubscriptionLedger {
    private readonly subscriptionsByDevice = new Map<DeviceIdentifier, SubscriptionLedgerEntry>();

    addSubscriber(subscription: DefaultMediaStreamSubscription) {
        const newEntry = () => ({ stream: subscription.stream, subscriptions: new Map<SubscriptionIdentifier, DefaultMediaStreamSubscription>() });
        const details = subscription.subscriptionDetails;
        const entry = getOrAdd(this.subscriptionsByDevice, details.deviceIdentifier, newEntry);
        entry.subscriptions.set(details.subscriptionIdentifier, subscription);
    }

    subscriptionsTo(removedDeviceIds: string[]): DefaultMediaStreamSubscription[] {
        return Array.from(this.subscriptionsByDevice.entries())
            .filter(([d, _]) => removedDeviceIds.includes(d))
            .map(([_, ledger]) => Array.from(ledger.subscriptions.values()))
            .reduce((prev, cur) => prev.concat(cur), []);
    }

    removeSubscriber(subscriptionDetails: SubscriptionDetails, onNoMoreSubscribers: (stream: Promise<MediaStream>) => void = doNothing) {
        const entry = this.subscriptionsByDevice.get(subscriptionDetails.deviceIdentifier);
        if (entry === undefined) {
            return;
        }
        entry.subscriptions.delete(subscriptionDetails.subscriptionIdentifier);
        if (entry.subscriptions.size === 0) {
            this.subscriptionsByDevice.delete(subscriptionDetails.deviceIdentifier);
            onNoMoreSubscribers(entry.stream);
        }
    }

    streamFor(device: Device): Promise<MediaStream> | undefined {
        const entry = this.subscriptionsByDevice.get(device.deviceId);
        if (entry === undefined) {
            return undefined;
        }
        return entry.stream;
    }
}

export class RecordingDirector {
    private readonly onUpdateDevicesListeners = new Set<OnUpdateDevicesListener>();
    private readonly subscriptionLedger = new SubscriptionLedger();
    private readonly devices: Array<Device> = [];
    private onCameraSelectionChangedListeners: Set<OnCameraSelectionChangedListener> = new Set<OnCameraSelectionChangedListener>();
    private selectedCamera: Device | undefined;

    updateDevices(newDevices: Array<Device>) {
        const availableDevicesId = newDevices.map(dev => dev.deviceId);
        const removedDeviceIds = this.devices.filter(cur => !availableDevicesId.includes(cur.deviceId)).map(dev => dev.deviceId);

        this.devices.splice(0, this.devices.length);
        this.devices.push(...newDevices);
        this.onUpdateDevicesListeners.forEach(it => it());
        this.subscriptionLedger.subscriptionsTo(removedDeviceIds).forEach(sub => sub.deviceRemoved());
    }

    cameras() {
        return this.devices.filter(device => device.kind === 'videoinput').filter(device => 'default' !== device.label);
    }

    videoStreamSubscriptionFor(device: Device): MediaStreamSubscription {
        let subscriptionDetails = {
            deviceIdentifier: device.deviceId,
            stream: this.streamForDevice(device),
            subscriptionIdentifier: uuid()
        };
        const subscription = new DefaultMediaStreamSubscription(this, subscriptionDetails);
        this.subscriptionLedger.addSubscriber(subscription);
        return subscription;
    }

    cancelSubscription(subscriptionDetails: SubscriptionDetails): void {
        this.subscriptionLedger.removeSubscriber(subscriptionDetails, (stream) => stream.then(this.close).catch(doNothing));
    }

    private streamForDevice(device: Device): Promise<MediaStream> {
        const maybeAlreadyAvailableStream = this.subscriptionLedger.streamFor(device);
        if (maybeAlreadyAvailableStream !== undefined) {
            return maybeAlreadyAvailableStream;
        }
        return this.videoStreamFor(device).then((stream) => {
            // resolve the label of the device after the permission was given.
            // we are in the then clause, so we can assume the permission was given.
            if (device.label === '') {
                navigator.mediaDevices.enumerateDevices().then((devices) => {
                    const devicesWithLabels = devices.map(it => ({
                        kind: it.kind,
                        label: it.label,
                        deviceId: it.deviceId,
                        groupId: it.groupId
                    }));
                    console.log(devicesWithLabels);
                    this.updateDevices(devicesWithLabels);
                });

            }
            return stream;
        });
    }

    private videoStreamFor(device: Device): Promise<MediaStream> {
        return navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
    }

    selectCamera(camera: Device) {
        const alreadySelected = this.selectedCamera !== undefined
            && this.selectedCamera.kind === camera.kind
            && this.selectedCamera.groupId === camera.groupId
            && this.selectedCamera.deviceId === camera.deviceId;
        if (alreadySelected) {
            console.log('already selected');
            return;
        }
        this.selectedCamera = camera;
        this.onCameraSelectionChangedListeners.forEach(listener => listener(this.selectedCamera));
    }

    clearCameraSelection() {
        const cameraSelected = this.selectedCamera !== undefined;
        if (cameraSelected) {
            this.selectedCamera = undefined;
            this.onCameraSelectionChangedListeners.forEach(listener => listener(this.selectedCamera));
        }
    }

    addOnUpdateDevicesListener(listener: OnUpdateDevicesListener) {
        this.onUpdateDevicesListeners.add(listener);
    }

    removeOnUpdateDevicesListener(listener: OnUpdateDevicesListener) {
        this.onUpdateDevicesListeners.delete(listener);
    }

    addOnCameraSelectionChanged(listener: OnCameraSelectionChangedListener) {
        this.onCameraSelectionChangedListeners.add(listener);
        listener(this.selectedCamera);
    }

    removeOnCameraSelectionChanged(listener: OnCameraSelectionChangedListener) {
        this.onCameraSelectionChangedListeners.delete(listener);
    }

    private close(stream: MediaStream | null): void {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
}
