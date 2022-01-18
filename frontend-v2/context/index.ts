import {createContext} from 'react'

type ValueOfContext = {
    [k: string]: {
        state: any;
        actions: {
            [k: string]: Function
        }
    }
}

const appContext = createContext<ValueOfContext>({});

export default appContext;
