import React, {
  Component,
  createContext,
  ErrorInfo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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
        <ClockErrorBondary recover={() => breakClock(undefined)}>
          <Clock />
        </ClockErrorBondary>
        <Tower />
        <GroundBuilding />
      </ClockProvider>
      <FrontYard />
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

const FrontYard = () => {
  return <div>front yard</div>
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

  if (providerBreaksWith) {
    throw new Error(providerBreaksWith)
  }

  return {
    time,
    clockBreaksWith,
  }
}

interface ClockErrorBondaryProps {
  children: ReactNode
  recover: () => void
}

interface ClockErrorBondaryState {
  hasError: boolean
}

class ClockErrorBondary extends Component<ClockErrorBondaryProps, ClockErrorBondaryState> {
  constructor(props: ClockErrorBondaryProps) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const handleAttachDial = () => {
        this.props.recover()
        this.setState({ hasError: false })
      }
      return (
        <>
          <button onClick={handleAttachDial}>attach dial</button>
          <h1>00:00</h1>
        </>
      )
    }
    return this.props.children
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

const ClockProviderInternal = (props: WithTryCatch) => {
  const { children, ...rest } = props
  try {
    const value = useClockValue(rest)
    return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>
  } catch (_) {
    props.crashHandler()
    return <>{children}</>
  }
}

type CrashHandler = () => void

interface WithTryCatch extends ClockProviderProps {
  crashHandler: CrashHandler
}

const ProviderTryCatch = (props: ClockProviderProps) => {
  const [providerCrashed, handleCrash] = useState(false)
  const crashHandler = useCallback(() => {
    return () => handleCrash(true)
  }, [])
  if (providerCrashed) {
    return <>{props.children}</>
  }

  const { children, ...rest } = props
  return (
    <ClockProviderInternal crashHandler={crashHandler} {...rest}>
      {children}
    </ClockProviderInternal>
  )
}

const ClockProvider = ProviderTryCatch
