import ListSwiper, { SwiperItem } from '@/components/Base/ListSwiper'
import React, { useMemo } from 'react'
import { useFetch } from '@/utils'
import Link from 'next/link'
import ImageLoader from '@/components/Base/ImageLoader'
import { useMediaQuery } from 'react-responsive'

const HotCollections = () => {
  const isMdScreen = useMediaQuery({ maxWidth: '960px' })

  const url = '/marketplace/collections?limit=10&page=1'
  const { response, loading } = useFetch(url)

  const hotCollections = useMemo<any[]>(() => {
    return response?.data?.data || []
  }, [response])

  return (
    <div className="md:px-4 lg:px-16 md:container mx-auto mt-20">
      {!loading && hotCollections?.length
        ? <ListSwiper title="Hot Collections" showItemsNumber={isMdScreen ? 2 : 4} step={isMdScreen ? 2 : 4} transition='0.5s' hasHeader={true} style={{ display: 'flex', gap: '16px', justifyContent: 'start' }}>
          {hotCollections.map(collection => (
            <SwiperItem key={collection.id} width={isMdScreen ? '250px' : '280px'} style={{ flex: `0 0 ${isMdScreen ? '250px' : '280px'}` }}>
              <Link href={`/market/collection/${collection.slug}`} passHref>
                <div className={'w-full md:px-0 flex flex-col overflow-hidden rounded-sm cursor-pointer hover:underline'} style={{ height: '240px' }}>
                  <div className={'w-full relative'} style={{ height: '150px' }}>
                    <div className="absolute left-0 right-0 mx-auto w-14 -bottom-6 rounded-full border-2 border-gamefiDark-900 bg-gamefiDark-900" style={{ zIndex: '1' }}>
                      <img src={collection.logo} alt="" className="w-14 rounded-full object-cover"></img>
                    </div>
                    <ImageLoader src={collection.banner} alt='' className='object-cover' style={{ width: '100%', height: '150px' }} />
                    {/* <img src={collection.banner} alt='favorite-img' className='object-cover' style={{ width: '100%', height: '150px' }} /> */}
                  </div>
                  <div className="relative bg-gamefiDark-650 w-full clipped-b-r-sm" style={{ height: '90px' }}>
                    <div className={'h-full flex items-center align-middle justify-center font-semibold py-4'}>{collection.name}</div>
                  </div>
                </div>
              </Link>
            </SwiperItem>
          ))}
        </ListSwiper>
        : <></>}
      {loading && (
        <div className="loader-wrapper">
          <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      )}
    </div>
  )
}

export default HotCollections
