import React, { CSSProperties } from 'react';
import { BigScreen } from './BigScreen';
import { CameraPicker } from './CameraPicker';
import { Hide } from './Hide';
import { Json } from './Json';
import { Device, RecordingDirector } from './RecordingDirector';
import { VideoView } from './VideoView';

export interface CameraDemonstratorProps {
    recordingDirector: RecordingDirector;
}

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

export const CameraDemonstrator: React.FC<CameraDemonstratorProps> = (props) => {
    const style: CSSProperties = {
        display: 'flex'
    };
    const sidebarStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    }
    return (
        <>
            <div style={style}>
                <div style={sidebarStyle}>
                    <button onClick={logDeviceInformation}>log device information</button>
                    <CameraPicker recordingDirector={props.recordingDirector}/>
                </div>
                <BigScreen recordingDirector={props.recordingDirector}/>
            </div>
            <Hide hide={true}>
                <VideoView title={'one'}/>
                <Json content={navigator.mediaDevices.getSupportedConstraints()}/>
            </Hide>
        </>
    );
};

export const setupCameraDemonstrator: () => React.FC = () => {
    const recordingDirector = new RecordingDirector();
    const updateDevices = () => fetchDevices(recordingDirector);
    updateDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);
    return () => {
        return <CameraDemonstrator recordingDirector={recordingDirector}/>;
    };
};
