import { useEffect } from 'react'
import { useEagerConnect, NoEthereumProviderError } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import toast from 'react-hot-toast'

export default function WalletProvider ({ children }) {
  const { dispatch, error, updateBalance } = useMyWeb3()
  const tried = useEagerConnect()
  useEffect(() => {
    dispatch({ type: 'SET_TRIED_EAGER', payload: { triedEager: tried } })
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
    updateBalance()
  }, [updateBalance])

  return children
}
