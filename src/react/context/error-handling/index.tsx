import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export const ClockTower = () => {
  return (
    <ClockProvider>
      <Antenna />
      <Top />
      <Clock />
      <Tower />
      <GroundBuilding />
    </ClockProvider>
  )
}

const GroundBuilding = () => {
  return <div>ground building</div>
}
const Tower = () => {
  return <div>tower</div>
}

const Top = () => {
  return <div>top</div>
}

const Antenna = () => {
  return <div>antenna</div>
}

interface ClockValue {
  time: string
}

const ClockContext = createContext<ClockValue | void>(undefined)

interface ClockProviderProps {
  children: ReactNode
}

const useClockValue = (): ClockValue => {
  const [time, setTime] = useState('')
  useEffect(() => {
    let timerHandle: number
    const scheduleClockUpdate = function () {
      timerHandle = window.setTimeout(() => {
        setTime(new Date().toISOString())
        scheduleClockUpdate()
      }, 1000)
    }

    scheduleClockUpdate()
    return () => {
      window.clearTimeout(timerHandle)
    }
  }, [])
  return {
    time,
  }
}

const Clock = () => {
  const clockValue = useContext(ClockContext)
  if (clockValue) {
    return (
      <div>
        <span>time is </span>
        <span>{clockValue.time}</span>
      </div>
    )
  }
  return <div>Out of order</div>
}

const ClockProvider = (props: ClockProviderProps) => {
  const value = useClockValue()
  return <ClockContext.Provider value={value}>{props.children}</ClockContext.Provider>
}
