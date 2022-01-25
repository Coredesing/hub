/* eslint-disable @next/next/no-img-element */
import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'
import React, { useMemo } from 'react'
import { useFetch } from './utils'
import { Collection } from './types'

const HotCollections = () => {
  const url = '/marketplace/collections?limit=10&page=1'
  const { data, loading } = useFetch(url)

  const hotCollections = useMemo<Collection[]>(() => {
    return data?.data?.data?.data || []
  }, [data])
  return (
    <div className="md:px-4 lg:px-16 md:container mx-auto mt-20">
      {!loading && hotCollections?.length
        ? <ListSwiper title="Hot Collections" showItemsNumber={4} step={4} transition='0.5s' hasHeader={true}>
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
  )
}

export default HotCollections
