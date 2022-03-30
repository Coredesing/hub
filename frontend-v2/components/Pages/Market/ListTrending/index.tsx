import { CarouselList, SwiperItem } from '@/components/Base/ListSwiper'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import NFTCard from '../NFTCard'
import { useNFTInfos } from '../utils'
import { useFetch } from '@/utils'
import Link from 'next/link'
import Dropdown from '@/components/Base/Dropdown'
import { FILTER_TIMES } from '../constant'
import { ObjectType } from '@/utils/types'
// import { useMediaQuery } from 'react-responsive'

const ListTrending = () => {
  // const isMdScreen = useMediaQuery({ maxWidth: '960px' })
  const [filter, setFilter] = useState({ start: '' })
  const [infos, setInfos] = useState([])
  const url = useMemo(() => {
    const query = new URLSearchParams(filter).toString()
    return `/marketplace/hot-offers?limit=10&page=1&${query}`
  }, [filter])
  useEffect(() => {
    setInfos([])
  }, [url])
  const { response, loading } = useFetch(url)
  const onSetInfo = useCallback((item: ObjectType) => {
    setInfos((arr) => [
      ...arr,
      item
    ])
  }, [setInfos])

  const { data: items, loading: infoLoading } = useNFTInfos(response?.data?.data, onSetInfo)
  useEffect(() => {
    if (response) {
      // setInfos(items)
    }
  }, [infos, items, response])

  const onChangeFilterTime = (item: ObjectType) => {
    setFilter({ start: item?.value })
  }

  return (
    <div className="w-full pb-14">
      <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 py-14">
        <div className="flex items-end">
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
              <Dropdown
                items={FILTER_TIMES}
                propLabel='name'
                propValue='value'
                onChange={onChangeFilterTime}
                selected={FILTER_TIMES.find(f => f.value === filter.start as any)}
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          {<CarouselList key={infos.length}>{
            infos.map((item, i) => <SwiperItem
              key={`hot-offers-${i}`}
              style={{ minWidth: '280px' }}
              className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2"
            >
              <div className='w-full'>
                <NFTCard item={item} showOffer={true} showListing={true}></NFTCard>
              </div>
            </SwiperItem>)
          }
          </CarouselList> }
        </div>
        {/* {infos.length > 0 && <ListSwiper
          title="Trending"
          hasHeader={false}
          showItemsNumber={isMdScreen ? 1 : 4} step={isMdScreen ? 1 : 4}
          transition='0.5s'
          style={{ display: 'flex', justifyContent: (infos.length > 4 || isMdScreen) ? 'start' : 'center', gap: '16px' }}>
          {
            infos.map((item, i) => <SwiperItem key={`hot-offers-${i}`} style={{ minWidth: '280px' }} width={'280px'}>
              <div className='w-full'>
                <NFTCard item={item} showOffer={true} showListing={true}></NFTCard>
              </div>
            </SwiperItem>)
          }
        </ListSwiper>
        } */}
        {(loading || infoLoading)
          ? (
            <div className="loader-wrapper mx-auto mt-14">
              <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          )
          : <></>}
      </div>
    </div>
  )
}

export default ListTrending
