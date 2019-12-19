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


export const CameraDemonstrator: React.FC<CameraDemonstratorProps> = (props) => {
    const style: CSSProperties = {
        display: 'flex'
    };
    return (
        <>
            <div style={style}>
                <CameraPicker recordingDirector={props.recordingDirector}/>
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
    }
};
