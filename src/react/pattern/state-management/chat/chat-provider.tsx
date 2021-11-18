import React, { ReactNode, useContext, useEffect, useState } from 'react'

export interface ChatProviderInternalValue {
  rawMessages: RawMessage[]
}

export const ChatProviderInternal = React.createContext<ChatProviderInternalValue | undefined>(undefined)

export const useChat = () => {
  const value = useContext(ChatProviderInternal)
  if (value === undefined) {
    throw new Error('useChat has to be used inside a <ChatProvider />')
  }
  return value
}

export interface ChatProviderProps {
  children: ReactNode
}

export type RawMessage = {
  from: string
  to: string
  text: string
}

export const ChatProvider = (props: ChatProviderProps) => {
  const [rawMessages, setRawMessages] = useState<RawMessage[]>([])
  useEffect(() => {
    setRawMessages(() => {
      return [
        { from: 'me', to: 'you', text: 'hello world' },
        { from: 'you', to: 'me', text: 'welcome' },
      ]
    })
  }, [])
  return <ChatProviderInternal.Provider value={{ rawMessages }}>{props.children}</ChatProviderInternal.Provider>
}
