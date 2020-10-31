import React, { useContext, useEffect } from 'react';
import { IceCandidates } from './IceCandidates';
import { useForceRender } from './useForceRender';

const context: WebRtcDemonstratorContext = {
    ownIceCandidates: new IceCandidates()
};

const handleIceCandidate = (ice: RTCPeerConnectionIceEvent) => {
    const data = { candidate: ice.candidate, url: ice.url };
    console.log('call: handleIceCandidate');
    console.log(JSON.stringify(data, null, 2));
    if (ice.candidate) {
        // should be send to the client we try to connect to
        context.ownIceCandidates.add(ice.candidate);
    }
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
    console.log('call: handleNegotiationNeeded');
    // create a local offer and when in stable state send it to the other client
}

function handleTrack(this: RTCPeerConnection, _ev: RTCTrackEvent) {
    console.log('handleTrack');
    //display the stream in the track event
}

type WebRtcDemonstratorContext = {
    ownIceCandidates: IceCandidates
}

const WebRtcDemonstratorContext = React.createContext<WebRtcDemonstratorContext | void>(undefined);

const openConnection = async () => {
    console.log('whohooo');
    const configuration: RTCConfiguration = {
        iceCandidatePoolSize: 20,
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

    const description: RTCSessionDescriptionInit = await rtcPeerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await rtcPeerConnection.setLocalDescription(description);

    /*
     const stream = await window.navigator.mediaDevices.getUserMedia({ audio: false, video: true });
     stream.getTracks().forEach(track => rtcPeerConnection.addTrack(track, stream));


     */
    console.log('here we go');
};


const useOwnIceCandidates = (): IceCandidates => {
    const flup = useContext(WebRtcDemonstratorContext);
    if (flup === undefined) {
        throw new Error('There has to be a WebRtcDemonstratorContext in the parent component');
    }
    return flup.ownIceCandidates;
};

const OwnIceCandidatesView: React.FC = () => {
    const forceRender = useForceRender();
    const iceCandidates = useOwnIceCandidates();
    useEffect(() => {
        const addListener = () => {
            return forceRender();
        };
        iceCandidates.addOnAdd(addListener);
        return () => {
            iceCandidates.removeOnAdd(addListener);
        };
    }, [iceCandidates]);

    return <>
        <h1>Own Ice Candidates</h1>
        <textarea value={JSON.stringify(iceCandidates.ideCandidates, null, 2)}/>
    </>;
};

export const setupWebRtcDemonstrator: () => React.FC = () => {
    return () => {
        return (
            <WebRtcDemonstratorContext.Provider value={context}>
                <div>
                    <button onClick={openConnection}>
                        Connect
                    </button>
                </div>
                <OwnIceCandidatesView/>
            </WebRtcDemonstratorContext.Provider>
        );
    };
};
