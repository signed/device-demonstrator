import React, { ErrorInfo, useEffect, useState } from 'react'

type Boom = 'fail' | 'rerender' | 'ok'

export const ErrorBoundryExample = () => {
  const [health, setHealthTo] = useState<Boom>('ok')
  useEffect(() => {
    if (health === 'rerender') {
      setHealthTo('ok')
    }
  }, [health])
  const displayExperiemental = health !== 'rerender'
  return (
    <div>
      <div>
        {displayExperiemental && (
          <ErrorBoundary
            retry={() => {
              setHealthTo('rerender')
            }}
          >
            <h1>left</h1>
            <p>experimental code that might fail</p>
            <button onClick={() => setHealthTo('fail')}>fail</button>
            {health === 'fail' && <ExperimentalCode />}
          </ErrorBoundary>
        )}
      </div>
      <div>
        <h1>right</h1>
        <p>robust content that should always be displayed regardless of errors in other parts of the application</p>
      </div>
    </div>
  )
}

type ErrorBoundaryProps = {
  retry: () => void
}
type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    //console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button
            onClick={() => {
              this.props.retry()
            }}
          >
            retry
          </button>
        </div>
      )
    }
    // Normally, just render children
    return this.props.children
  }
}

const ExperimentalCode = () => {
  throw new Error('wups')
}
