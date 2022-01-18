import { useEffect } from 'react'
import { useEagerConnect, NoEthereumProviderError } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import toast from 'react-hot-toast'

export default function WalletProvider ({ children }) {
  const { account, dispatch, error, library, chainID } = useMyWeb3()
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
    if (!account || !library || !chainID) {
      dispatch({ type: 'UPDATE_BALANCE', payload: { balance: 0 } })
      return
    }

    library.getBalance(account).then(balance => {
      dispatch({ type: 'UPDATE_BALANCE', payload: { balance } })
    }).catch(() => {
      toast.error('Could not load user\'s balance')
    })
  }, [library, account, dispatch, chainID])

  return children
}
