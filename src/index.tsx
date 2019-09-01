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

const logDeviceInformation = () => {
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

const renderApplication = () => {
    const style: CSSProperties = {
        display: 'flex'
    };
    ReactDOM.render(<div>
        <div style={style}>
            <CameraPicker recordingDirector={recordingDirector}/>
            <BigScreen recordingDirector={recordingDirector}/>
        </div>
        <Hide hide={true}>
            <VideoView title={'one'}/>
            <Json content={navigator.mediaDevices.getSupportedConstraints()}/>
        </Hide>
    </div>, document.getElementById('root'));
};

logDeviceInformation();
renderApplication();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
