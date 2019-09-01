import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Json } from './Json';
import * as serviceWorker from './serviceWorker';
import { VideoView } from './VideoView';

const logDeviceInformation = () => {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                console.log(device.kind + ': ' + device.label +
                    ' id = ' + device.deviceId);
            });
        }).catch(function (err) {
            console.log(err.name + ': ' + err.message);
        });
};

const renderApplication = () => {
    ReactDOM.render(<div>
        <VideoView title={'one'}/>
        <Json content={navigator.mediaDevices.getSupportedConstraints()}/>
    </div>, document.getElementById('root'));
};

logDeviceInformation();
renderApplication();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
