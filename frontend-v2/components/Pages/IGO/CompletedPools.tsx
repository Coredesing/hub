import { useFetch } from '@/utils'
import React, { useMemo, useState } from 'react'

const CompletedPools = () => {
  const [page, setPage] = useState(1)
  const { response, loading } = useFetch(`https://hub.gamefi.org/api/v1/pools/complete-sale-pools?token_type=erc20&limit=10&page=${page}`)

  const pools = useMemo(() => {
    return response?.data?.data || []
  }, [response])
  return <></>
}

export default CompletedPools
