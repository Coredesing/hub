import { createContext, useContext } from 'react'

type ValueOfContext = {
    [k: string]: {
        state?: any;
        actions?: {
            [k: string]: (...args: any[]) => void;
        };
    };
}

const AppContext = createContext<ValueOfContext>({})

export default AppContext

export const useAppContext = () => {
  const context = useContext(AppContext)
  return context
}
