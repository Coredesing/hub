import { useState, useEffect, useCallback } from 'react'
import { Address } from 'utils/types'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import useApiSignature from './useApiSignature'
import toast from 'react-hot-toast'

export const useJoinPool = (poolId: string | number, account: Address) => {
  const { apiSignMessage } = useApiSignature('/user/join-campaign')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    setSuccess(false)
  }, [account])
  const joinPool = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetcher(`${API_BASE_URL}/pool/${poolId}/whitelist-apply-box`, { method: 'POST', body: JSON.stringify({ wallet_address: account }), headers: { 'content-type': 'application/json' } })
      if (res?.status !== 200) {
        toast.error((res?.status < 500 && res?.message) || 'Could not apply for whitelisting')
        return
      }

      const signature = await apiSignMessage({
        campaign_id: poolId
      })
      toast.success('Apply whitelist successfully')
      setSuccess(true)
      return true
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [poolId, apiSignMessage, account])

  return { joinPool, loading, success }
}

export const useCheckJoinPool = (poolId: string | number, account: Address) => {
  const [loading, setLoading] = useState(false)
  const [isJoinPool, setJoinPool] = useState(false)
  const checkJoinPool = useCallback(async () => {
    try {
      if (!account || !poolId) {
        setJoinPool(false)
        return
      }
      setLoading(true)
      const res = await fetcher(`${API_BASE_URL}/user/check-join-campaign/${poolId}?wallet_address=${account}`)
      const isJoin = res.data
      setJoinPool(isJoin)
    } catch (error) {
      console.log('error', error)
    }
    setLoading(false)
  }, [poolId, account])
  useEffect(() => {
    checkJoinPool()
  }, [account, checkJoinPool])

  return { isJoinPool, loading, checkJoinPool }
}
