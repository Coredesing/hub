import { useCallback } from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import { getProviderSolana } from '@/components/web3/utils'

export const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

const useWalletSignature = () => {
  const { library, account } = useMyWeb3()
  const signMessage = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!library || !account) {
        reject(new Error('Please connect wallet to sign'))
      }

      library.getSigner().signMessage(MESSAGE_SIGNATURE).then(message => {
        resolve(message)
      }).catch(error => {
        reject(error || 'Something went wrong when signing message')
      })
    })
  }, [library, account])

  return {
    signMessage
  }
}

export const useWalletSignatureSolana = () => {
  const signMessage = useCallback(() => {
    return new Promise((resolve, reject) => {
      const provider = getProviderSolana()
      if (!provider) {
        reject(new Error('No Solana Wallet Detected!'))
      }

      const encodedMessage = new TextEncoder().encode(MESSAGE_SIGNATURE)
      window?.solana.request({
        method: 'signMessage',
        params: {
          message: encodedMessage,
          display: 'utf8'
        }
      }).then(resolve).catch(reject)
    })
  }, [])

  return {
    signMessage
  }
}

export default useWalletSignature
