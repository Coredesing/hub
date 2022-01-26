import PoolBanner from 'components/Base/PoolBanner'
import React, { useMemo } from 'react'
import { Carousel } from 'react-responsive-carousel'
import { useFetch, useScreens } from '../utils'
import Image from 'next/image'
import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'
import ShadowLoader from 'components/Base/ShadowLoader'

const INOList = () => {
  const screens = useScreens()
  const upcomingUrl = '/pools/upcoming-pools?token_type=box&limit=20&page=1&is_private=0'
  const latestUrl = '/pools?token_type=box&limit=5&page=1&is_private=0'
  const { response: upcomingData, loading: upcomingLoading } = useFetch(upcomingUrl)
  const { response: latestData, loading: latestLoading } = useFetch(latestUrl)

  const listUpcoming = useMemo<any[]>(() => {
    return upcomingData?.data?.data || []
  }, [upcomingData])

  const listLatest = useMemo<any[]>(() => {
    return latestData?.data?.data || []
  }, [latestData])

  return (
    <>
      {
        listUpcoming && listUpcoming.length
          ? <div className="md:px-4 lg:px-16 mx-auto bg-gamefiDark-700 mt-20 pb-14">
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
              Upcoming INOs
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('assets/images/under-stroke-green.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              screens.tablet
                ? <div className='mt-14'>
                  <Carousel
                    showIndicators={false}
                    showStatus={false}
                    centerMode
                    centerSlidePercentage={80}
                    showArrows={false}
                    infiniteLoop={true}
                  >
                    {listUpcoming.map(item => (
                      <PoolBanner key={item.id} item={item} color="green" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                    ))}
                  </Carousel>
                </div>
                : <div className="mx-auto md:container 2xl:px-16">
                  {listUpcoming?.length
                    ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                      {listUpcoming.map(item => (
                        <SwiperItem key={item.id}>
                          <PoolBanner item={item} color="green" className="mx-3 lg:mx-auto" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                        </SwiperItem>
                      ))}
                    </ListSwiper>
                    : <></>}
                  {
                    upcomingLoading || latestLoading
                      ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                        <SwiperItem>
                          <ShadowLoader className="mx-3"></ShadowLoader>
                        </SwiperItem>
                        <SwiperItem>
                          <ShadowLoader className="mx-3"></ShadowLoader>
                        </SwiperItem>
                        <SwiperItem>
                          <ShadowLoader className="mx-3"></ShadowLoader>
                        </SwiperItem>
                      </ListSwiper>
                      : <></>
                  }
                </div>
            }
          </div>
          : <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-14">
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
              Latest INOs
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('assets/images/under-stroke-green.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              screens.mobile || screens.tablet
                ? <div className='mt-14'>
                  <Carousel
                    showIndicators={false}
                    showStatus={false}
                    centerMode
                    centerSlidePercentage={70}
                    showArrows={false}
                    infiniteLoop={true}
                  >
                    {listLatest?.length && listLatest.map(item => (
                      <PoolBanner key={item.id} item={item} color="green" countdownStatus="ended" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                    ))}
                  </Carousel>
                </div>
                : <div className="mx-auto flex container 2xl:px-16">
                  {listLatest?.length
                    ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                      {listLatest.map(item => (
                        <SwiperItem key={item.id}>
                          <PoolBanner item={item} color="green" className="mx-3" countdownStatus="Ended" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                        </SwiperItem>
                      ))}
                    </ListSwiper>
                    : <></>}
                  {
                    upcomingLoading || latestLoading
                      ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                        <SwiperItem>
                          <ShadowLoader className="mx-3"></ShadowLoader>
                        </SwiperItem>
                        <SwiperItem>
                          <ShadowLoader className="mx-3"></ShadowLoader>
                        </SwiperItem>
                        <SwiperItem>
                          <ShadowLoader className="mx-3"></ShadowLoader>
                        </SwiperItem>
                      </ListSwiper>
                      : <></>
                  }
                </div>
            }
          </div>
      }
    </>
  )
}

export default INOList
