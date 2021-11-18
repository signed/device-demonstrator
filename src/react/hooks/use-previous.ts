// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
import { useEffect, useRef } from 'react'

export const usePrevious = <ValueType>(value: ValueType) => {
  const ref = useRef<ValueType>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
