import { uuid } from 'uuidv4';

export type Device = Pick<MediaDeviceInfo, 'groupId' | 'deviceId' | 'kind' | 'label'>;

export type OnCameraSelectionChangedListener = (newCamera: Device | void) => void;
export type OnUpdateDevicesListener = () => void;

interface SubscriptionDetails {
    readonly device: Device;
    readonly subscriberIdentifier: string;
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


interface SubscriptionLedgerEntry {
    subscribers: Set<string>;
    stream: Promise<MediaStream>;
}

class SubscriptionLedger {
    private readonly subscriptionsByDevice: Map<string, SubscriptionLedgerEntry> = new Map();

    addSubscriber(subscriptionDetails: SubscriptionDetails) {
        const deviceId = subscriptionDetails.device.deviceId;
        let entry = this.subscriptionsByDevice.get(deviceId);
        if (entry === undefined) {
            entry = { stream: subscriptionDetails.stream, subscribers: new Set<string>() };
            this.subscriptionsByDevice.set(deviceId, entry);
        }
        entry.subscribers.add(subscriptionDetails.subscriberIdentifier);
    }

    removeSubscriber(subscriptionDetails: SubscriptionDetails, onNoMoreSubscribers: (stream: Promise<MediaStream>) => void = doNothing) {
        const entry = this.subscriptionsByDevice.get(subscriptionDetails.device.deviceId);
        if (entry === undefined) {
            return;
        }
        entry.subscribers.delete(subscriptionDetails.subscriberIdentifier);
        if (entry.subscribers.size === 0) {
            this.subscriptionsByDevice.delete(subscriptionDetails.device.deviceId);
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
    private readonly onUpdateDevicesListeners = new Set<OnUpdateDevicesListener>()
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
            stream: this.streamForDevice(device),
            subscriberIdentifier: uuid()
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

    addOnUpdateDevicesListener(listener: OnUpdateDevicesListener){
        this.onUpdateDevicesListeners.add(listener);
    }

    removeOnUpdateDevicesListener(listener: OnUpdateDevicesListener){
        this.onUpdateDevicesListeners.delete(listener)
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
