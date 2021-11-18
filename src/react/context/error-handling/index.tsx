import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export const ClockTower = () => {
  const [providerBreaksWith, breakProvider] = useState<string>()
  const [clockBreaksWith, breakClock] = useState<string>()
  return (
    <>
      <div>
        <button onClick={() => breakProvider('nasty time calculation error')}>break provider</button>
        <button onClick={() => breakClock('dial gets lose')}>break clock</button>
      </div>

      <ClockProvider clockBreaksWith={clockBreaksWith} providerBreaksWith={providerBreaksWith}>
        <Antenna />
        <Top />
        <Clock />
        <Tower />
        <GroundBuilding />
      </ClockProvider>
    </>
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
  clockBreaksWith?: string
}

const ClockContext = createContext<ClockValue | void>(undefined)

interface ClockProviderProps {
  children: ReactNode
  providerBreaksWith?: string
  clockBreaksWith?: string
}

const useClockValue = (options: Omit<ClockProviderProps, 'children'>): ClockValue => {
  const { clockBreaksWith, providerBreaksWith } = options
  const [time, setTime] = useState('')
  if (providerBreaksWith) {
    throw new Error(providerBreaksWith)
  }
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
    clockBreaksWith,
  }
}

const Clock = () => {
  const clockValue = useContext(ClockContext)
  if (clockValue) {
    if (clockValue.clockBreaksWith) {
      throw new Error(clockValue.clockBreaksWith)
    }
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
  const { children, ...rest } = props
  const value = useClockValue(rest)
  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>
}
