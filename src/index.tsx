//import { formattedInputOne } from 'input/formatting/formatting-spike-one';
//import { formattedInputTwo } from 'input/formatting/formatting-spike-two';
//import { setupWebRtcDemonstrator } from 'webrtc/WebRtcDemonstrator';
import { setupCameraDemonstrator } from 'devices/camera/CameraDemonstrator'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
//import { setupSimplePeerDemonstrator } from 'webrtc/SimplePeerDemonstrator';
const Demonstrator = setupCameraDemonstrator()

const renderApplication = () => {
  ReactDOM.render(
    <div>
      <Demonstrator />
    </div>,
    document.getElementById('root'),
  )
}
renderApplication()
