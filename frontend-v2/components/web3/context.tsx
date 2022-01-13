import { createContext, useContext, useReducer, useMemo } from 'react'
import { networks } from './index'

const Context = createContext<Context>(undefined)

export function MyWeb3Provider({ children }) {
  const [state, dispatch] = useReducer<Context>(reducer, {})
  const network = useMemo(() => {
    if (!state?.chainID) {
      return
    }

    return networks.find(nw => nw.id === state.chainID)
  }, [state])
  const currencyNative = useMemo(() => {
    if (!network) {
      return ''
    }

    return network.currency
  }, [network])

  return (
    <Context.Provider
      value={{
        currencyNative,
        network,
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
  balance: any
  currencyNative: string
  triedEager: boolean
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

    case 'UPDATE_BALANCE': {
      const balanceBN = payload
      return {
        ...state,
        balance: balanceBN
      }
    }

    case 'SET_TRIED_EAGER': {
      const tried = payload
      return {
        ...state,
        triedEager: tried
      }
    }

    default: {
      return state
    }
  }
}
