import { useCallback } from 'react'
import { useMyWeb3 } from '@/components/web3/context'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

export const useWalletSignature = () => {
  const { library, account } = useMyWeb3()
  const signMessage = useCallback(() => {
    if (!library || !account) {
      throw new Error('Please connect wallet to sign')
    }

    return new Promise(async (resolve, reject) => {
      try {
        const message = await library.getSigner().signMessage(MESSAGE_SIGNATURE)
        resolve(message)
      } catch (error) {
        reject(error.message || 'Something went wrong when sign message')
      }
    })
  }, [library, account])

  return {
    signMessage
  }
}

export default useWalletSignature
