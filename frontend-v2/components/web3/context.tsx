import { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import { utils } from 'ethers'
import { networks, Network } from './index'

export type Action<T> = {
  type: string;
  payload: Partial<T>;
}

type Context = {
  library: any;
  chainID: any;
  account: string;
  error: Error;
  balance: any;
  triedEager: boolean;

  balanceShort: string;
  currencyNative: string;
  network: Network;
  dispatch: (a: Action<Context>) => void;
  updateBalance: () => void;
}

const MyContext = createContext<Context>(undefined)

export function MyWeb3Provider ({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    library: null,
    chainID: null,
    account: null,
    error: null,
    balance: null,
    triedEager: false,

    balanceShort: '',
    currencyNative: '',
    network: null,
    dispatch: () => {},
    updateBalance: () => {}
  })

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

  const { library, account, chainID, balance } = state

  const updateBalance = useCallback(() => {
    if (!library || !account || !chainID) {
      dispatch({ type: 'UPDATE_BALANCE', payload: { balance: 0 } })
      return
    }

    library.getBalance(account).then(balance => {
      dispatch({ type: 'UPDATE_BALANCE', payload: { balance } })
    }).catch(() => {
      console.debug('Could not load user\'s balance')
    })
  }, [library, account, chainID, dispatch])

  const balanceShort = useMemo(() => {
    if (!balance) {
      return '0'
    }

    return parseFloat(utils.formatEther(balance)).toFixed(4)
  }, [balance])

  return (
    <MyContext.Provider
      value={{
        ...state,
        balanceShort,
        currencyNative,
        network,
        updateBalance,
        dispatch
      }}
    >
      {children}
    </MyContext.Provider>
  )
}

export function useMyWeb3 (): Context {
  const context = useContext(MyContext)

  if (!context) { throw new Error('useMyWeb3 must be used inside a `MyWeb3Provider`') }

  return context
}

function reducer (state: Context, { type, payload }: Action<Context>): Context {
  switch (type) {
  case 'SET_LIBRARY': {
    const { library } = payload
    return {
      ...state,
      library
    }
  }

  case 'SET_ACCOUNT': {
    const { account } = payload
    return {
      ...state,
      account
    }
  }

  case 'SET_CHAINID': {
    const { chainID } = payload
    return {
      ...state,
      chainID
    }
  }

  case 'SET_ERROR': {
    const { error } = payload
    return {
      ...state,
      error
    }
  }

  case 'UPDATE_BALANCE': {
    const { balance } = payload
    return {
      ...state,
      balance
    }
  }

  case 'SET_TRIED_EAGER': {
    const { triedEager } = payload
    return {
      ...state,
      triedEager
    }
  }

  default: {
    return state
  }
  }
}
