import React, { useEffect, useState } from 'react'
import { VideoElement } from '../VideoElement'
import { useRecordingDirector, useVideoStreamFrom } from './DeviceDemonstratorContext'
import { Device } from './RecordingDirector'

export const BigScreen: React.FC = () => {
  const [device, setDevice] = useState<Device | void>(undefined)
  const recordingDirector = useRecordingDirector()

  useEffect(() => {
    const handleDeviceSelectionChange = (device: Device | void): void => {
      setDevice(() => device)
    }
    recordingDirector.addOnCameraSelectionChanged(handleDeviceSelectionChange)
    return () => {
      recordingDirector.removeOnCameraSelectionChanged(handleDeviceSelectionChange)
    }
  }, [recordingDirector])
  const { stream, streamError } = useVideoStreamFrom(device)
  if (device === undefined) {
    return <div>No device selected</div>
  }
  if (!(streamError === 'none')) {
    return <div>{streamError}</div>
  }
  if (stream === null) {
    return <div>Opening stream</div>
  }
  const handleVideoClicked = () => {
    recordingDirector.clearCameraSelection()
  }
  return (
    <div>
      <VideoElement srcObject={stream} autoPlay={true} onClick={handleVideoClicked} />
      <div>{stream.id}</div>
    </div>
  )
}
