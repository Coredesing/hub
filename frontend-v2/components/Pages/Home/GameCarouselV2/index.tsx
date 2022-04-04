import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import Flicking from '@egjs/react-flicking'
import { AutoPlay, Sync } from '@egjs/flicking-plugins'
import arrowLeft from 'assets/images/icons/arrow-left.png'
import arrowRight from 'assets/images/icons/arrow-right.png'

type Props = {
  items?: any[];
  likes?: any[];
}

const GameCarousel = ({ items, likes }: Props) => {
  const isMobile = useMediaQuery({ maxWidth: '1000px' })
  const getLikeById = (id: any) => {
    return likes && likes.find(item => item.game_id === id)
  }

  const refSlider = useRef(null)
  const refSlider1 = useRef(null)

  const [plugins, setPlugins] = useState([])

  useEffect(() => {
    setPlugins([new Sync({
      type: 'index',
      synchronizedFlickingOptions: [
        {
          flicking: refSlider.current,
          isSlidable: true
        },
        {
          flicking: refSlider1.current,
          isClickable: true,
          activeClass: 'thumbnail-bullet-active'
        }
      ]
    }), new AutoPlay({ duration: 3000, direction: 'NEXT', stopOnHover: true })])
  }, [])

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
    !isMobile
      ? <div>
        <div className="flex w-full items-center gap-4">
          <div className="hidden sm:block">
            <img src={arrowLeft.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={prev}/>
          </div>
          <Flicking circular={true} plugins={plugins} className="flex-1 h-full" align="center" ref={refSlider} interruptable={true}>
            {items.map(item => (
              <div key={`game-${item.id}`} className="w-full mx-auto grid grid-cols-12 gap-4">
                <div className="col-span-7 xl:col-span-8 relative">
                  <div className="absolute z-10 top-0 left-0 uppercase font-medium tracking-widest text-xs xl:text-sm text-left bg-gamefiDark-900 w-1/2 md:pb-1 lg:pb-2 clipped-b-r-full inline-block">
                    <span className="text-gamefiGreen-500">Featured</span> games
                  </div>
                  <video className="clipped-t-r-lg" style={{ aspectRatio: '16/9', objectFit: 'fill' }} muted controls controlsList="nodownload" poster={item.screen_shots_1}>
                    <source src={item.intro_video} type="video/mp4"></source>
              Your browser does not support the video tag.
                  </video>
                </div>
                <div className="col-span-5 xl:col-span-4 2xl:pt-14 w-full px-4">
                  <div className="lg:text-lg xl:text-xl 2xl:text-3xl font-bold uppercase text-left">{item.game_name}</div>
                  <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
                    <div className="flex align-middle items-center text-sm">
                      <Image src={require('@/assets/images/icons/heart.svg')} alt="heart"/>
                      <p className="ml-2 tracking-widest text-gray-200">{getLikeById(item.id)?.total_like || 0}</p>
                    </div>
                    <div className="flex align-middle items-center ml-4 text-left">
                      <Image src={require('@/assets/images/icons/game-console.svg')} alt="game-console"/>
                      <p
                        className="ml-2 tracking-widest uppercase text-gray-200 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis text-left"
                        style={{ maxWidth: '180px' }}
                      >{item.developer}</p>
                    </div>
                  </div>
                  <div className="mt-3 xl:mt-5">
                    <p className="font-casual text-left leading-5 md:text-xs lg:text-base text-gray-300 max-h-32 2xl:max-h-64 overflow-y-scroll">{item.short_description}</p>
                  </div>
                  <div className="mt-3 xl:mt-5">
                    <Link href={`/hub/${item?.slug}`} passHref>
                      <div className="bg-gamefiGreen text-gamefiDark-900 py-2 px-6 rounded-xs clipped-t-r hover:opacity-90 w-36 cursor-pointer">
                        <a className="flex align-middle items-center">
                          <div className="mr-2 uppercase font-bold text-xs">View more</div>
                          <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" />
                        </a>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Flicking>
          <div className="hidden sm:block">
            <img src={arrowRight.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={next}/>
          </div>
        </div>
        <Flicking ref={refSlider1} bound={true} bounce={30} moveType="freeScroll">
          {items && items.map(item => <div key={`carousel-paginate-${item.id}`} className="border border-transparent mx-1 mt-8 cursor-pointer">
            <img className="h-20 w-36 object-cover thumbnail-bullet-active" src={item?.screen_shots_1} alt=""></img>
          </div>)}
        </Flicking>
      </div>
      : <div>
        <div className="flex w-full h-full items-center gap-4">
          <Flicking circular={true} plugins={plugins} className="w-full h-full flex" align="center" ref={refSlider} interruptable={true}>
            {items.map(item => (
              <div key={`mobile-game-${item.id}`} className="w-full">
                <div className="w-full">
                  <div className="absolute z-20 top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-center md:text-left bg-gamefiDark-900 w-1/2 md:pb-1 lg:pb-2 clipped-b-r-full inline-block"><span className="text-gamefiGreen-500">Featured</span> games</div>
                  <video key={`video-${item.id}`} className='clipped-t-r-lg' style={{ aspectRatio: '16/9', objectFit: 'fill' }} muted controls controlsList="nodownload" poster={item.screen_shots_1}>
                    <source src={item.intro_video} type="video/mp4"></source>
                  </video>
                </div>
                <div className="w-full my-4 px-8">
                  <div className="text-lg xl:text-xl 2xl:text-3xl font-bold uppercase text-left">{item.game_name}</div>
                  <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
                    <div className="flex align-middle items-center text-sm">
                      <Image src={require('@/assets/images/icons/heart.svg')} alt="heart"/>
                      <p className="ml-2 tracking-widest text-gray-200">{getLikeById(item.id)?.total_like || 0}</p>
                    </div>
                    <div className="flex align-middle items-center ml-4">
                      <Image src={require('@/assets/images/icons/game-console.svg')} alt="game-console"/>
                      <p
                        className="ml-2 tracking-widest uppercase text-gray-200 whitespace-nowrap overflow-hidden overflow-ellipsis"
                      >{item.developer}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-casual text-left leading-5 md:text-xs lg:text-base text-gray-300 max-h-36 overflow-y-scroll">{item.short_description}</p>
                  </div>
                  <div className="mt-3">
                    <Link href={`/hub/${item?.slug}`} passHref>
                      <button className="bg-gamefiGreen-500 text-gamefiDark-900 py-2 px-6 flex align-middle items-center rounded-xs clipped-t-r hover:opacity-90">
                        <div className="mr-2 uppercase font-bold text-xs">View more</div>
                        <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Flicking>
        </div>
        <Flicking ref={refSlider1} bound={true} bounce={30} moveType="freeScroll">
          {items && items.map(item => <div key={`carousel-paginate-${item.id}`} className="border border-transparent mx-1 mt-8 cursor-pointer">
            <img className="h-20 w-36 object-cover thumbnail-bullet-active" src={item?.screen_shots_1} alt=""></img>
          </div>)}
        </Flicking>
      </div>
  )
}

export default GameCarousel
