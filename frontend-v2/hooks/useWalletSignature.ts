import { useCallback } from 'react'
import { useMyWeb3 } from '@/components/web3/context'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

export const useWalletSignature = () => {
  const { library, account } = useMyWeb3()
  const signMessage = useCallback(() => {
    if (!library || !account) {
      throw new Error('Please connect wallet to sign')
    }

    return new Promise((resolve, reject) => {
      library.getSigner().signMessage(MESSAGE_SIGNATURE).then(message => {
        resolve(message)
      }).catch(error => {
        console.log(error)
        reject(error || 'Something went wrong when signing message')
      })
    })
  }, [library, account])

  return {
    signMessage
  }
}

export default useWalletSignature
