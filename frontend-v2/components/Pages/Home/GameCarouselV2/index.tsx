import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Flicking from '@egjs/react-flicking'
import { AutoPlay, Sync } from '@egjs/flicking-plugins'
import arrowLeft from '@/assets/images/icons/arrow-left.png'
import arrowRight from '@/assets/images/icons/arrow-right.png'
import clsx from 'clsx'
import { useAppContext } from '@/context'
import { intervalToDuration } from 'date-fns'
import { CarouselItem } from '@/pages/index'

type Props = {
  items: CarouselItem[];
}

type IconProps = {
  className?: string;
  onClick?: () => void;
}

const PauseIcon = ({ onClick }: IconProps) => (
  <svg
    onClick={onClick}
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="35" cy="35" r="35" fill="white" fillOpacity="0.2" />
    <circle cx="35" cy="35" r="34.5" stroke="black" strokeOpacity="0.2" />
    <path
      d="M30 24H25C24.7348 24 24.4804 24.1054 24.2929 24.2929C24.1054 24.4804 24 24.7348 24 25V45C24 45.2652 24.1054 45.5196 24.2929 45.7071C24.4804 45.8946 24.7348 46 25 46H30C30.2652 46 30.5196 45.8946 30.7071 45.7071C30.8946 45.5196 31 45.2652 31 45V25C31 24.7348 30.8946 24.4804 30.7071 24.2929C30.5196 24.1054 30.2652 24 30 24Z"
      fill="white"
    />
    <path
      d="M45 24H40C39.7348 24 39.4804 24.1054 39.2929 24.2929C39.1054 24.4804 39 24.7348 39 25V45C39 45.2652 39.1054 45.5196 39.2929 45.7071C39.4804 45.8946 39.7348 46 40 46H45C45.2652 46 45.5196 45.8946 45.7071 45.7071C45.8946 45.5196 46 45.2652 46 45V25C46 24.7348 45.8946 24.4804 45.7071 24.2929C45.5196 24.1054 45.2652 24 45 24Z"
      fill="white"
    />
  </svg>
)

const PlayIcon = ({ onClick }: IconProps) => (
  <svg
    onClick={onClick}
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="35" cy="35" r="35" fill="white" fillOpacity="0.2" />
    <circle cx="35" cy="35" r="34.5" stroke="black" strokeOpacity="0.2" />
    <path
      d="M30.2333 23.3833C30.0724 23.2626 29.881 23.1891 29.6806 23.171C29.4802 23.153 29.2788 23.1911 29.0989 23.281C28.9189 23.371 28.7676 23.5093 28.6618 23.6805C28.556 23.8516 28.5 24.0488 28.5 24.25V43.75C28.5 43.9512 28.556 44.1484 28.6618 44.3195C28.7676 44.4907 28.9189 44.629 29.0989 44.719C29.2788 44.8089 29.4802 44.847 29.6806 44.829C29.881 44.8109 30.0724 44.7374 30.2333 44.6167L46.2333 34.8667C46.3679 34.7658 46.4771 34.6349 46.5523 34.4845C46.6275 34.3341 46.6667 34.1682 46.6667 34C46.6667 33.8318 46.6275 33.6659 46.5523 33.5155C46.4771 33.3651 46.3679 33.2342 46.2333 33.1333L30.2333 23.3833Z"
      fill="white"
    />
  </svg>
)

const Countdown = ({ to }) => {
  const [mounted, setMounted] = useState(false)
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')

  useEffect(() => {
    const interval = setInterval(() => {
      const duration = intervalToDuration({
        start: new Date(Number(to) * 1000),
        end: new Date()
      })
      if (
        duration.days === 0 &&
        duration.hours === 0 &&
        duration.minutes === 0 &&
        duration.seconds === 0
      ) {
        clearInterval(interval)
        return
      }
      setDays(duration.days < 10 ? `0${duration.days}` : `${duration.days}`)
      setHours(duration.hours < 10 ? `0${duration.hours}` : `${duration.hours}`)
      setMinutes(
        duration.minutes < 10 ? `0${duration.minutes}` : `${duration.minutes}`
      )
      setSeconds(
        duration.seconds < 10 ? `0${duration.seconds}` : `${duration.seconds}`
      )
    }, 1000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [to])

  useEffect(() => setMounted(true), [])
  if (!mounted || !to) return null
  // if (to === 'TBA') return <div className="font-semibold text-2xl">Coming Soon</div>

  return (
    <div className="text-[28px] text-white leading-[100%] font-bold font-mechanic flex mb-8 bg-black bg-opacity-20 clipped-t-l overflow-hidden">
      <div className="flex px-5 py-3 gap-4">
        <div className="flex flex-col items-center gap-2 w-fit">
          <p>{days}</p>
          <p className="uppercase font-semibold text-[10px] leading-[12px]">
            days
          </p>
        </div>
        <p>:</p>
        <div className="flex flex-col items-center gap-2 w-fit">
          <p>{hours}</p>
          <p className="uppercase font-semibold text-[10px] leading-[12px]">
            hours
          </p>
        </div>
        <p>:</p>
        <div className="flex flex-col items-center gap-2 w-fit">
          <p>{minutes}</p>
          <p className="uppercase font-semibold text-[10px] leading-[12px]">
            minutes
          </p>
        </div>
        <p>:</p>
        <div className="flex flex-col items-center gap-2 w-fit">
          <p>{seconds}</p>
          <p className="uppercase font-semibold text-[10px] leading-[12px]">
            seconds
          </p>
        </div>
      </div>
    </div>
  )
}

const CarouselMobile = ({
  items,
  mobileSliderPlugins,
  refSliderMobile,
  refSliderMobile1,
  toggleAutoplay,
  currentItem
}) => {
  return (
    <div className="lg:hidden">
      <div className="flex w-full h-full items-center gap-4">
        <Flicking
          circular={true}
          plugins={mobileSliderPlugins}
          className="w-full h-full flex"
          align="center"
          ref={refSliderMobile}
          interruptable={true}
        >
          {items.map((item) => (
            <div key={`mobile-game-${item.id}`} className="w-full">
              <div className="w-full">
                <div className="absolute z-20 top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-center md:text-left bg-gamefiDark-900 w-1/2 md:pb-1 lg:pb-2 clipped-b-r-full inline-block">
                  <span className="text-gamefiGreen-700">Featured</span> games
                </div>
                <video
                  id={`video-${item.id}`}
                  key={`video-${item.id}`}
                  className="clipped-t-r-lg"
                  style={{ aspectRatio: '16/9', objectFit: 'fill' }}
                  muted
                  controls
                  preload="auto"
                  controlsList="nodownload"
                  poster={item.thumbnail}
                  onPlay={() => {
                    toggleAutoplay(false)
                  }}
                  onPause={() => {
                    toggleAutoplay(true)
                  }}
                  onEnded={() => {
                    toggleAutoplay(true)
                  }}
                >
                  <source src={item.video} type="video/mp4"></source>
                </video>
              </div>
              <div className="w-full my-4 px-8">
                <div className="text-lg xl:text-xl 2xl:text-3xl font-bold uppercase text-left">
                  {item.title}
                </div>
                <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
                  <div className="flex align-middle items-center text-sm">
                    <Image
                      src={require('@/assets/images/icons/heart.svg')}
                      alt="heart"
                    />
                    <p className="ml-2 tracking-widest text-gray-200">
                      {currentItem?.likes || 0}
                    </p>
                  </div>
                  {/* <div className="flex align-middle items-center ml-4">
                <Image src={require('@/assets/images/icons/game-console.svg')} alt="game-console"/>
                <p
                  className="ml-2 tracking-widest uppercase text-gray-200 whitespace-nowrap max-w-[200px] overflow-hidden overflow-ellipsis"
                >{item.developer}</p>
              </div> */}
                </div>
                <div className="mt-3">
                  <p className="font-casual text-left leading-5 md:text-xs lg:text-base text-gray-300 max-h-36 overflow-y-scroll">
                    {item.shortDescription}
                  </p>
                </div>
                <div className="mt-3">
                  <Link href={`/hub/${item?.slug}`} passHref>
                    <button className="bg-gamefiGreen-700 text-gamefiDark-900 py-2 px-6 flex align-middle items-center rounded-xs clipped-t-r hover:opacity-90">
                      <div className="mr-2 uppercase font-bold text-xs">
                        View more
                      </div>
                      <Image
                        src={require('@/assets/images/icons/arrow-right-dark.svg')}
                        alt="right"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Flicking>
      </div>
      <Flicking
        ref={refSliderMobile1}
        bound={true}
        bounce={30}
        moveType="freeScroll"
      >
        {items &&
          items.map((item) => (
            <div
              key={`carousel-paginate-${item.id}`}
              className="border border-transparent mx-1 mt-8 cursor-pointer"
            >
              <div className="h-20 w-36 relative">
                <img className="object-fill" src={item?.thumbnail} alt=""></img>
              </div>
            </div>
          ))}
      </Flicking>
    </div>
  )
}

const CarouselDesktop = ({
  items,
  setCurPanelIndex,
  curPanelIndex,
  plugins,
  prev,
  next,
  setVideoLoaded,
  isCurVideoPlaying,
  pauseVideo,
  playVideo,
  calculatedVideoLayerWidth,
  refSlider,
  refSlider1,
  currentItem,
  countdown,
  flickingVerticalHeight
}) => {
  return (
    <div className="hidden lg:block">
      <div
        id="flicking1wrapper"
        className="flex max-w-[1180px] mx-auto items-center gap-4 relative"
      >
        <div className="hidden sm:block">
          <img
            src={arrowLeft.src}
            alt=""
            className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none"
            onClick={prev}
          />
        </div>
        <Flicking
          onChanged={(e) => setCurPanelIndex(e.index)}
          defaultIndex={curPanelIndex}
          plugins={plugins}
          circular={true}
          className="flex-1"
          align="center"
          ref={refSlider}
          interruptable={true}
        >
          {items.map((item, i) => (
            <div key={`game-${item.id}`} className="w-full">
              <div className="relative">
                <video
                  id={`video-${i}`}
                  style={{ aspectRatio: '16/9', objectFit: 'fill' }}
                  muted
                  controls={false}
                  autoPlay={false}
                  preload="auto"
                  poster={item.thumbnail}
                  onEnded={next}
                  onLoadedData={() => setVideoLoaded(true)}
                >
                  <source src={item.video} type="video/mp4"></source>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </Flicking>
        <div className="hidden sm:block">
          <img
            src={arrowRight.src}
            alt=""
            className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none"
            onClick={next}
          />
        </div>

        <div
          className={clsx(
            'group overflow-hidden absolute top-0 left-12 -right-14 bottom-0 h-full z-10 w-fit'
          )}
          style={{ width: `${calculatedVideoLayerWidth}px` }}
        >
          <div className="relative w-full h-full justify-between flex">
            <div className="absolute z-10 top-0 left-0 uppercase font-medium tracking-widest text-xs xl:text-sm text-left bg-gamefiDark-900 md:w-[169px] md:pb-1 lg:pb-2 clipped-b-r-full inline-block">
              <span className="text-gamefiGreen-700">Featured</span> games
            </div>
            <div
              className={clsx(
                !isCurVideoPlaying ? 'w-2/5' : 'w-1/5',
                'group-hover:w-2/5 h-ful bg-gradient-to-r from-[#15171e]'
              )}
            ></div>
            <div
              className={clsx(
                !isCurVideoPlaying ? 'w-2/5' : 'w-1/5',
                'group-hover:w-2/5 bg-gradient-to-l from-[#15171e] h-full'
              )}
            ></div>
            <div
              className={clsx(
                !isCurVideoPlaying ? 'opacity-100' : 'opacity-0',
                'absolute cursor-pointer w-[70px] h-[70px] top-0 left-0 right-0 bottom-0 mx-auto my-auto z-30 group-hover:opacity-100 transition-all duration-300'
              )}
            >
              {isCurVideoPlaying
                ? <PauseIcon onClick={() => pauseVideo(curPanelIndex, false)} />
                : <PlayIcon onClick={() => playVideo(curPanelIndex)} />}
            </div>

            <div
              id="flicking2wrapper"
              className={clsx(
                !isCurVideoPlaying
                  ? 'right-6 opacity-100'
                  : '-right-24 opacity-0',
                'absolute top-6 w-32 z-20 group-hover:right-6 group-hover:opacity-100 transition-all duration-300 ease-in-out'
              )}
              style={{ height: `${flickingVerticalHeight}px` }}
            >
              <Flicking
                onChanged={(e) => setCurPanelIndex(e.index)}
                className="h-full"
                horizontal={false}
                ref={refSlider1}
                defaultIndex={curPanelIndex}
                bound={true}
                bounce={30}
                moveType="freeScroll"
              >
                {items.map((item, i) => (
                  <div
                    key={`caurouse-paginate-${item.id}`}
                    className={clsx(
                      'my-1 cursor-pointer rounded-sm overflow-hidden relative border border-transparent hover:border-gamefiGreen-700',
                      curPanelIndex === i ? 'border border-gamefiGreen-700' : ''
                    )}
                  >
                    <img
                      className="h-20 w-36 object-cover thumbnail-bullet-active"
                      src={item?.thumbnail}
                      alt=""
                    ></img>

                    {curPanelIndex === i && (
                      <div className="w-8 h-1 clipped-t-r-lg bg-gamefiGreen-700 absolute bottom-0 left-0"></div>
                    )}
                  </div>
                ))}
              </Flicking>
            </div>

            <div className="absolute md:bottom-8 lg:bottom-14 2xl:bottom-32 left-8 z-30">
              <div className="flex align-middle items-center w-full mb-5">
                {
                  <div className="flex align-middle items-center text-sm">
                    <Image
                      src={require('@/assets/images/icons/heart.svg')}
                      alt="heart"
                    />
                    <p className="ml-[10px] tracking-widest text-base text-white leading-[150%]">
                      {currentItem?.likes || 0}
                    </p>
                  </div>
                }
              </div>
              <div className="text-[40px] font-bold uppercase text-left mb-8  leading-[100%]">
                {currentItem?.title}
              </div>
              {currentItem.upcoming && (
                <div className="uppercase mt-8 font-bold text-[13px] tracking-[0.04em] leading-[150%] mb-1">
                  {countdown?.title || ''}
                </div>
              )}
              {currentItem.upcoming && countdown?.toTime !== 'TBA' && (
                <Countdown to={countdown.toTime} />
              )}
              {currentItem.upcoming && countdown?.toTime === 'TBA' && (
                <div className="font-casual pb-3">TBA</div>
              )}
              <div>
                <Link
                  href={
                    currentItem.upcoming
                      ? `/igo/${currentItem?.slug}`
                      : `/hub/${currentItem?.aggregatorSlug}`
                  }
                  passHref
                >
                  <div className="bg-gamefiGreen-700 text-gamefiDark-900 py-2 px-6 rounded-xs clipped-t-r hover:opacity-90 w-36 cursor-pointer">
                    <a className="flex align-middle items-center">
                      <div className="mr-2 uppercase font-bold text-[13px]">
                        {currentItem.upcoming ? 'Join now' : 'View more'}
                      </div>
                      <Image
                        src={require('@/assets/images/icons/arrow-right-dark.svg')}
                        alt="right"
                      />
                    </a>
                  </div>
                </Link>
              </div>
            </div>

            <div className="absolute bottom-0 right-4 z-10">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13 0V13H0L13 0Z" fill="#6CDB00" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const GameCarousel = ({ items }: Props) => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [curPanelIndex, setCurPanelIndex] = useState(0)
  const [countForceCheckCurVideoPlaying, setForceCheckCurVideoPlaying] =
    useState(0)
  const [flickingVerticalHeight, setFlickingVerticalHeight] = useState(0)
  const [calculatedVideoLayerWidth, setCalculatedVideoLayerWidth] = useState(0)
  const [currentItem, setCurItem] = useState<CarouselItem>(items?.[0] || null)
  const [isCurVideoPlaying, setIsCurVideoPlaying] = useState(false)
  const [countdown, setCountDown] = useState({ title: '', toTime: null })

  const { now } = useAppContext()

  const forceCheck = () =>
    setForceCheckCurVideoPlaying(countForceCheckCurVideoPlaying + 1)

  const refSlider = useRef(null)
  const refSlider1 = useRef(null)
  const refSliderMobile = useRef(null)
  const refSliderMobile1 = useRef(null)

  const [plugins, setPlugins] = useState([])
  const [mobileSliderPlugins, setMobileSliderPlugins] = useState([])

  const playVideo = (index) => {
    const id = `video-${index}`
    const videoElm = document.getElementById(id) as HTMLVideoElement
    if (videoElm) {
      videoElm.play()
    }
    forceCheck()
  }

  const pauseVideo = (index, force = true) => {
    const id = `video-${index}`
    const videoElm = document.getElementById(id) as HTMLVideoElement
    if (videoElm) {
      videoElm.pause()
      if (force) {
        videoElm.currentTime = 0
      }
    }
    forceCheck()
  }

  useEffect(() => {
    if (window.innerWidth <= 1000) return
    playVideo(curPanelIndex)
    items.forEach((e, i) => {
      if (i !== curPanelIndex) {
        pauseVideo(i)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curPanelIndex])

  useEffect(() => {
    setPlugins([
      new Sync({
        type: 'index',
        synchronizedFlickingOptions: [
          {
            flicking: refSlider.current,
            isSlidable: true
          },
          {
            flicking: refSlider1.current,
            isClickable: true,
            activeClass: 'xl:thumbnail-bullet-active'
          }
        ]
      })
    ])

    setMobileSliderPlugins([
      new Sync({
        type: 'index',
        synchronizedFlickingOptions: [
          {
            flicking: refSliderMobile.current,
            isSlidable: true
          },
          {
            flicking: refSliderMobile1.current,
            isClickable: true,
            activeClass: 'xl:thumbnail-bullet-active'
          }
        ]
      })
    ])

    refSlider.current.change = (e) => setCurPanelIndex(e.index)
    refSlider1.current.change = (e) => setCurPanelIndex(e.index)
  }, [])

  const toggleAutoplay = useCallback((status) => {
    if (status) {
      setPlugins([
        new Sync({
          type: 'index',
          synchronizedFlickingOptions: [
            {
              flicking: refSlider.current,
              isSlidable: true
            },
            {
              flicking: refSlider1.current,
              isClickable: true,
              activeClass: 'xl:thumbnail-bullet-active'
            }
          ]
        }),
        new AutoPlay({ duration: 3000, direction: 'NEXT', stopOnHover: true })
      ])
      setMobileSliderPlugins([
        new Sync({
          type: 'index',
          synchronizedFlickingOptions: [
            {
              flicking: refSliderMobile.current,
              isSlidable: true
            },
            {
              flicking: refSliderMobile1.current,
              isClickable: true,
              activeClass: 'xl:thumbnail-bullet-active'
            }
          ]
        }),
        new AutoPlay({ duration: 3000, direction: 'NEXT', stopOnHover: true })
      ])
      return
    }
    setPlugins([
      new Sync({
        type: 'index',
        synchronizedFlickingOptions: [
          {
            flicking: refSlider.current,
            isSlidable: true
          },
          {
            flicking: refSlider1.current,
            isClickable: true,
            activeClass: 'xl:thumbnail-bullet-active'
          }
        ]
      })
    ])
    setMobileSliderPlugins([
      new Sync({
        type: 'index',
        synchronizedFlickingOptions: [
          {
            flicking: refSliderMobile.current,
            isSlidable: true
          },
          {
            flicking: refSliderMobile1.current,
            isClickable: true,
            activeClass: 'xl:thumbnail-bullet-active'
          }
        ]
      })
    ])
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

  useEffect(() => {
    const elm = document.getElementById('flicking1wrapper')
    if (!elm) return
    setFlickingVerticalHeight(elm.clientHeight - 48)
    setCalculatedVideoLayerWidth(elm.clientWidth - 80)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoLoaded])

  const onWindowResize = () => {
    if (window.innerWidth <= 1000) return
    setTimeout(() => {
      const elm = document.getElementById('flicking1wrapper')
      if (!elm) return
      setFlickingVerticalHeight(elm.clientHeight - 48)
      setCalculatedVideoLayerWidth(elm.clientWidth - 80)
      forceCheck()
    }, 100)
  }
  useEffect(() => {
    window.addEventListener('resize', onWindowResize)
    forceCheck()
    // return window.removeEventListener('resize', onWindowResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const id = `video-${curPanelIndex}`
    const videoElm = document.getElementById(id) as HTMLVideoElement

    if (!videoElm) {
      setIsCurVideoPlaying(false)
    } else {
      setIsCurVideoPlaying(!videoElm.paused)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countForceCheckCurVideoPlaying])

  useEffect(() => {
    setCurItem(items[curPanelIndex] || null)
  }, [curPanelIndex, items])

  useEffect(() => {
    if (
      !currentItem?.poolInfo?.saleStartTime &&
      ['tba', 'upcoming'].includes(
        currentItem?.poolInfo?.campaignStatus?.toLowerCase()
      )
    ) {
      return setCountDown({ title: 'Whitelist Starts In', toTime: 'TBA' })
    }
    if (
      currentItem?.poolInfo?.saleEndTime &&
      currentItem?.poolInfo?.campaignStatus?.toLowerCase() === 'swap'
    ) {
      return setCountDown({
        title: 'Swap Ends In',
        toTime: currentItem?.poolInfo?.saleEndTime
      })
    }
    if (
      currentItem?.poolInfo?.buyType?.toLowerCase() === 'whitelist' &&
      currentItem?.poolInfo?.campaignStatus?.toLowerCase() === 'upcoming' &&
      now?.getTime() >=
        new Date(
          Number(currentItem?.poolInfo?.whitelistStartTime) * 1000
        ).getTime() &&
      now?.getTime() <
        new Date(
          Number(currentItem?.poolInfo?.whitelistEndTime) * 1000
        ).getTime()
    ) {
      return setCountDown({
        title: 'Whitelist Ends In',
        toTime: currentItem?.poolInfo?.whitelistEndTime
      })
    }
    if (
      currentItem?.poolInfo?.buyType?.toLowerCase() === 'whitelist' &&
      now?.getTime() <
        new Date(
          Number(currentItem?.poolInfo?.whitelistStartTime) * 1000
        ).getTime()
    ) {
      return setCountDown({
        title: 'Whitelist Starts In',
        toTime: currentItem?.poolInfo?.whitelistStartTime
      })
    }
    if (
      now?.getTime() >
        new Date(
          Number(currentItem?.poolInfo?.whitelistEndTime) * 1000
        ).getTime() &&
      now?.getTime() <=
        new Date(Number(currentItem?.poolInfo?.saleStartTime) * 1000).getTime()
    ) {
      return setCountDown({
        title: 'Buying Phase Starts In',
        toTime: currentItem?.poolInfo?.saleStartTime
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem])

  return (
    <>
      <CarouselDesktop
        items={items}
        setCurPanelIndex={setCurPanelIndex}
        curPanelIndex={curPanelIndex}
        plugins={plugins}
        prev={prev}
        next={next}
        setVideoLoaded={setVideoLoaded}
        isCurVideoPlaying={isCurVideoPlaying}
        pauseVideo={pauseVideo}
        playVideo={playVideo}
        calculatedVideoLayerWidth={calculatedVideoLayerWidth}
        refSlider={refSlider}
        refSlider1={refSlider1}
        currentItem={currentItem}
        countdown={countdown}
        flickingVerticalHeight={flickingVerticalHeight}
      />

      <CarouselMobile
        items={items}
        mobileSliderPlugins={mobileSliderPlugins}
        refSliderMobile={refSliderMobile}
        refSliderMobile1={refSliderMobile1}
        toggleAutoplay={toggleAutoplay}
        currentItem={currentItem}
      />
    </>
  )
}

export default GameCarousel
