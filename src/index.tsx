import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { setupCameraDemonstrator } from './devices/camera/CameraDemonstrator';
//import { formattedInputOne } from 'input/formatting/formatting-spike-one';
//import { formattedInputTwo } from 'input/formatting/formatting-spike-two';

const Demonstrator = setupCameraDemonstrator();

const renderApplication = () => {
    ReactDOM.render(<div>
        <Demonstrator/>
    </div>, document.getElementById('root'));
};
renderApplication();
