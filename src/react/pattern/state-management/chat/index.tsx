import React from 'react'
import { ChatProviderInternalValue, useChat } from './chat-provider'
import { ChatView } from './chat-view'

export { ChatProvider } from './chat-provider'
export type { ChatProviderProps } from './chat-provider'
export const Chat = () => {
  const value = useChat()
  const messages = modelToView(value)
  return <ChatView messages={messages} />
}

const modelToView = (value: ChatProviderInternalValue) =>
  value.rawMessages.map((raw) => ({ raw, derived: raw.text.length }))
