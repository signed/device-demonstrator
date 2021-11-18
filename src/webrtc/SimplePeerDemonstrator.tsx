import React, { useState } from 'react'
import SimplePeer from 'simple-peer'

const allSignalData: any[] = []

// http://localhost:3000/device-demonstrator#initiator

const peerOptions = (initiator: boolean): Promise<SimplePeer.Options> => {
  if (!initiator) {
    return Promise.resolve({})
  }
  return navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      return { initiator, stream }
    })
}

let peer: SimplePeer.Instance

peerOptions(window.location.hash === '#initiator')
  .then((options) => {
    peer = new SimplePeer(options)
    peer.on('signal', (data) => {
      allSignalData.push(data)
    })
    peer.on('connect', () => {
      // wait for 'connect' event before using the data channel
      peer.send('hey peer, how is it going?')
    })
    peer.on('data', (data) => {
      console.log('got a message from peer: ' + data)
    })
    peer.on('stream', (stream) => {
      // got remote video stream, now let's show it in a video tag
      const video = document.querySelector('video')
      if (video === null) {
        return
      }
      if ('srcObject' in video) {
        video.srcObject = stream
      }
      video.play()
    })
  })
  .catch((error) => {
    console.log(error)
  })

export const setupSimplePeerDemonstrator: () => React.FC = () => {
  return () => {
    const [dataAsString, setDataAsString] = useState<string>('whohohw')
    const handleSignalData = () => {
      const data = JSON.parse(dataAsString) as any[]
      setDataAsString(() => '')
      data.forEach((sig) => peer.signal(sig))
    }

    const copySignalDataToClipboard = () => {
      const signallingDataAsString = JSON.stringify(allSignalData, null, 2)
      window.navigator.clipboard.writeText(signallingDataAsString).catch((error) => console.log(error))
    }

    return (
      <div>
        <button onClick={copySignalDataToClipboard}>Copy signalling data to clipboard</button>
        <button onClick={handleSignalData}>Connect</button>
        <textarea value={dataAsString} onChange={(e) => setDataAsString(() => e.target.value)}></textarea>
        <video />
      </div>
    )
  }
}
