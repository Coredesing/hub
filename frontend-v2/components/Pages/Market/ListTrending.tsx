import Dropdown from 'components/Base/Dropdown'
import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'
import Link from 'next/link'
import React, { useMemo } from 'react'
import CardSlim from './CardSlim'
import { Item } from './types'
import { useAxiosFetch } from './utils'

const ListTrending = () => {
  const url = '/marketplace/hot-offers?limit=10&page=1'
  const { data, loading } = useAxiosFetch(url)

  const hotItems = useMemo<Item[]>(() => {
    console.log('trending', data?.data?.data?.data)
    return data?.data?.data?.data || []
  }, [data])

  return (
    <div className="w-full">
      <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 py-14">
        {!loading && hotItems?.length
          ? <><div className="flex items-end">
            <div className="md:text-lg 2xl:text-3xl uppercase font-bold">Trending</div>
            <Link href="#" passHref><div className="ml-2 font-medium text-gamefiGreen-700 md:leading-7 2xl:text-lg text-xs md:text-sm cursor-pointer">View All</div></Link>
          </div>
          <div className="relative">
            <div className="bg-gamefiDark-600" style={{ height: '1px', width: 'calc(100% - 150px)' }}></div>
            <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px' }}></div>
            <div className="absolute bottom-0 right-0 grid grid-flow-col gap-2">
              <div className={'h-full'}>
                <Dropdown></Dropdown>
              </div>
            </div>
          </div>
          <ListSwiper showItemsNumber={4} step={4} transition='0.5s'>
            <SwiperItem>
              <CardSlim item={{}}></CardSlim>
            </SwiperItem>
          </ListSwiper>
          </>
          : <></>}
        { loading && (
          <div className="loader-wrapper">
            <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          Loading...
          </div>
        ) }
      </div>
    </div>
  )
}

export default ListTrending
