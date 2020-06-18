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

export class MediaStreamSubscription {
    private canceled = false;

    constructor(
        private readonly recordingDirector: RecordingDirector,
        private readonly subscriptionDetails: SubscriptionDetails) {
    }

    get stream() {
        if (this.canceled) {
            return Promise.reject('subscription canceled');
        }
        return this.subscriptionDetails.stream;
    }

    cancel() {
        this.recordingDirector.cancelSubscription(this.subscriptionDetails);
        this.canceled = true;
    }
}

type DeviceIdentifier = string;
type SubscriptionIdentifier = string;

interface SubscriptionLedgerEntry {
    subscriptions: Set<SubscriptionIdentifier>;
    stream: Promise<MediaStream>;
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

class SubscriptionLedger {
    private readonly subscriptionsByDevice = new Map<DeviceIdentifier, SubscriptionLedgerEntry>();

    addSubscriber(subscriptionDetails: SubscriptionDetails) {
        const newEntry = () => ({ stream: subscriptionDetails.stream, subscriptions: new Set<SubscriptionIdentifier>() });
        const entry = getOrAdd(this.subscriptionsByDevice, subscriptionDetails.deviceIdentifier, newEntry);
        entry.subscriptions.add(subscriptionDetails.subscriptionIdentifier);
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
        this.devices.splice(0, this.devices.length);
        this.devices.push(...newDevices);
        this.onUpdateDevicesListeners.forEach(it => it());
    }

    cameras() {
        return this.devices.filter(device => device.kind === 'videoinput').filter(device => 'default' !== device.label);
    }

    videoStreamSubscriptionFor(device: Device): MediaStreamSubscription {
        let subscriptionDetails = {
            device,
            deviceIdentifier: device.deviceId,
            stream: this.streamForDevice(device),
            subscriptionIdentifier: uuid()
        };
        this.subscriptionLedger.addSubscriber(subscriptionDetails);
        return new MediaStreamSubscription(this, subscriptionDetails);
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
