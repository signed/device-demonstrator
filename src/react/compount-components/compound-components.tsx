import React, { isValidElement } from 'react'

// https://www.smashingmagazine.com/2021/08/compound-components-react/

interface TopBarProps {
  children: React.ReactNode
}

const TopBar = (props: TopBarProps) => {
  return <div>{props.children}</div>
}

export interface BottomBarProps {
  children: React.ReactNode
}

const BottomBar = (props: TopBarProps) => {
  return <div>{props.children}</div>
}

export interface StageProps {
  children: React.ReactNode
}

const Stage = (props: TopBarProps) => {
  return <div>{props.children}</div>
}

interface ApplicationProps {
  children: React.ReactNode
}

const Application = (props: ApplicationProps) => {
  const children = React.Children.toArray(props.children).filter(isValidElement)
  const topBar = children.find((child) => child.type === TopBar)
  const stage = children.find((child) => child.type === Stage)
  const bottomBar = children.find((child) => child.type === BottomBar)
  return (
    <div>
      {topBar && <div>{topBar}</div>}
      <div>{stage}</div>
      {bottomBar && <div>{bottomBar}</div>}
    </div>
  )
}

Application.TopBar = TopBar
Application.Stage = Stage
Application.BottomBar = BottomBar

export const CompoundComponent = () => {
  return (
    <Application>
      <Application.TopBar>Passed from the Outside</Application.TopBar>
      <Application.Stage>Spot On</Application.Stage>
      <Application.BottomBar>Bottom Bar</Application.BottomBar>
    </Application>
  )
}
