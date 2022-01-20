//import { formattedInputOne } from 'input/formatting/formatting-spike-one';
//import { formattedInputTwo } from 'input/formatting/formatting-spike-two';
//import { setupWebRtcDemonstrator } from 'webrtc/WebRtcDemonstrator';
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
//import { ClockTower as Demonstrator } from './react/context/error-handling'
//import { setupSimplePeerDemonstrator } from 'webrtc/SimplePeerDemonstrator'
import { CompoundComponent as Demonstrator } from './react/compount-components/compound-components'
//const Demonstrator = setupCameraDemonstrator()

const renderApplication = () => {
  ReactDOM.render(
    <div>
      <Demonstrator />
    </div>,
    document.getElementById('root'),
  )
}
renderApplication()
