// import Dropdown from '@/components/Base/Dropdown'
// import ListSwiper, { SwiperItem } from '@/components/Base/ListSwiper'
import React, { useEffect, useState } from 'react'
import NFTCard from '@/components/Pages/Market/NFTCard'
import { useNFTInfos } from '@/components/Pages/Market/utils'
import FilterDropdown from '../FilterDropdown'
import { useRouter } from 'next/router'
import { useFetch } from '@/utils'

const NFTFilterOptions = [
  {
    key: 'hot-items',
    label: 'Hot Items',
    value: 'hot-offers'
  }
]

const NFTList = () => {
  const router = useRouter()

  const url = '/marketplace/hot-offers?limit=4&page=1'
  const { response, loading: initialLoading } = useFetch(url)
  const [infos, setInfos] = useState([])
  const [nftFilterOption, setNftFilterOption] = useState(router?.query?.topNFT?.toString() || NFTFilterOptions[0].value)

  const { data: items, loading: infoLoading } = useNFTInfos(response?.data?.data)
  useEffect(() => {
    if (response) {
      setInfos(items)
    }
  }, [infos, items, response])

  useEffect(() => {
    if (router?.query?.topNFT) {
      setNftFilterOption(router?.query?.topNFT?.toString())
    }
  }, [router?.query?.topNFT])

  const handleChangeGameFilter = async (item: any) => {
    setNftFilterOption(item?.value)
    await router.push({ query: { topGames: item.value || 'Top Favourite' } }, undefined, { shallow: true })
  }

  return (
    <div className="w-full">
      <div className="px-4 lg:px-16 md:container mx-auto mt-20 py-14">
        {!initialLoading && !infoLoading && infos?.length
          ? <>
            <div className="flex items-end">
              <div className="md:text-lg 2xl:text-3xl uppercase font-bold flex">
                <span className="mr-2">Market</span> <FilterDropdown items={NFTFilterOptions} selected={nftFilterOption} onChange={handleChangeGameFilter}></FilterDropdown>
              </div>
            </div>
            <div className="relative">
              <div
                className="bg-gamefiDark-600"
                style={{ height: '1px', width: '100%' }}
              ></div>
              <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px', marginLeft: '0', marginTop: '0' }}></div>
            </div>
            {infos && infos.length > 0
              ? <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
                {
                  infos.map((item, i) => <div key={`hot-nft-${i}`} className="w-full">
                    <NFTCard item={item} showOffer={true} showListing={true}></NFTCard>
                  </div>
                  )}
              </div>
              : <></>}
          </>
          : <></>}
        { (initialLoading || infoLoading) && (
          <>
            <div className="flex items-end">
              <div className="md:text-lg 2xl:text-3xl uppercase font-bold flex">
                <span className="mr-2">Market</span> <FilterDropdown items={NFTFilterOptions} selected={nftFilterOption} onChange={handleChangeGameFilter}></FilterDropdown>
              </div>
            </div>
            <div className="relative">
              <div
                className="bg-gamefiDark-600"
                style={{ height: '1px', width: '100%' }}
              ></div>
              <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px', marginLeft: '0', marginTop: '0' }}></div>
            </div>
            <div className="loader-wrapper mx-auto mt-14">
              <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
        Loading...
            </div>
          </>
        ) }
      </div>
    </div>
  )
}

export default NFTList
