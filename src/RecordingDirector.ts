export type Device = Pick<MediaDeviceInfo, 'groupId' | 'deviceId' | 'kind' | 'label'>;

export type OnCameraSelectionChangedListener = (newCamera: Device | void) => void;

export class RecordingDirector {
    private onCameraSelectionChangedListener: Set<OnCameraSelectionChangedListener> = new Set<OnCameraSelectionChangedListener>();
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

    selectCamera(device: Device) {
        this.selectedCamera = device;
        this.onCameraSelectionChangedListener.forEach(listener => listener(this.selectedCamera));
    }

    addOnCameraSelectionChanged(listener: OnCameraSelectionChangedListener) {
        this.onCameraSelectionChangedListener.add(listener);
        listener(this.selectedCamera);
    }

    removeOnCameraSelectionChanged(listener: OnCameraSelectionChangedListener) {
        this.onCameraSelectionChangedListener.delete(listener);
    }

    close(stream: MediaStream | null): void {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

}
