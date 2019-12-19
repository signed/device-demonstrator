import React from 'react';
import ReactDOM from 'react-dom';
import { setupCameraDemonstrator } from './devices/camera/CameraDemonstrator';
import './index.css';
import * as serviceWorker from './serviceWorker';


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
