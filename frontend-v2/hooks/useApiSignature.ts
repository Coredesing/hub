import { useCallback } from 'react'
import useWalletSignature from './useWalletSignature'
import { fetcher } from '@/utils'
import { ObjectType } from '@/utils/types'
import { useMyWeb3 } from '@/components/web3/context'
import { API_BASE_URL } from '@/utils/constants'

const useApiSignature = (url: string) => {
  const { signMessage } = useWalletSignature()
  const { account } = useMyWeb3()
  const apiSignMessage = useCallback(async (data: ObjectType) => {
    try {
      const signature = await signMessage()
      const response = await fetcher(`${API_BASE_URL}${url}`, {
        method: 'POST',
        body: JSON.stringify({
          wallet_address: account,
          signature,
          ...data
        }),
        headers: {
          'Content-Type': 'application/json',
          msgSignature: process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE
        }
      })
      const result = response.data
      if (result.status === 200 && result.data) {
        return result.data.signature
      }
      throw new Error(result?.message)
    } catch (error) {
      throw new Error(error?.message || 'Something went wrong when sign message')
    }
  }, [account, signMessage, url])

  return {
    apiSignMessage
  }
}

export default useApiSignature
