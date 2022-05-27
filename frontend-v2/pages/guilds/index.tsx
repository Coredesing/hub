import Layout from '@/components/Layout'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import GuildCard from '@/components/Pages/Guilds/GuildCard'
import ScholarshipCard from '@/components/Pages/Guilds/ScholarshipCard'
import { Pagination } from '@egjs/flicking-plugins'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'
import arrowLeft from '@/assets/images/icons/arrow-left.png'
import arrowRight from '@/assets/images/icons/arrow-right.png'
import { useMediaQuery } from 'react-responsive'
import { fetchScholarshipPrograms, fetchTopSelected } from '../api/guilds'

type Props = {
  guilds: any[];
  scholarshipPrograms: any[];
}

const Guilds = ({ guilds, scholarshipPrograms }: Props) => {
  const isMobile = useMediaQuery({ maxWidth: '1000px' })

  const [plugins] = useState([
    new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[2px] w-[50px] bg-gamefiDark-400"></div>'
      }
    })
  ])

  const refScholar = useRef(null)
  const refGuild = useRef(null)
  const prev = (ref) => {
    if (!ref.current) {
      return
    }

    ref.current.prev().catch(() => {})
  }
  const next = (ref) => {
    if (!ref.current) {
      return
    }

    ref.current.next().catch(() => {})
  }

  return (
    <Layout title='GameFi.org - Guilds' extended={true}>
      <>
        <div className="w-full pt-16 lg:pt-0" style={{ background: 'linear-gradient(180deg, #0C0D12 0%, rgba(12, 13, 18, 0) 100%)' }}>
          <div className="container mx-auto w-full h-full select-none hidden lg:block">
            <Image src={require('@/assets/images/guilds/guilds-banner.png')} alt=""></Image>
          </div>
          <div className="container mx-auto w-full h-full select-none lg:hidden">
            <Image src={require('@/assets/images/guilds/banner-mobile.png')} alt=""></Image>
          </div>
        </div>
        {
          guilds?.length > 0
            ? <div className="max-w-[1380px] mx-auto lg:px-16 my-8 mt-12">
              <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
                <div className="inline-block top-0 left-0 right-0 uppercase w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
                Top Selected Guilds
                </div>
                <div className="absolute -bottom-5 left-0 right-0">
                  <Image src={require('@/assets/images/under-stroke-green.svg')} alt="understroke"></Image>
                </div>
              </div>
              <div className="hidden mt-14 lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {guilds?.length && guilds.map(guild => <GuildCard key={`guild-card-${guild.id}`} item={guild}></GuildCard>)}
              </div>
              <div className="w-full lg:hidden mt-14">
                <Flicking circular={true} className="w-full" align="center" ref={refGuild} interruptable={true}>
                  {guilds?.length && guilds.map(guild => <div key={`guild-card-mobile-${guild.id}`} className="w-3/4 px-2"><GuildCard item={guild}></GuildCard></div>)}
                </Flicking>
              </div>
            </div>
            : <></>
        }
        {
          scholarshipPrograms?.length > 0
            ? <div className="w-full bg-black pb-24 mt-14" style={{ clipPath: isMobile ? 'polygon(50% 100%, 100% 95%, 100% 0, 0 0, 0 95%)' : 'polygon(50% 100%, 100% 85%, 100% 0, 0 0, 0 85%)' }}>
              <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-[500px] mx-auto text-center font-bold md:text-lg lg:text-xl">
                <div className="inline-block -top-1px left-0 right-0 uppercase bg-gamefiDark w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
                  Top Scholarship Program
                </div>
                <div className="absolute -bottom-5 left-0 right-0">
                  <Image src={require('@/assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
                </div>
              </div>
              <div className="mt-14 max-w-[1380px] mx-auto px-4 lg:px-16 flex gap-4">
                <div className="hidden sm:block">
                  <img src={arrowLeft.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={() => { prev(refScholar) }}/>
                </div>
                <Flicking
                  circular={true}
                  panelsPerView={isMobile ? 1 : 2}
                  className="flex-1 gap-2"
                  plugins={plugins}
                  align="prev"
                  ref={refScholar}
                  interruptable={true}
                >
                  {scholarshipPrograms.map(program => <div className="px-2 mb-8" key={`scholarship-${program.id}`}><ScholarshipCard item={program} className="mb-4"></ScholarshipCard></div>)}
                  <ViewportSlot>
                    <div className="flicking-pagination !relative flex items-center justify-center gap-1"></div>
                    <div></div>
                  </ViewportSlot>
                </Flicking>
                <div className="hidden sm:block">
                  <img src={arrowRight.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={() => { next(refScholar) }}/>
                </div>
              </div>
            </div>
            : ''
        }
        <div className="pt-32 w-full overflow-hidden">
          <div className="max-w-[1380px] mx-auto px-4 lg:px-16 w-full select-none grid lg:grid-cols-2 gap-4">
            <div className="w-full text-[36px] leading-[36px] lg:text-[84px] lg:leading-[67px] uppercase font-bold">Get Involved With Guild Games</div>
            <div className="flex flex-col gap-4 relative text-gamefiDark-100">
              <div className="leading-[24px] max-w-[450px]">Players will receive the game&apos;s NFT, proceed to play, and receive rewards (will be divided according to the percentage agreed by the parties in advance).</div>
              <div className="leading-[24px] max-w-[450px]">Depending on the guild, there will be different selection criteria. Once being selected, you will receive instructions on the tasks to do (corresponding to the role you choose).</div>
              <div className="mt-12 z-[1]">
                <Image src={require('@/assets/images/guilds/banner-1.png')} width={431} height={168} alt=""></Image>
              </div>
              <div className="hidden lg:block absolute -top-[200px] -right-[200px]">
                <Image className="absolute -top-24 -right-[100px]" src={require('@/assets/images/guilds/light.png')} alt=""></Image>
              </div>
            </div>
          </div>
          <div className="mt-14 px-4 lg:px-16 w-full o max-w-[1380px] mx-auto">
            <div className="max-w-[400px]">There are normally 4 roles in a guild. Person can take on various roles depending on the project.</div>
          </div>
          <div className="overflow-auto max-w-[1380px] mx-auto px-4 lg:px-16 w-full pb-8 font-casual text-sm font-light hide-scrollbar">
            <div className="mt-8 min-w-[800px] grid grid-cols-4 gap-4">
              <div className="bg-gamefiDark-800 pt-12 pb-16 px-4 flex flex-col gap-4">
                <div className="text-gamefiDark-200 font-semibold">01</div>
                <div>Scholar</div>
                <div className="text-gamefiDark-200">As the main game player, this is the member that guilds recruit a lot.</div>
              </div>
              <div className="bg-gamefiDark-800 pt-12 pb-16 px-4 flex flex-col gap-4">
                <div className="text-gamefiDark-200 font-semibold">02</div>
                <div>Trainer</div>
                <div className="text-gamefiDark-200">Guide new Scholars about the game: NFTs, gameplay, strategies,...</div>
              </div>
              <div className="bg-gamefiDark-800 pt-12 pb-16 px-4 flex flex-col gap-4">
                <div className="text-gamefiDark-200 font-semibold">03</div>
                <div>Manager</div>
                <div className="text-gamefiDark-200">Receive NFTs from scholarship programs. Be responsible for recruiting, guiding Trainers & Scholars</div>
              </div>
              <div className="bg-gamefiDark-800 pt-12 pb-16 px-4 flex flex-col gap-4">
                <div className="text-gamefiDark-200 font-semibold">04</div>
                <div>Investor</div>
                <div className="text-gamefiDark-200">People who want to earn extra income from lending NFT to others through scholarship programs</div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Guilds

export const getServerSideProps = async () => {
  try {
    const guilds = await fetchTopSelected()
    const scholarshipPrograms = await fetchScholarshipPrograms()

    return {
      props: {
        guilds: guilds?.data || [],
        scholarshipPrograms: scholarshipPrograms?.data || []
      }
    }
  } catch (error) {
    return {
      props: {}
    }
  }
}
