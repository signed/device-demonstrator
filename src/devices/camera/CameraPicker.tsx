import React, { CSSProperties, useEffect, useState } from 'react'
import { VideoElement } from '../VideoElement'
import { useRecordingDirector, useVideoStreamFrom } from './DeviceDemonstratorContext'
import { Device, RecordingDirector } from './RecordingDirector'

export interface CameraPreviewProps {
  recordingDirector: RecordingDirector
  device: Device
  index: number
}

export const CameraPreview: React.FC<CameraPreviewProps> = (props) => {
  const { recordingDirector, device, index } = props
  const { stream, streamError } = useVideoStreamFrom(device)

  const handleSelect = () => {
    recordingDirector.selectCamera(device)
  }

  const streamAvailable = streamError === 'none'
  return (
    <div>
      <h4>Camera {index}</h4>
      <ul>
        <li>device label: {device.label}</li>
        <li>device id: {device.deviceId}</li>
        <li>group id: {device.groupId}</li>
        <li>stream id: {stream?.id ?? 'no-stream'}</li>
      </ul>
      {!streamAvailable && <div>{streamError}</div>}
      {streamAvailable && <VideoElement onClick={handleSelect} width={150} srcObject={stream} autoPlay={true} />}
    </div>
  )
}

export const CameraPicker: React.FC = () => {
  const recordingDirector = useRecordingDirector()
  const [{ showPreviews }, setState] = useState({ showPreviews: false, forceReRender: 0 })
  useEffect(() => {
    const availableDevicesChanged = () => {
      setState((cur) => ({
        ...cur,
        forceReRender: cur.forceReRender + 1,
      }))
    }
    recordingDirector.addOnUpdateDevicesListener(availableDevicesChanged)
    return () => {
      recordingDirector.removeOnUpdateDevicesListener(availableDevicesChanged)
    }
  }, [recordingDirector])

  const handleShowPreview = () => setState((cur) => ({ ...cur, showPreviews: true }))

  const handleHidePreview = () => setState((cur) => ({ ...cur, showPreviews: false }))

  const button = showPreviews ? (
    <button onClick={handleHidePreview}>Hide Previews</button>
  ) : (
    <button onClick={handleShowPreview}>Show Previews</button>
  )
  const previews = showPreviews
    ? recordingDirector
        .cameras()
        .map((device, index) => (
          <CameraPreview key={device.deviceId} index={index} device={device} recordingDirector={recordingDirector} />
        ))
    : null
  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  }
  return (
    <div style={style}>
      {button}
      {previews}
    </div>
  )
}
