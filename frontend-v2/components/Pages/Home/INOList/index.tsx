import PoolBanner from '@/components/Base/PoolBanner'
import React, { useMemo } from 'react'
import { Carousel } from 'react-responsive-carousel'
import { useScreens } from '../utils'
import Image from 'next/image'
import ListSwiper, { SwiperItem } from '@/components/Base/ListSwiper'
import { useFetch } from '@/utils'

const INOList = () => {
  const screens = useScreens()
  const url = '/pools/latest-pools?token_type=box&limit=6&page=1&is_private=0,1,2,3'
  const { response, loading } = useFetch(url)

  const listUpcoming = useMemo<any[]>(() => {
    return response?.data || []
  }, [response])

  return (listUpcoming && listUpcoming.length > 0
    ? <>
      <div className="md:px-4 lg:px-16 mx-auto pb-14">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="inline-block top-0 left-0 right-0 uppercase bg-black w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
              Upcoming INOs
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('@/assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
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
              <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                {listUpcoming.map(item => (
                  <SwiperItem key={item.id}>
                    <PoolBanner item={item} color="yellow" tagColor="gamefiDark-700" className="mx-3" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                  </SwiperItem>
                ))}
              </ListSwiper>
            </div>
        }
      </div>
    </>
    : <></>
  )
}

export default INOList
