/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback } from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import { getProviderSolana } from '@/components/web3/utils'
import { utils } from 'ethers'

export const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

const useWalletSignature = () => {
  const { library, account } = useMyWeb3()
  const signMessage = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!library || !account) {
        reject(new Error('Please connect wallet to sign'))
        return
      }

      const key = `SIGNATURE_${account}`

      if (window.localStorage) {
        const sig = window.localStorage.getItem(key)
        if (sig) {
          const addr = utils.verifyMessage(MESSAGE_SIGNATURE, sig)
          if (addr.toLowerCase() === account.toLowerCase()) {
            resolve(sig)
            return
          }
        }
      }

      library.getSigner().signMessage(MESSAGE_SIGNATURE).then(sig => {
        if (window.localStorage) {
          window.localStorage.setItem(key, sig)
        }
        resolve(sig)
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
      // @ts-ignore
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
