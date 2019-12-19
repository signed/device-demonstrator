import React from 'react';
import ReactDOM from 'react-dom';
import { CameraDemonstrator, fetchDevices } from './CameraDemonstrator';
import './index.css';
import { RecordingDirector } from './RecordingDirector';
import * as serviceWorker from './serviceWorker';

const recordingDirector = new RecordingDirector();

const renderApplication = () => {
    ReactDOM.render(<div>
        <CameraDemonstrator recordingDirector={recordingDirector}/>
    </div>, document.getElementById('root'));
};

const updateDevices = () => fetchDevices(recordingDirector);
updateDevices();
navigator.mediaDevices.addEventListener('devicechange', updateDevices);
renderApplication();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
