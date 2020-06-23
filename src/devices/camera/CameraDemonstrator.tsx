import React, { CSSProperties, useState } from 'react';
import { TestRig } from '../test-rig/test-rig';
import { BigScreen } from './BigScreen';
import { CameraPicker } from './CameraPicker';
import { Context } from './DeviceDemonstratorContext';
import { Device, RecordingDirector } from './RecordingDirector';

export const fetchDevices = (recordingDirector: RecordingDirector) => {
    navigator.mediaDevices.enumerateDevices()
        .then(function (mediaDeviceInfos) {
            const toDevice = (mediaDeviceInfo: MediaDeviceInfo): Device => {
                return {
                    groupId: mediaDeviceInfo.groupId,
                    deviceId: mediaDeviceInfo.deviceId,
                    label: mediaDeviceInfo.label,
                    kind: mediaDeviceInfo.kind
                };
            };
            recordingDirector.updateDevices(mediaDeviceInfos.map(toDevice));
        }).catch(function (err) {
            console.log(err.name + ': ' + err.message);
        }
    );
};

const logDeviceInformation = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        console.log(`there are ${devices.length} devices`);
        const devicesString = devices.map(device => `${device.kind} ${device.label} (${device.groupId}:${device.deviceId})`).join('\n');
        console.log(devicesString);
    }).catch((e) => console.log(e));
};

export const CameraDemonstrator: React.FC = () => {
    const [showCameraPicker, setShowCameraPicker] = useState(true);
    const style: CSSProperties = {
        display: 'flex'
    };
    const sidebarStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };
    return (
        <>
            <div style={style}>
                <div style={sidebarStyle}>
                    <button onClick={logDeviceInformation}>log device information</button>
                    <button onClick={() => setShowCameraPicker((cur) => !cur)}>toggle camera picker</button>
                    {showCameraPicker && <CameraPicker/>}
                </div>
                <BigScreen/>
            </div>
        </>
    );
};

export const setupCameraDemonstrator: () => React.FC = () => {
    const recordingDirector = new RecordingDirector();
    const updateDevices = () => fetchDevices(recordingDirector);
    updateDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);
    return () => {
        return <Context.Provider value={{ recordingDirector }}>
            <CameraDemonstrator/>
            <TestRig/>
        </Context.Provider>;
    };
};
