import React, { useState } from 'react'

interface CollapseProps {
  expand?: boolean
  onCollapse: () => void
  onExpand: () => void
}

export const Collapse: React.FC<CollapseProps> = ({ children, onCollapse, onExpand, expand = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(!expand)

  const handleExpand = () => {
    setIsCollapsed(false)
    onExpand()
  }

  const handleCollapse = () => {
    setIsCollapsed(true)
    onCollapse()
  }

  if (isCollapsed) {
    return <button onClick={handleExpand}>expand</button>
  }
  return (
    <>
      <button onClick={handleCollapse}>collapse</button>
      {children}
    </>
  )
}
