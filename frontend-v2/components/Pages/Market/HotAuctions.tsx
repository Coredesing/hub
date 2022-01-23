import Dropdown from 'components/Base/Dropdown'
import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'
import Link from 'next/link'
import React from 'react'
import CardSlim from './CardSlim'

const HotAuctions = () => {
  return (
    <div className="bg-black w-full">
      <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 py-14">
        <div className="flex items-end">
          <div className="md:text-lg 2xl:text-3xl uppercase font-bold">Hot Auction</div>
          <Link href="#" passHref><div className="ml-2 font-medium text-gamefiGreen-700 md:leading-7 2xl:text-lg text-xs md:text-sm cursor-pointer">View All</div></Link>
        </div>
        <div className="relative">
          <div className="bg-gamefiDark-600" style={{ height: '1px', width: 'calc(100% - 150px)' }}></div>
          <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm" style={{ height: '4px', width: '60px' }}></div>
          <div className="absolute bottom-0 right-0 grid grid-flow-col gap-2">
            <div className={'h-full'}>
              <Dropdown></Dropdown>
            </div>
          </div>
        </div>
        <ListSwiper showItemsNumber={4} step={4} transition='0.5s'>
          <SwiperItem>
            <div className={'w-full px-3 md:px-0 mx-2'} style={{ minHeight: '300px' }}>
              <CardSlim item={{}}></CardSlim>
            </div>
          </SwiperItem>
          <SwiperItem>
            <div className={'w-full px-3 md:px-0 mx-2'} style={{ minHeight: '300px' }}>
              <CardSlim item={{}}></CardSlim>
            </div>
          </SwiperItem>
          <SwiperItem>
            <div className={'w-full px-3 md:px-0 mx-2'} style={{ minHeight: '300px' }}>
              <CardSlim item={{}}></CardSlim>
            </div>
          </SwiperItem>
          <SwiperItem>
            <div className={'w-full px-3 md:px-0 mx-2'} style={{ minHeight: '300px' }}>
              <CardSlim item={{}}></CardSlim>
            </div>
          </SwiperItem>
          <SwiperItem>
            <div className={'w-full px-3 md:px-0 mx-2'} style={{ minHeight: '300px' }}>
              <CardSlim item={{}}></CardSlim>
            </div>
          </SwiperItem>
          <SwiperItem>
            <div className={'w-full px-3 md:px-0 mx-2'} style={{ minHeight: '300px' }}>
              <CardSlim item={{}}></CardSlim>
            </div>
          </SwiperItem>
        </ListSwiper>
      </div>
    </div>
  )
}

export default HotAuctions
