import React, { useEffect, useState } from 'react'
import { Json } from './Json'

export type MediaStreamTrackViewProps = { track: MediaStreamTrack }
export const MediaStreamTrackView: React.FC<MediaStreamTrackViewProps> = (props) => {
  const { track } = props
  const [_, forceRender] = useState(true)
  const capabilities = track.getCapabilities ? track.getCapabilities() : 'track.getCapabilities does not exist'

  useEffect(() => {
    const muteListener = () => console.log('muted')
    const unmuteListener = () => console.log('unmute')
    track.addEventListener('mute', muteListener)
    track.addEventListener('unmute', unmuteListener)
    return () => {
      track.removeEventListener('mute', muteListener)
      track.removeEventListener('unmute', unmuteListener)
    }
  }, [track])

  const handleEnable = () => {
    track.enabled = !track.enabled
    forceRender((old) => !old)
  }

  return (
    <dl>
      <dt>id</dt>
      <dd>{track.id}</dd>
      <dt>readyState</dt>
      <dd>{track.readyState}</dd>
      <dt>
        enabled <button onClick={handleEnable}>{track.enabled ? 'disable' : 'enable'}</button>
      </dt>
      <dd>{String(track.enabled)}</dd>
      <dt>kind</dt>
      <dd>{track.kind}</dd>
      <dt>label</dt>
      <dd>{track.label}</dd>
      <dt>muted</dt>
      <dd>{String(track.muted)}</dd>
      <dt>capabilities</dt>
      <dd>
        <Json content={capabilities} />
      </dd>
      <dt>constraints</dt>
      <dd>
        <Json content={track.getConstraints()} />
      </dd>
      <dt>settings</dt>
      <dd>
        <Json content={track.getSettings()} />
      </dd>
    </dl>
  )
}
