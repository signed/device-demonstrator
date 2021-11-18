import React, { useEffect, useRef } from 'react'

export interface HTMLVideoElementProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  srcObject: MediaStream | null
}

export const VideoElement: React.FC<HTMLVideoElementProps> = ({ srcObject = null, muted = false, ...rest }) => {
  const videoElement = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const node = videoElement.current
    if (node === null) {
      return
    }
    if (node.srcObject !== srcObject) {
      node.srcObject = srcObject
    }
    if (node.muted !== muted) {
      node.muted = muted
    }
  }, [srcObject, muted])
  return <video {...rest} ref={videoElement} />
}
