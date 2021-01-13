import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import { formattedInputOne } from 'input/formatting/formatting-spike-one';
//import { formattedInputTwo } from 'input/formatting/formatting-spike-two';
//import { setupWebRtcDemonstrator } from 'webrtc/WebRtcDemonstrator';
import { setupCameraDemonstrator } from 'devices/camera/CameraDemonstrator';
//import { setupSimplePeerDemonstrator } from 'webrtc/SimplePeerDemonstrator';
const Demonstrator = setupCameraDemonstrator();

const renderApplication = () => {
    ReactDOM.render(<div>
        <Demonstrator/>
    </div>, document.getElementById('root'));
};

class NetworkError extends Error {
    constructor(message: string) {
        super(message);
    }
}

try {
    throw new NetworkError('Stand In')
} catch (e){
    console.log(e.type);
}

renderApplication();
