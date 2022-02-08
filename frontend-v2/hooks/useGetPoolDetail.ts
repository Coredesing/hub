import { useEffect, useState } from 'react'
import { ObjectType } from '@/utils/types'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

type Props = {
    id: string | number;
}
const useGetPoolDetail = ({ id }: Props) => {
  const [loading, setLoading] = useState(true)
  const [poolInfo, setPoolInfo] = useState<null | ObjectType>(null)
  useEffect(() => {
    if (!id) return
    fetcher(`${API_BASE_URL}/pool/${id}`).then((res) => {
      const pool = res.data
      setPoolInfo(pool)
    }).catch(err => {
      console.error('Error when get Pool info', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [id])
  return {
    loading,
    poolInfo
  }
}

export default useGetPoolDetail
