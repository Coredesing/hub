import Layout from '@/components/Layout'
import Instruction from '@/components/Pages/Home/Instruction'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Card from '@/components/Pages/IGO/Card'
import { useFetch } from '@/utils'
import { Item } from '@/components/Pages/IGO/type'

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
  const { response: openingResponse, loading: openingLoading } = useFetch('/pools/active-pools?token_type=erc20&is_display=1')
  const { response: upcomingResponse, loading: upcomingLoading } = useFetch('/pools/upcoming-pools?token_type=erc20&is_display=1')

  const openingItems = useMemo<Item[]>(() => {
    return openingResponse?.data?.data || []
  }, [openingResponse])

  const openingPublicList = useMemo<Item[]>(() => {
    return openingItems.filter(item => item.is_private !== 3)
  }, [openingItems])

  const openingCommunityList = useMemo<Item[]>(() => {
    return openingItems.filter(item => item.is_private === 3)
  }, [openingItems])

  const upcomingItems = useMemo<Item[]>(() => {
    return upcomingResponse?.data?.data || []
  }, [upcomingResponse])

  const upcomingPublicList = useMemo<Item[]>(() => {
    return upcomingItems.filter(item => item.is_private !== 3)
  }, [upcomingItems])

  const upcomingCommunityList = useMemo<Item[]>(() => {
    return upcomingItems.filter(item => item.is_private === 3)
  }, [upcomingItems])

  return (
    <Layout title="Launchpad">
      <div className="px-2 md:px-4 lg:px-16 md:container mx-auto lg:block pt-16">
        <div className="w-full text-center text-[84px] leading-[80%] font-bold uppercase">
        Dedicated Gaming <br></br>Launchpad & IGO
        </div>
        <div className="mt-14 w-full flex gap-14 justify-center items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="text-[74px] leading-[80%] font-bold" style={{
              background: 'linear-gradient(97.24deg, #00FFC2 44.36%, #46DE43 95.01%), #FFFFFF',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>55+</div>
            <div className="uppercase font-medium">Total Projects Launched</div>
          </div>
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="text-[74px] leading-[80%] font-bold" style={{
              background: 'linear-gradient(97.24deg, #FF7A00 44.36%, #DE4343 95.01%), #FFFFFF',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>500X</div>
            <div className="uppercase font-medium">Average ATH ROI</div>
          </div>
        </div>
        <div className="">
          <Instruction></Instruction>
        </div>
      </div>
      <ListIGOContext.Provider value={{ now }}>
        <div className="md:px-4 lg:px-16 mx-auto bg-black mt-20 pb-32">
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
                    <p><span className="uppercase font-semibold text-xl">Pool IGO</span> <span className="text-white/60">(Staking $GAFI required)</span></p>
                    <div className="mt-4 w-full grid md:grid-cols-3 xl:grid-cols-3 gap-6">
                      {openingPublicList.map(item => <div key={item.id} className="w-full">
                        <Card item={item} color="black" background="gamefiDark"></Card>
                      </div>)}
                    </div>
                  </div>
                  : <></>}
                {openingCommunityList?.length
                  ? <>
                    <div className="w-full max-w-[1180px] mx-auto mt-14">
                      <p><span className="uppercase font-semibold text-xl">Pool Community</span> <span className="text-white/60">(Staking $GAFI not required)</span></p>
                      <div className="mt-4 w-full grid md:grid-cols-3 xl:grid-cols-3 gap-6">
                        {openingCommunityList.map(item => <div key={item.id} className="w-full">
                          <Card item={item} color="black" background="gamefiDark"></Card>
                        </div>)}
                      </div>
                    </div>
                  </>
                  : <></>}
              </>
          }
        </div>
        <div className="md:px-4 lg:px-16 mx-auto pb-32">
          <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
            <div className="inline-block top-0 left-0 right-0 uppercase bg-black w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
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
                    <p><span className="uppercase font-semibold text-xl">Pool IGO</span> <span className="text-white/60">(Staking $GAFI required)</span></p>
                    <div className="mt-4 w-full grid md:grid-cols-3 xl:grid-cols-3 gap-6">
                      {upcomingPublicList.map(item => <div key={item.id} className="w-full">
                        <Card item={item} color="gamefiDark" background="black"></Card>
                      </div>)}
                    </div>
                  </div>
                  : <></>}
                {upcomingCommunityList?.length
                  ? <>
                    <div className="w-full max-w-[1180px] mx-auto mt-14">
                      <p><span className="uppercase font-semibold text-xl">Pool Community</span> <span className="text-white/60">(Staking $GAFI not required)</span></p>
                      <div className="mt-4 w-full grid md:grid-cols-3 xl:grid-cols-3 gap-6">
                        {upcomingCommunityList.map(item => <div key={item.id} className="w-full">
                          <Card item={item} color="gamefiDark" background="black"></Card>
                        </div>)}
                      </div>
                    </div>
                  </>
                  : <></>}
              </>
          }
        </div>
      </ListIGOContext.Provider>
    </Layout>
  )
}

export default IGO
