import React, { useState } from 'react';
import SimplePeer from 'simple-peer';

// http://localhost:3000/device-demonstrator#initiator
const peer = new SimplePeer({ initiator: window.location.hash === '#initiator' });
peer.on('signal', (data) => console.log(JSON.stringify(data, null, 2)));
peer.on('connect', () => {
    // wait for 'connect' event before using the data channel
    peer.send('hey peer, how is it going?');
});
peer.on('data', data => {
    console.log('got a message from peer: ' + data);
});

export const setupSimplePeerDemonstrator: () => React.FC = () => {
    return () => {
        const [dataAsString, setDataAsString] = useState<string>('whohohw');
        const handleSignalData = () => {
            const data = JSON.parse(dataAsString);
            setDataAsString(() => '');
            peer.signal(data)
        };
        return (
            <div>
                <button onClick={handleSignalData}>
                    Connect
                </button>
                <textarea value={dataAsString} onChange={(e) => setDataAsString(() => e.target.value)}>
                </textarea>
            </div>
        );
    };
};
