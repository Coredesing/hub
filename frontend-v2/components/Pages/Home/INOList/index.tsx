import PoolBanner from '@/components/Pages/Home/PoolBanner'
import React, { useMemo, useRef } from 'react'
import { useScreens } from '../utils'
import Image from 'next/image'
import { useFetch } from '@/utils'
import Flicking from '@egjs/react-flicking'

const INOList = () => {
  const screens = useScreens()
  const url = '/pools/current-pools?token_type=box&limit=6&page=1&is_private=0,1,2,3'
  const { response } = useFetch(url)
  const refSlider = useRef(null)

  const listUpcoming = useMemo<any[]>(() => {
    return response?.data?.data || []
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
              <Flicking circular={true} className="w-full" align="center" ref={refSlider} interruptable={true}>
                {listUpcoming.map(item => (
                  <div key={item.id} className="w-2/3 px-3"><PoolBanner item={item} color="yellow" url={`/ino/${item.slug || item.id}`}></PoolBanner></div>
                ))}
              </Flicking>
            </div>
            : <div className={`pt-14 mx-auto md:container 2xl:px-16 ${listUpcoming.length <= 3 ? 'flex' : 'grid grid-cols-3'} gap-4 xl:gap-6 justify-center items-center`}>
              {listUpcoming.map(item => (
                <PoolBanner key={`ino-${item.id}`} item={item} color="yellow" tagColor="gamefiDark-700" className="max-w-[400px]" url={`/ino/${item.slug || item.id}`}></PoolBanner>
              ))}
            </div>
        }
      </div>
    </>
    : <></>
  )
}

export default INOList
