import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import { formattedInputOne } from 'input/formatting/formatting-spike-one';
//import { formattedInputTwo } from 'input/formatting/formatting-spike-two';
import { setupWebRtcDemonstrator } from 'webrtc/WebRtcDemonstrator';
const Demonstrator = setupWebRtcDemonstrator();

const renderApplication = () => {
    ReactDOM.render(<div>
        <Demonstrator/>
    </div>, document.getElementById('root'));
};
renderApplication();
