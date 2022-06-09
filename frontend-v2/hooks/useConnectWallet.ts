import { useCallback } from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import useWalletSignature from '@/hooks/useWalletSignature'
import { fetcher } from '@/utils'

const useConnectWallet = () => {
  const { account } = useMyWeb3()
  const { signMessage } = useWalletSignature()
  const connectWallet = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!account) {
        reject(new Error('Please connect wallet'))
        return
      }

      signMessage()
        .then((data) => {
          if (!data) resolve({ error: 'Could not create account' })
          fetcher('/api/guilds/connectWallet', {
            method: 'POST',
            body: JSON.stringify({ walletAddress: account })
          })
            .then((response) => {
              if (response.error) {
                resolve({ error: response.error })
              }

              if (!response.data?.walletAddress) {
                resolve({ error: 'Could not create account' })
              }

              resolve({
                walletAddress: response.data?.walletAddress,
                signature: data
              })
            })
            .catch((err) => {
              console.debug('err', err)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }, [account, signMessage])

  return {
    connectWallet
  }
}

export default useConnectWallet
