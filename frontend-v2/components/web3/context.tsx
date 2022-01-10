import { createContext, useContext, useReducer } from 'react'

const Context = createContext<Context>(undefined)

export function MyWeb3Provider({ children }) {
  const [state, dispatch] = useReducer<Context>(reducer, {})

  return (
    <Context.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {children}
    </Context.Provider>
  )
}

type Context = {
  provider: any
  chainID: any
  account: string
  error: Error
  dispatch: (a: Action) => void
}

export type Action = {
  type: string
  payload: Context
}

export function useMyWeb3(): Context {
  const context = useContext(Context)

  if (!context)
    throw new Error('useMyWeb3 must be used inside a `MyWeb3Provider`')

  return context
}

function reducer(state: Context, { type, payload }: Action): Context {
  switch (type) {
    case 'INIT': {
      const { provider, chainID, account, error } = payload
      return { provider, chainID, account, error }
    }

    case 'SET_CHAINID': {
      const chainID = payload
      return {
        ...state,
        chainID
      }
    }

    case 'SET_ERROR': {
      const error = payload
      return {
        ...state,
        error
      }
    }
  }
}