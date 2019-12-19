import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Hide } from './Hide';
import { BigScreen } from './BigScreen';
import { CameraPicker } from './CameraPicker';
import { Device, RecordingDirector } from './RecordingDirector';
import { Json } from './Json';
import * as serviceWorker from './serviceWorker';
import { VideoView } from './VideoView';

const recordingDirector = new RecordingDirector();

const fetchDevices = () => {
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

export const CameraDemonstrator: React.FC = (props) => {
    const style: CSSProperties = {
        display: 'flex'
    };
    return (
        <>
            <div style={style}>
                <CameraPicker recordingDirector={recordingDirector}/>
                <BigScreen recordingDirector={recordingDirector}/>
            </div>
            <Hide hide={true}>
                <VideoView title={'one'}/>
                <Json content={navigator.mediaDevices.getSupportedConstraints()}/>
            </Hide>
        </>
    );
};

const renderApplication = () => {
    ReactDOM.render(<div>
        <CameraDemonstrator/>
    </div>, document.getElementById('root'));
};

fetchDevices();
navigator.mediaDevices.addEventListener('devicechange', () => fetchDevices());
renderApplication();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
