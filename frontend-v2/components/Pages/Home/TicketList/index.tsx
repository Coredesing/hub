import React, { useMemo, useRef } from 'react'
import { useScreens } from '../utils'
import Image from 'next/image'
import CardItem from './CardItem'
import { useFetch } from '@/utils'
import Flicking from '@egjs/react-flicking'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'

const TicketList = () => {
  const screens = useScreens()
  const { response: response1, loading: loading1 } = useFetch('/pool/150')
  const { response: response2, loading: loading2 } = useFetch('/pool/153')

  const refSlider = useRef(null)

  const listUpcoming = useMemo<any[]>(() => {
    const origin = response1 && response2 ? [response1?.data, response2?.data] : []
    return origin
    // let remain = origin
    // const tba = origin.filter(item => !item.start_join_pool_time)
    // remain = remain.filter(item => !tba.includes(item))
    // const preWhitelist = remain.filter(item => new Date().getTime() < new Date(Number(item?.start_join_pool_time) * 1000).getTime()).sort((a, b) => a?.start_join_pool_time < b?.start_join_pool_time)
    // remain = remain.filter(item => !preWhitelist.includes(item))
    // const whitelist = remain.filter(item => new Date().getTime() < new Date(Number(item?.end_join_pool_time) * 1000).getTime()).sort((a, b) => a?.end_join_pool_time < b?.end_join_pool_time)
    // remain = remain.filter(item => !whitelist.includes(item))
    // const preStart = remain.filter(item => new Date().getTime() < new Date(Number(item?.start_time) * 1000).getTime()).sort((a, b) => a?.start_time < b?.start_time)
    // remain = remain.filter(item => !preStart.includes(item))?.sort((a, b) => a.finish_time < b.finish_time)
    // const sortedItems = [].concat(remain).concat(preStart).concat(whitelist).concat(preWhitelist).concat(tba)
    // return sortedItems || []
  }, [response1, response2])

  return (listUpcoming && listUpcoming.length > 0
    ? <>
      <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-32">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
            Gamer Pool Tickets
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('@/assets/images/under-stroke-green.svg')} alt="understroke"></Image>
          </div>
        </div>
        {
          screens.mobile || screens.tablet
            ? <div className="mt-14">
              <Flicking circular={true} className="w-full" align="center" ref={refSlider} interruptable={true}>
                {listUpcoming.map(item => (
                  <div key={`ticket-${item.id}`} className="w-2/3 px-3"><CardItem item={item}></CardItem></div>
                ))}
              </Flicking>
            </div>
            : <div className="mx-auto md:container 2xl:px-16">
              <div className={`text-center justify-center ${listUpcoming.length <= 3 ? 'flex' : 'grid grid-cols-3'} gap-4 xl:gap-6 mt-14`}>
                {listUpcoming.map(item => (
                  <CardItem key={`ticket-mobile-${item.id}`} item={item} className="max-w-[400px]"></CardItem>
                ))}
              </div>
              {
                loading1 || loading2
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
    : <></>
  )
}

export default TicketList
