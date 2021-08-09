import { useState, useCallback } from 'react';

export const useForceRender = () => {
    const [_, render] = useState<boolean>(true)
    return useCallback(() => render((curr) => !curr), [])
}
