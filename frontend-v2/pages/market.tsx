/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'
import Layout from 'components/Layout'
import Image from 'next/image'
import useSWR from 'swr'
import Link from 'next/link'
import Dropdown from '../components/Base/Dropdown'

const Market = () => {
  const [hotCollections, setHotCollections] = useState([])
  const fetcher = url => axios.get(url).then(res => res?.data)
  const { data: fetchHotCollectionsResponse, error: fetchHotCollectionsError } = useSWR('https://hub.gamefi.org/api/v1/marketplace/collections?limit=10&page=1', fetcher)

  useEffect(() => {
    setHotCollections(fetchHotCollectionsResponse?.data?.data)
    console.log(fetchHotCollectionsResponse?.data?.data)
  }, [fetchHotCollectionsResponse])
  return (
    <Layout title="GameFi Market">
      <div className="relative w-full min-h-full">
        <div
          className="absolute top-0 right-0"
          style={{
            background: 'radial-gradient(74.55% 74.55% at 19.72% 25.45%, #C5BD06 0%, #00FF0A 100%)',
            width: '250px',
            height: '559px',
            opacity: '0.1',
            filter: 'blur(184px)'
          }}
        ></div>
        <div className="absolute bottom-0 right-0">
          <Image src={require('assets/images/bg-item-market.png')} width="221" height="247" alt=""></Image>
        </div>
        <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
          <Image src={require('assets/images/market-banner.png')} alt=""></Image>
        </div>
        <div>
          <div className="md:px-4 lg:px-16 md:container mx-auto mt-20">
            {hotCollections && hotCollections.length > 0
              ? <ListSwiper showItemsNumber={4} step={4} transition='0.5s' hasHeader={true}>
                {hotCollections.map(collection => (
                  <SwiperItem key={collection.id}>
                    <div className={'w-full px-3 md:px-0 flex flex-col overflow-hidden rounded-sm mx-2 cursor-pointer'} style={{ height: '240px' }}>
                      <div className={'w-full relative'} style={{ height: '150px' }}>
                        <div className="absolute left-0 right-0 mx-auto w-14 -bottom-6 rounded-full border-2 border-gamefiDark-900 bg-gamefiDark-900" style={{ zIndex: '1' }}>
                          <img src={collection.logo} alt="" className="w-14 rounded-full"></img>
                        </div>
                        <img src={collection.banner} alt='favorite-img' style={{ width: '100%', height: '150px' }} />
                      </div>
                      <div className="relative bg-gamefiDark-650 w-full clipped-b-r-sm" style={{ height: '90px' }}>
                        <div className={'h-full flex items-center align-middle justify-center font-semibold py-4'}>{collection.name}</div>
                      </div>
                    </div>
                  </SwiperItem>
                ))}
              </ListSwiper>
              : <></>}
          </div>
        </div>
        <div className="bg-black w-full">
          <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 py-14">
            <div className="flex items-end">
              <div className="md:text-lg 2xl:text-3xl uppercase font-bold">Hot Auction</div>
              <Link href="#" passHref><div className="ml-2 font-medium text-gamefiGreen-700 md:leading-7 2xl:text-lg text-xs md:text-sm cursor-pointer">View All</div></Link>
            </div>
            <div className="w-full relative bg-gamefiDark-600" style={{ height: '4px' }}>
              <div className="absolute bottom-0 right-0 bg-black clipped-t-l-full-sm" style={{ height: '3px', width: 'calc(100% - 60px)' }}></div>
              <div className="absolute bottom-0 right-0 grid grid-flow-col gap-2">
                <div className={'h-full pl-6 bg-black'}>
                  <Dropdown></Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Market
