import React, { useContext, useState } from 'react'

type BasicContext = { value: number }

const BasicContextDefinition = React.createContext<BasicContext | undefined>(undefined)

export interface ConditionalWrapProps {
  condition: boolean
  wrap: (children: JSX.Element) => JSX.Element
  children: JSX.Element
}

export const ConditionalWrap = (props: ConditionalWrapProps) => {
  const { condition, children, wrap } = props
  return condition ? React.cloneElement(wrap(children)) : children
}

export const BasicContextExample = () => {
  const [isProviderIncluded, includeProvider] = useState(false)

  return (
    <div>
      <div>
        <h1>Left</h1>
        <p>no provider is available, component has to deal with it</p>
        <BasicContextConsumer />
      </div>
      <div>
        <h1>Conditional Provider</h1>
        <p>initially the provider is not available, but is added as soon as you click the buttons</p>
        <button onClick={() => includeProvider((current) => !current)}>
          {isProviderIncluded ? 'remove provider' : 'add provider'}
        </button>
        <ConditionalWrap
          condition={isProviderIncluded}
          wrap={(children) => (
            <BasicContextDefinition.Provider value={{ value: 99 }}>{children}</BasicContextDefinition.Provider>
          )}
        >
          <BasicContextConsumer />
        </ConditionalWrap>
      </div>
      <div>
        <h1>Right</h1>
        <p>provider is available and component can consume it</p>
        <BasicContextDefinition.Provider value={{ value: 42 }}>
          <BasicContextConsumer />
        </BasicContextDefinition.Provider>
      </div>
    </div>
  )
}

const BasicContextConsumer = () => {
  const basicContext = useContext(BasicContextDefinition)
  if (basicContext === undefined) {
    return <div>Context not available</div>
  }
  return <div>context available {basicContext.value}</div>
}
