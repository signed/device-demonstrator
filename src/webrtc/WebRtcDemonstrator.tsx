import React from 'react';

const handleIceCandidate = (ice: RTCPeerConnectionIceEvent) => {
    const data = { candidate: ice.candidate, url: ice.url };
    console.log('call: handleIceCandidate');
    console.log(JSON.stringify(data, null, 2));
    // should be send to the client we try to connect to
};

function handleIceConnectionStateChange(this: RTCPeerConnection) {
    console.log(`call: handleIceConnectionStateChange: ${this.iceConnectionState}`);
}
function handleICEGatheringStateChange(this: RTCPeerConnection) {
    console.log(`call: handleICEGatheringStateChange: ${this.iceGatheringState}`);
}

function handleSignalingStateChange(this: RTCPeerConnection, _ev: Event) {
    console.log(`call: handleSignalingStateChange: ${this.signalingState}`);
}

function handleNegotiationNeeded(this: RTCPeerConnection) {
    console.log('call: handleNegotiationNeeded')
    // create a local offer and when in stable state send it to the other client
}

function handleTrack(this: RTCPeerConnection, _ev: RTCTrackEvent) {
    console.log('handleTrack')
    //display the stream in the track event
}

const onClick = async () => {
    console.log('whohooo');
    const stream = await window.navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    const configuration: RTCConfiguration = {
        iceCandidatePoolSize: 0,
        iceServers: [
            { urls: ['stun:stun.services.mozilla.com:3478'] }
        ]
    };
    const rtcPeerConnection = new RTCPeerConnection(configuration);
    rtcPeerConnection.onicecandidate = handleIceCandidate;
    rtcPeerConnection.oniceconnectionstatechange = handleIceConnectionStateChange;
    rtcPeerConnection.onicegatheringstatechange = handleICEGatheringStateChange;
    rtcPeerConnection.onsignalingstatechange = handleSignalingStateChange;
    rtcPeerConnection.onnegotiationneeded = handleNegotiationNeeded;
    rtcPeerConnection.ontrack = handleTrack;

    stream.getTracks().forEach(track => rtcPeerConnection.addTrack(track, stream));

    const description: RTCSessionDescriptionInit = await rtcPeerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await rtcPeerConnection.setLocalDescription(description);
    console.log('here we go');
};


export const setupWebRtcDemonstrator: () => React.FC = () => {
    return () => {
        return (<div>
            <button onClick={onClick}>
                Connect
            </button>
        </div>);
    };
};
