import ListSwiper, { SwiperItem } from '@/components/Base/ListSwiper'
import React, { useEffect, useState } from 'react'
import NFTCard from '../NFTCard'
import { useNFTInfos } from '../utils'
import { useFetch } from '@/utils'

const ListTrending = () => {
  const url = '/marketplace/hot-offers?limit=10&page=1'
  const { response, loading } = useFetch(url)
  const [infos, setInfos] = useState([])

  const { data: items, loading: infoLoading } = useNFTInfos(response?.data?.data)
  useEffect(() => {
    if (response) {
      setInfos(items)
    }
  }, [infos, items, response])

  return (
    <div className="w-full pb-14">
      <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 py-14">
        {!loading && !infoLoading && items?.length
          ? <>
            {/* <div className="flex items-end">
              <div className="md:text-lg 2xl:text-3xl uppercase font-bold">Trending</div>
              <Link href="#" passHref><div className="ml-2 font-medium text-gamefiGreen-700 md:leading-7 2xl:text-lg text-xs md:text-sm cursor-pointer hover:underline">View All</div></Link>
            </div>
            <div className="relative">
              <div
                className="bg-gamefiDark-600"
                // style={{ height: '1px', width: 'calc(100% - 150px)' }}
                style={{ height: '1px', width: '100%' }}
              ></div>
              <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px' }}></div>
              <div className="absolute bottom-0 right-0 grid grid-flow-col gap-2">
                <div className={'h-full'}>
                  <Dropdown></Dropdown>
                </div>
              </div>
            </div> */}
            {infos && infos.length > 0
              ? <ListSwiper title="Trending" hasHeader={true} showItemsNumber={4} step={4} transition='0.5s'>
                {
                  infos.map((item, i) => <SwiperItem key={`hot-offers-${i}`}>
                    <div className="w-full mx-3">
                      <NFTCard item={item} showOffer={true} showListing={true}></NFTCard>
                    </div>
                  </SwiperItem>)
                }
              </ListSwiper>
              : <></>}
          </>
          : <></>}
        { (loading || infoLoading)
          ? (
            <div className="loader-wrapper mx-auto mt-14">
              <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          Loading...
            </div>
          )
          : <></> }
      </div>
    </div>
  )
}

export default ListTrending
