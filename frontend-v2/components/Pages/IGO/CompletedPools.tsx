import { useFetch } from '@/utils'
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Dropdown from '@/components/Base/Dropdown'
import SearchInput from '@/components/Base/SearchInput'

const CompletedPools = () => {
  const [page, setPage] = useState(1)
  const { response, loading } = useFetch(`/pools/complete-sale-pools?token_type=erc20&limit=10&page=${page}`)

  const pools = useMemo(() => {
    return response?.data?.data || []
  }, [response])
  return <div className="relative bg-black w-full pb-20">
    <div className="absolute left-0 top-0 h-14 w-1/3">
      <div className="inline-block uppercase bg-gamefiDark-900 w-full h-full clipped-b-r-full p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
      </div>
    </div>
    <div className="max-w-[1180px] mx-auto mt-20 relative">
      <div className="w-full flex items-center justify-between">
        <div className="h-14 flex items-center font-bold text-lg lg:text-2xl uppercase">Completed Projects</div>
        <div className="h-14 flex gap-2 items-center">
          <Dropdown></Dropdown>
          <Dropdown></Dropdown>
          <SearchInput></SearchInput>
        </div>
      </div>
    </div>
  </div>
}

export default CompletedPools
