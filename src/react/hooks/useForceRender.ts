import { useCallback, useState } from 'react'

export const useForceRender = () => {
  const [_, render] = useState<boolean>(true)
  return useCallback(() => render((curr) => !curr), [])
}
