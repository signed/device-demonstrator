export type Device = Pick<MediaDeviceInfo, 'groupId' | 'deviceId' | 'kind' | 'label'>;

export type OnCameraSelectionChangedListener = (newCamera: Device | void) => void;

export class RecordingDirector {
    private onCameraSelectionChangedListeners: Set<OnCameraSelectionChangedListener> = new Set<OnCameraSelectionChangedListener>();
    private readonly devices: Array<Device> = [];
    private selectedCamera: Device | undefined;

    updateDevices(newDevices: Array<Device>) {
        this.devices.splice(0, this.devices.length);
        this.devices.push(...newDevices);
    }

    cameras() {
        return this.devices.filter(device => device.kind === 'videoinput').filter(device => 'default' !== device.label);
    }

    videoStreamFor(device: Device): Promise<MediaStream> {
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

    addOnCameraSelectionChanged(listener: OnCameraSelectionChangedListener) {
        this.onCameraSelectionChangedListeners.add(listener);
        listener(this.selectedCamera);
    }

    removeOnCameraSelectionChanged(listener: OnCameraSelectionChangedListener) {
        this.onCameraSelectionChangedListeners.delete(listener);
    }

    close(stream: MediaStream | null): void {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

}
