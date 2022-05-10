import { useRef, useState } from 'react'
import Image from 'next/image'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import { Pagination } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'
import arrowLeft from '@/assets/images/icons/arrow-left.png'
import arrowRight from '@/assets/images/icons/arrow-right.png'
import Animoca from '@/assets/images/brands/Animoca.png'
import DaoMaker from '@/assets/images/brands/DaoMaker.png'
import IceteaLabs from '@/assets/images/brands/IceteaLabs.png'
import MorningStar from '@/assets/images/brands/MorningStar.png'
import Polygon from '@/assets/images/brands/Polygon.png'

const Partners = () => {
  const [plugins] = useState([new Pagination({
    type: 'bullet',
    renderBullet: () => {
      return '<div class="h-[2px] w-[100px] bg-gamefiDark-400"></div>'
    }
  })])

  const refSlider = useRef(null)
  const prev = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.prev().catch(() => {})
  }
  const next = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.next().catch(() => {})
  }

  return (
    <div className="px-4 lg:px-16 md:container mx-auto pt-20 pb-14">
      <div className="mx-auto relative" style={{ maxWidth: '600px' }}>
        <Image src={require('@/assets/images/backedby.png')} alt=""></Image>
        <div className="font-casual text-sm sm:text-base -mt-8 text-white/80 text-center max-w-lg mx-auto">
        GameFi.org is honored and thrilled to be backed by leading Venture Capitals in blockchain industry.
        </div>
      </div>
      <div className="container mx-auto xl:px-16 grid gap-2 grid-cols-2 md:grid-cols-5 items-center justify-center mt-8 max-w-6xl">
        <a href="https://icetea.io" target="_blank" className="flex items-center justify-center col-span-2 md:col-span-1 md:order-3" rel="noreferrer"><img src={IceteaLabs.src} alt="Icetea Labs" className="!max-w-[50%] md:!max-w-[100%]"></img></a>
        <a href="https://daomaker.com/" target="_blank" className="flex items-center justify-center md:order-1" rel="noreferrer"><img src={DaoMaker.src} alt="DaoMaker" ></img></a>
        <a href="https://www.animocabrands.com/" target="_blank" className="flex items-center justify-center md:order-2" rel="noreferrer"><img src={Animoca.src} alt="Animoca" ></img></a>
        <a href="https://morningstar.ventures/" target="_blank" className="flex items-center justify-center md:order-4" rel="noreferrer"><img src={MorningStar.src} alt="MorningStar" ></img></a>
        <a href="https://polygon.technology/" target="_blank" className="flex items-center justify-center md:order-5" rel="noreferrer"><img src={Polygon.src} alt="Polygon" ></img></a>
      </div>
      <div className="flex flex-col items-center mt-14">
        <div className="font-bold text-2xl uppercase">Our Portfolio</div>
        <div className="font-casual text-sm sm:text-base text-white/80 text-center max-w-2xl mx-auto">
        All projects launched on GameFi.org are scrutinized and hand-picked.
        They all aim at long-term development and ensure benefits for GameFi users.
        </div>
      </div>
      <div className="flex mt-8 gap-4">
        <div className="hidden sm:block">
          <img src={arrowLeft.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={prev}/>
        </div>
        <Flicking circular={true} className="flex-1" plugins={plugins} align="center" ref={refSlider} interruptable={true}>
          <div className="w-full mb-8">
            <div className="grid grid-cols-3 max-w-xl mx-auto md:hidden gap-x-2 gap-y-6">
              <a href="https://solice.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/1.png')} alt=""></Image></a>
              <a href="https://sidusheroes.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/2.png')} alt=""></Image></a>
              <a href="https://www.rebelbots.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/3.png')} alt=""></Image></a>
              <a href="https://metagods.gg/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/4.png')} alt=""></Image></a>
              <a href="https://metawars.gg/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/5.png')} alt=""></Image></a>
              <a href="https://projectseed.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/6.png')} alt=""></Image></a>
              <a href="https://wam.app" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/7.png')} alt=""></Image></a>
              <a href="https://ertha.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/8.png')} alt=""></Image></a>
              <a href="https://www.darkfrontiers.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/9.png')} alt=""></Image></a>
              <a href="https://titanhunters.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/10.png')} alt=""></Image></a>
              <a href="https://orbitau.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/11.png')} alt=""></Image></a>
              <a href="https://bullieverse.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/12.png')} alt=""></Image></a>
              <a href="https://gunstar.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/13.png')} alt=""></Image></a>
              <a href="https://dreams.quest/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/14.png')} alt=""></Image></a>
              <a href="https://www.warena.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/15.png')} alt=""></Image></a>
              <a href="https://polygonum.online/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/16.png')} alt=""></Image></a>
              <a href="https://rmg.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/17.png')} alt=""></Image></a>
              <a href="https://placewar.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/18.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center">
              <a href="https://solice.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/1.png')} alt=""></Image></a>
              <a href="https://sidusheroes.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/2.png')} alt=""></Image></a>
              <a href="https://www.rebelbots.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/3.png')} alt=""></Image></a>
              <a href="https://metagods.gg/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/4.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <a href="https://metawars.gg/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/5.png')} alt=""></Image></a>
              <a href="https://projectseed.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/6.png')} alt=""></Image></a>
              <a href="https://wam.app" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/7.png')} alt=""></Image></a>
              <a href="https://ertha.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/8.png')} alt=""></Image></a>
              <a href="https://www.darkfrontiers.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/9.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <a href="https://titanhunters.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/10.png')} alt=""></Image></a>
              <a href="https://orbitau.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/11.png')} alt=""></Image></a>
              <a href="https://bullieverse.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/12.png')} alt=""></Image></a>
              <a href="https://gunstar.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/13.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <a href="https://dreams.quest/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/14.png')} alt=""></Image></a>
              <a href="https://www.warena.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/15.png')} alt=""></Image></a>
              <a href="https://polygonum.online/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/16.png')} alt=""></Image></a>
              <a href="https://rmg.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/17.png')} alt=""></Image></a>
              <a href="https://placewar.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/18.png')} alt=""></Image></a>
            </div>
          </div>
          <div className="w-full mb-8">
            <div className="grid grid-cols-3 max-w-xl mx-auto md:hidden gap-x-2 gap-y-6">
              <a href="https://planetsandbox.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/19.png')} alt=""></Image></a>
              <a href="https://deathroad.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/20.png')} alt=""></Image></a>
              <a href="https://kabyarena.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/21.png')} alt=""></Image></a>
              <a href="https://mechmaster.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/22.png')} alt=""></Image></a>
              <a href="https://www.spacey2025.com" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/23.png')} alt=""></Image></a>
              <a href="https://mymasterwar.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/24.png')} alt=""></Image></a>
              <a href="https://f2nft.games/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/25.png')} alt=""></Image></a>
              <a href="https://thewastedlands.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/26.png')} alt=""></Image></a>
              <a href="https://aspo.world/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/27.png')} alt=""></Image></a>
              <a href="https://www.olysport.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/28.png')} alt=""></Image></a>
              <a href="https://www.vulcano.gg/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/29.png')} alt=""></Image></a>
              <a href="https://drunk-robots.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/30.png')} alt=""></Image></a>
              <a href="https://froyo.games/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/31.png')} alt=""></Image></a>
              <a href="https://www.metaspets.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/32.png')} alt=""></Image></a>
              <a href="https://codyfight.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/33.png')} alt=""></Image></a>
              <a href="https://www.elumia.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/34.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center">
              <a href="https://planetsandbox.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/19.png')} alt=""></Image></a>
              <a href="https://deathroad.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/20.png')} alt=""></Image></a>
              <a href="https://kabyarena.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/21.png')} alt=""></Image></a>
              <a href="https://mechmaster.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/22.png')} alt=""></Image></a>
              <a href="https://www.spacey2025.com" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/23.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <a href="https://mymasterwar.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/24.png')} alt=""></Image></a>
              <a href="https://f2nft.games/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/25.png')} alt=""></Image></a>
              <a href="https://thewastedlands.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/26.png')} alt=""></Image></a>
              <a href="https://aspo.world/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/27.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <a href="https://www.olysport.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/28.png')} alt=""></Image></a>
              <a href="https://www.vulcano.gg/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/29.png')} alt=""></Image></a>
              <a href="https://drunk-robots.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/30.png')} alt=""></Image></a>
              <a href="https://froyo.games/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/31.png')} alt=""></Image></a>
              <a href="https://www.metaspets.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/32.png')} alt=""></Image></a>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <a href="https://codyfight.com/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/33.png')} alt=""></Image></a>
              <a href="https://www.elumia.io/" target="_blank" className="block" rel="noreferrer"><Image src={require('@/assets/images/brands/34.png')} alt=""></Image></a>
            </div>
          </div>
          <ViewportSlot>
            <div className="flicking-pagination !relative flex items-center justify-center gap-1"></div>
            <div></div>
          </ViewportSlot>
        </Flicking>
        <div className="hidden sm:block">
          <img src={arrowRight.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={next}/>
        </div>
      </div>

    </div>
  )
}

export default Partners
