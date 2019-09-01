export type Device = Pick<MediaDeviceInfo, 'groupId' | 'deviceId' | 'kind' | 'label'>;

export class RecordingDirector {
    private readonly devices: Array<Device> = [];

    updateDevices(newDevices: Array<Device>) {
        this.devices.splice(0, this.devices.length);
        this.devices.push(...newDevices);
    }

    cameras() {
        return this.devices.filter( device => device.kind === 'videoinput').filter(device => 'default' !== device.label)
    }

    videoStreamFor(device: Device):Promise<MediaStream> {
        return navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
    }
}
