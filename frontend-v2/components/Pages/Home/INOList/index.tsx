import PoolBanner from 'components/Base/PoolBanner'
import React, { useMemo } from 'react'
import { Carousel } from 'react-responsive-carousel'
import { useFetch, useScreens } from '../utils'
import Image from 'next/image'
import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'

const INOList = () => {
  const screens = useScreens()
  const url = '/pools/latest-pools?token_type=box&limit=6&page=1&is_private=0'
  const { response, loading } = useFetch(url)

  const listUpcoming = useMemo<any[]>(() => {
    return response?.data || []
  }, [response])

  return (
    <>
      <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-14">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
              Latest INOs
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
          </div>
        </div>
        {
          screens.mobile || screens.tablet
            ? <div className="pt-14">
              <Carousel
                showIndicators={false}
                showStatus={false}
                centerMode
                centerSlidePercentage={80}
                showArrows={false}
                infiniteLoop={true}
              >
                {listUpcoming.map(item => (
                  <PoolBanner key={item.id} item={item} color="yellow" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                ))}
              </Carousel>
            </div>
            : <div className="mx-auto md:container 2xl:px-16">
              {listUpcoming?.length
                ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                  {listUpcoming.map(item => (
                    <SwiperItem key={item.id}>
                      <PoolBanner item={item} color="yellow" tagColor="gamefiDark-700" className="mx-3" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                    </SwiperItem>
                  ))}
                </ListSwiper>
                : <></>}
              {
                loading
                  ? <div className="loader-wrapper mx-auto mt-14">
                    <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  Loading...
                  </div>
                  : <></>
              }
            </div>
        }
      </div>
    </>
  )
}

export default INOList
