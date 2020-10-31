import { useState } from 'react';

export const useForceRender = () => {
    const [_, render] = useState<boolean>(true)
    return () => render((curr) => !curr)
}
