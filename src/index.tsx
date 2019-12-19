import React from 'react';
import ReactDOM from 'react-dom';
import { CameraDemonstrator, fetchDevices } from './devices/camera/CameraDemonstrator';
import './index.css';
import { RecordingDirector } from './devices/camera/RecordingDirector';
import * as serviceWorker from './serviceWorker';

const setupCameraDemonstrator: () => React.FC = () => {
    const recordingDirector = new RecordingDirector();
    const updateDevices = () => fetchDevices(recordingDirector);
    updateDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);
    return () => {
        return <CameraDemonstrator recordingDirector={recordingDirector}/>;
    }
};

const Demonstrator = setupCameraDemonstrator();

const renderApplication = () => {
    ReactDOM.render(<div>
        <Demonstrator/>
    </div>, document.getElementById('root'));
};
renderApplication();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
