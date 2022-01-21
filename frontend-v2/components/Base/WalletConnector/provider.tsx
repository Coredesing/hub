import { useEffect } from 'react'
import { useEagerConnect, NoEthereumProviderError } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import toast from 'react-hot-toast'

export default function WalletProvider ({ children }) {
  const { dispatch, error, updateBalance, library } = useMyWeb3()
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
    if (!library) {
      return
    }

    library.on('block', () => {
      updateBalance()
    })
    return () => {
      if (!library) {
        return
      }

      library.removeAllListeners()
    }
  }, [library, updateBalance])

  useEffect(() => {
    updateBalance()
  }, [updateBalance])

  return children
}
