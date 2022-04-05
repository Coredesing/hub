import Layout from '@/components/Layout'
import Instruction from '@/components/Pages/Home/Instruction'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Card from '@/components/Pages/IGO/Card'
import { useFetch } from '@/utils'
import { Item } from '@/components/Pages/IGO/type'
import CompletedPools from '@/components/Pages/IGO/CompletedPools'
import { Carousel } from 'react-responsive-carousel'

export const ListIGOContext = createContext({
  now: null
})

const IGO = () => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const { response: totalCompletedResponse, loading: totalCompletedLoading } = useFetch('/pools/total-completed-pools')
  const totalCompletedPools = useMemo(() => {
    return totalCompletedResponse?.data?.total || 0
  }, [totalCompletedResponse?.data?.total])

  const roundedTotalCompletedPools = useMemo(() => {
    return Math.floor(Number(totalCompletedPools) / 10) * 10 || 0
  }, [totalCompletedPools])
  const { response: openingResponse, loading: openingLoading } = useFetch('/pools/active-pools?token_type=erc20&is_display=1')
  const { response: upcomingResponse, loading: upcomingLoading } = useFetch('/pools/upcoming-pools?token_type=erc20&is_display=1')

  const openingItems = useMemo<Item[]>(() => {
    const origin = openingResponse?.data?.data || []
    const sortedItems = origin.sort((a, b) => a?.finish_time < b?.finish_time)
    return sortedItems || []
  }, [openingResponse])

  const openingPublicList = useMemo<Item[]>(() => {
    return openingItems.filter(item => item.is_private !== 3)
  }, [openingItems])

  const openingCommunityList = useMemo<Item[]>(() => {
    return openingItems.filter(item => item.is_private === 3)
  }, [openingItems])

  const upcomingItems = useMemo<Item[]>(() => {
    const origin = upcomingResponse?.data?.data || []
    let remain = origin
    const tba = origin.filter(item => item.campaign_status?.toLowerCase() === 'tba' || (item.campaign_status?.toLowerCase() === 'upcoming' && !item.start_join_pool_time))
    remain = remain.filter(item => !tba.includes(item))
    const preWhitelist = remain.filter(item => new Date().getTime() < new Date(Number(item?.start_join_pool_time) * 1000).getTime()).sort((a, b) => a?.start_join_pool_time < b?.start_join_pool_time)
    remain = remain.filter(item => !preWhitelist.includes(item))
    const whitelist = remain.filter(item => new Date().getTime() < new Date(Number(item?.end_join_pool_time) * 1000).getTime()).sort((a, b) => a?.end_join_pool_time < b?.end_join_pool_time)
    remain = remain.filter(item => !whitelist.includes(item))
    const preStart = remain.filter(item => new Date().getTime() < new Date(Number(item?.start_time) * 1000).getTime()).sort((a, b) => a?.start_time < b?.start_time)
    const sortedItems = [].concat(preStart).concat(whitelist).concat(preWhitelist).concat(tba)

    return sortedItems || []
  }, [upcomingResponse])

  const upcomingPublicList = useMemo<Item[]>(() => {
    return upcomingItems.filter(item => item.is_private !== 3)
  }, [upcomingItems])

  const upcomingCommunityList = useMemo<Item[]>(() => {
    return upcomingItems.filter(item => item.is_private === 3)
  }, [upcomingItems])

  return (
    <Layout title="GameFi.org - Initial DEX Offering" description="The first game-specific launchpad conducting Initial Game Offerings for game projects.">
      <div className="px-4 lg:px-16 md:container mx-auto lg:block pt-16">
        <div className="w-full text-center text-[60px] xl:text-[84px] leading-[80%] font-bold uppercase select-none">
        Dedicated Gaming <br></br>Launchpad & IGO
        </div>
        <div className="mt-14 w-full flex gap-14 justify-center items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="text-[74px] leading-[80%] font-bold" style={{
              background: 'linear-gradient(97.24deg, #00FFC2 44.36%, #46DE43 95.01%), #FFFFFF',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{roundedTotalCompletedPools}+</div>
            <div className="uppercase font-medium">Total Projects Launched</div>
          </div>
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="text-[74px] leading-[80%] font-bold" style={{
              background: 'linear-gradient(97.24deg, #FF7A00 44.36%, #DE4343 95.01%), #FFFFFF',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>61X</div>
            <div className="uppercase font-medium">Average ATH ROI</div>
          </div>
        </div>
        <div className="">
          <Instruction></Instruction>
        </div>
      </div>
      <ListIGOContext.Provider value={{ now }}>
        {
          openingItems?.length > 0 && <div className="md:px-4 lg:px-16 mx-auto bg-black mt-20 pb-32">
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
                  Opening Projects
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('@/assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              openingLoading
                ? <div className="loader-wrapper mx-auto mt-14">
                  <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                Loading...
                </div>
                : <>
                  {openingPublicList?.length
                    ? <div className="w-full max-w-[1180px] mx-auto mt-14">
                      <p><span className="uppercase font-semibold text-xl">IGO Pool</span> <span className="text-white/60">($GAFI Staking required)</span></p>
                      <div className="hidden mt-4 w-full lg:grid lg:grid-cols-3 gap-6">
                        {openingPublicList.map(item => <div key={item.id} className="w-full">
                          <Card item={item} color="black" background="gamefiDark"></Card>
                        </div>)}
                      </div>
                      <div className="mt-4 w-full lg:hidden">
                        <Carousel
                          showIndicators={false}
                          showStatus={false}
                          centerMode
                          centerSlidePercentage={80}
                          showArrows={false}
                          infiniteLoop={true}
                        >
                          {openingPublicList.map(item => (
                            <div key={item.id} className="px-4"><Card item={item} color="black" background="gamefiDark"></Card></div>
                          ))}
                        </Carousel>
                      </div>
                    </div>
                    : <></>}
                  {openingCommunityList?.length
                    ? <>
                      <div className="w-full max-w-[1180px] mx-auto mt-14">
                        <p><span className="uppercase font-semibold text-xl">Community Pool</span> <span className="text-white/60">($GAFI Staking not required)</span></p>
                        <div className="hidden mt-4 w-full lg:grid md:grid-cols-3 lg:grid-cols-3 gap-6">
                          {openingCommunityList.map(item => <div key={item.id} className="w-full">
                            <Card item={item} color="black" background="gamefiDark"></Card>
                          </div>)}
                        </div>
                        <div className="mt-4 w-full lg:hidden">
                          <Carousel
                            showIndicators={false}
                            showStatus={false}
                            centerMode
                            centerSlidePercentage={80}
                            showArrows={false}
                            infiniteLoop={true}
                          >
                            {openingCommunityList.map(item => (
                              <div key={item.id} className="px-4"><Card item={item} color="black" background="gamefiDark"></Card></div>
                            ))}
                          </Carousel>
                        </div>
                      </div>
                    </>
                    : <></>}
                </>
            }
          </div>
        }
        {
          upcomingItems?.length > 0 && <div className={`md:px-4 lg:px-16 mx-auto pb-32 ${!openingItems?.length && 'bg-black'}`}>
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className={`inline-block top-0 left-0 right-0 uppercase ${openingItems?.length > 0 ? 'bg-black' : 'bg-gamefiDark'} w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl`}>
                  Upcoming Projects
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('@/assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              upcomingLoading
                ? <div className="loader-wrapper mx-auto mt-14">
                  <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                Loading...
                </div>
                : <>
                  {upcomingPublicList?.length
                    ? <div className="w-full max-w-[1180px] mx-auto mt-14">
                      <p><span className="uppercase font-semibold text-xl">IGO Pool</span> <span className="text-white/60">($GAFI Staking required)</span></p>
                      <div className="hidden mt-4 w-full lg:grid md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {upcomingPublicList.map(item => <div key={item.id} className="w-full">
                          <Card item={item} color={openingItems?.length > 0 ? 'gamefiDark' : 'black'} background={openingItems?.length > 0 ? 'black' : 'gamefiDark'}></Card>
                        </div>)}
                      </div>
                      <div className="mt-4 w-full lg:hidden">
                        <Carousel
                          showIndicators={false}
                          showStatus={false}
                          centerMode
                          centerSlidePercentage={80}
                          showArrows={false}
                          infiniteLoop={true}
                        >
                          {upcomingPublicList.map(item => (
                            <div key={item.id} className="px-2"><Card item={item} color={openingItems?.length > 0 ? 'gamefiDark' : 'black'} background={openingItems?.length > 0 ? 'black' : 'gamefiDark'}></Card></div>
                          ))}
                        </Carousel>
                      </div>
                    </div>
                    : <></>}
                  {upcomingCommunityList?.length
                    ? <>
                      <div className="w-full max-w-[1180px] mx-auto mt-14">
                        <p><span className="uppercase font-semibold text-xl">Community Pool</span> <span className="text-white/60">($GAFI Staking not required)</span></p>
                        <div className="hidden mt-4 w-full lg:grid md:grid-cols-3 lg:grid-cols-3 gap-6">
                          {upcomingCommunityList.map(item => <div key={item.id} className="w-full">
                            <Card item={item} color={openingItems?.length > 0 ? 'gamefiDark' : 'black'} background={openingItems?.length > 0 ? 'black' : 'gamefiDark'}></Card>
                          </div>)}
                        </div>
                        <div className="mt-4 w-full lg:hidden">
                          <Carousel
                            showIndicators={false}
                            showStatus={false}
                            centerMode
                            centerSlidePercentage={80}
                            showArrows={false}
                            infiniteLoop={true}
                          >
                            {upcomingCommunityList.map(item => (
                              <div key={item.id} className="px-2"><Card item={item} color={openingItems?.length > 0 ? 'gamefiDark' : 'black'} background={openingItems?.length > 0 ? 'black' : 'gamefiDark'}></Card></div>
                            ))}
                          </Carousel>
                        </div>
                      </div>
                    </>
                    : <></>}
                </>
            }
          </div>
        }
        <CompletedPools></CompletedPools>
      </ListIGOContext.Provider>
    </Layout>
  )
}

export default IGO
