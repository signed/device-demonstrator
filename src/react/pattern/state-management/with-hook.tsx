import { ReactNode, useState } from 'react'
import { Chat, ChatProvider } from './chat'

// https://kentcdodds.com/blog/how-to-use-react-context-effectively

interface ToggleProps {
  children: ReactNode
}

const Toggle = (props: ToggleProps) => {
  const [toggle, setToggle] = useState(true)
  return (
    <div>
      <button onClick={() => setToggle((cur) => !cur)}>toggle</button>
      {toggle && props.children}
    </div>
  )
}

export const Communicator = () => {
  return (
    <ChatProvider>
      <Toggle>
        <Chat />
      </Toggle>
    </ChatProvider>
  )
}
