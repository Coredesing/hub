import { useEffect } from 'react'
import { useWeb3Default, useEagerConnect, NoEthereumProviderError } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import toast from 'react-hot-toast'

export default function WalletProvider({ children }) {
  const contextWeb3Default: Web3ReactManagerReturn = useWeb3Default()
  const contextWeb3App = useMyWeb3()

  const { account, dispatch, error } = contextWeb3App
  const { active: activeDefault, library: libraryDefault } = contextWeb3Default

  const tried = useEagerConnect()
  useEffect(() => {
    dispatch({ type: 'SET_TRIED_EAGER', payload: tried })
  }, [tried, dispatch])

  useEffect(() => {
    if (!error) {
      return
    }

    if (error instanceof NoEthereumProviderError) {
      toast.error('No Ethereum Wallet Detected')
      return
    }

    toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (!activeDefault || !account) {
      dispatch({ type: 'UPDATE_BALANCE', payload: 0 })
      return
    }

    libraryDefault.getBalance(account).then(x => {
      dispatch({ type: 'UPDATE_BALANCE', payload: x })
    })
  }, [activeDefault, libraryDefault, account, dispatch])

  return children
}
