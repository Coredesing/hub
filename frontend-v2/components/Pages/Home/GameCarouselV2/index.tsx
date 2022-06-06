import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import Flicking from '@egjs/react-flicking'
import { AutoPlay, Sync } from '@egjs/flicking-plugins'
import arrowLeft from '@/assets/images/icons/arrow-left.png'
import arrowRight from '@/assets/images/icons/arrow-right.png'
import clsx from 'clsx'
import get from 'lodash.get'
import { useAppContext } from '@/context'
import { TIMELINE } from '@/components/Pages/IGO/constants'
import { getTierById } from '@/utils/tiers'
import { dateFromString, isInRange } from '@/utils/pool'
import { intervalToDuration } from 'date-fns'

type Milestone = {
  key: string;
  milestone: string;
  active: boolean;
  start: Date | undefined;
  end: Date | undefined;
  info?: any;
  subMilestones?: Milestone[];
}

type Props = {
  items?: any[];
  likes?: any[];
  listPublic?: any[];
}

type IconProps = {
  className?: string;
  onClick?: () => void;
}

const PauseIcon = ({ onClick }: IconProps) => <svg onClick={onClick} width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="35" cy="35" r="35" fill="white" fillOpacity="0.2"/>
  <circle cx="35" cy="35" r="34.5" stroke="black" strokeOpacity="0.2"/>
  <path d="M30 24H25C24.7348 24 24.4804 24.1054 24.2929 24.2929C24.1054 24.4804 24 24.7348 24 25V45C24 45.2652 24.1054 45.5196 24.2929 45.7071C24.4804 45.8946 24.7348 46 25 46H30C30.2652 46 30.5196 45.8946 30.7071 45.7071C30.8946 45.5196 31 45.2652 31 45V25C31 24.7348 30.8946 24.4804 30.7071 24.2929C30.5196 24.1054 30.2652 24 30 24Z" fill="white"/>
  <path d="M45 24H40C39.7348 24 39.4804 24.1054 39.2929 24.2929C39.1054 24.4804 39 24.7348 39 25V45C39 45.2652 39.1054 45.5196 39.2929 45.7071C39.4804 45.8946 39.7348 46 40 46H45C45.2652 46 45.5196 45.8946 45.7071 45.7071C45.8946 45.5196 46 45.2652 46 45V25C46 24.7348 45.8946 24.4804 45.7071 24.2929C45.5196 24.1054 45.2652 24 45 24Z" fill="white"/>
</svg>

const PlayIcon = ({ onClick }: IconProps) => <svg onClick={onClick} width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="35" cy="35" r="35" fill="white" fillOpacity="0.2"/>
  <circle cx="35" cy="35" r="34.5" stroke="black" strokeOpacity="0.2"/>
  <path d="M30.2333 23.3833C30.0724 23.2626 29.881 23.1891 29.6806 23.171C29.4802 23.153 29.2788 23.1911 29.0989 23.281C28.9189 23.371 28.7676 23.5093 28.6618 23.6805C28.556 23.8516 28.5 24.0488 28.5 24.25V43.75C28.5 43.9512 28.556 44.1484 28.6618 44.3195C28.7676 44.4907 28.9189 44.629 29.0989 44.719C29.2788 44.8089 29.4802 44.847 29.6806 44.829C29.881 44.8109 30.0724 44.7374 30.2333 44.6167L46.2333 34.8667C46.3679 34.7658 46.4771 34.6349 46.5523 34.4845C46.6275 34.3341 46.6667 34.1682 46.6667 34C46.6667 33.8318 46.6275 33.6659 46.5523 33.5155C46.4771 33.3651 46.3679 33.2342 46.2333 33.1333L30.2333 23.3833Z" fill="white"/>
</svg>

const Countdown = ({ curItem, current }) => {
  const [mounted, setMounted] = useState(false)
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')
  const { tierMine } = useAppContext()

  const poolData = useMemo(() => {
    return get(curItem, 'pool')
  }, [curItem])

  const to = useMemo(() => {
    const currentKey = current?.key
    switch (currentKey) {
    case 'pre-whitelist':
      return get(poolData, 'start_join_pool_time')
    case 'whitelist':
      return get(poolData, 'end_join_pool_time')
    case 'winner-announcement':
      return tierMine?.id >= poolData?.pre_order_min_tier ? get(poolData, 'start_pre_order_time') : get(poolData, 'start_time')
    case 'pre-order':
      return get(poolData, 'start_time')
    case 'buying-phase':
      return get(poolData, 'finish_time')
    case 'buying-phase-1':
      return get(poolData, 'freeBuyTimeSetting.start_buy_time')
    case 'buying-phase-2':
      return get(poolData, 'finish_time')
    default:
      return ''
    }
  }, [current?.key, poolData, tierMine?.id])

  useEffect(() => {
    const interval = setInterval(() => {
      const duration = intervalToDuration({
        start: new Date(Number(to) * 1000),
        end: new Date()
      })
      setDays(duration.days < 10 ? `0${duration.days}` : `${duration.days}`)
      setHours(duration.hours < 10 ? `0${duration.hours}` : `${duration.hours}`)
      setMinutes(duration.minutes < 10 ? `0${duration.minutes}` : `${duration.minutes}`)
      setSeconds(duration.seconds < 10 ? `0${duration.seconds}` : `${duration.seconds}`)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [to])

  useEffect(() => setMounted(true), [])
  if (!mounted || !to) return null
  if (current?.key === 'tba') return <div className="font-semibold text-2xl">Coming Soon</div>

  return <div className="text-[28px] text-white leading-[100%] font-bold font-mechanic flex mb-8 bg-black bg-opacity-20 clipped-t-l overflow-hidden">
    <div className='flex px-5 py-3 gap-4'>
      <div className='flex flex-col items-center gap-2 w-fit'>
        <p>{days}</p>
        <p className='uppercase font-semibold text-[10px] leading-[12px]'>days</p>
      </div>
      <p>:</p>
      <div className='flex flex-col items-center gap-2 w-fit'>
        <p>{hours}</p>
        <p className='uppercase font-semibold text-[10px] leading-[12px]'>hours</p>
      </div>
      <p>:</p>
      <div className='flex flex-col items-center gap-2 w-fit'>
        <p>{minutes}</p>
        <p className='uppercase font-semibold text-[10px] leading-[12px]'>minutes</p>
      </div>
      <p>:</p>
      <div className='flex flex-col items-center gap-2 w-fit'>
        <p>{seconds}</p>
        <p className='uppercase font-semibold text-[10px] leading-[12px]'>seconds</p>
      </div>
    </div>
  </div>
}

const GameCarousel = ({ items, likes }: Props) => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [curPanelIndex, setCurPanelIndex] = useState(0)
  const [countForceCheckCurVideoPlaying, setForceCheckCurVideoPlaying] = useState(0)
  const [flickingVerticalHeight, setFlickingVerticalHeight] = useState(0)
  const [calculatedVideoLayerWidth, setCalculatedVideoLayerWidth] = useState(0)
  const [curItem, setCurItem] = useState(items?.[0] || {})
  const [isCurVideoPlaying, setIsCurVideoPlaying] = useState(false)
  const [current, setCurrent] = useState(null)

  const { tierMine, now } = useAppContext()

  const isMobile = useMediaQuery({ maxWidth: '1000px' })
  const getLikeById = (id: any) => {
    return likes && likes.find(item => item.game_id === id)
  }
  const forceCheck = () => setForceCheckCurVideoPlaying(countForceCheckCurVideoPlaying + 1)

  const refSlider = useRef(null)
  const refSlider1 = useRef(null)

  const [plugins, setPlugins] = useState([])

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
          activeClass: isMobile ? 'thumbnail-bullet-active' : ''
        }
      ]
    })])

    refSlider.current.change = (e) => setCurPanelIndex(e.index)
    refSlider1.current.change = (e) => setCurPanelIndex(e.index)
  }, [isMobile])

  const toggleAutoplay = useCallback((status) => {
    if (status) {
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
      return
    }

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
    })])
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
    setCurItem(items[curPanelIndex] || {})
  }, [curPanelIndex, items])

  const [hasFCFS, preOrderMinTier] = useMemo(() => {
    const poolData = get(curItem, 'pool')
    const _hasFCFS = poolData?.freeBuyTimeSetting?.start_buy_time
    const _preOrderMinTier = getTierById(poolData?.pre_order_min_tier)

    return [_hasFCFS, _preOrderMinTier]
  }, [curItem])

  const timeline = useMemo<Milestone[]>(() => {
    const poolData = get(curItem, 'pool')
    return [
      {
        key: 'tba',
        milestone: 'Upcoming - TBA',
        active: false,
        start: undefined,
        end: undefined,
        info: {
          countdownTitle: 'TBA'
        }
      },
      {
        key: 'pre-whitelist',
        milestone: 'Upcoming - Whitelist',
        active: false,
        start: undefined,
        end: poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined,
        info: {
          countdownTitle: 'Whitelist Starts In'
        }
      },
      {
        key: 'whitelist',
        milestone: 'Apply Whitelist',
        active: true,
        start: poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined,
        end: poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined,
        info: {
          countdownTitle: 'Whitelist Ends In'
        }
      },
      {
        key: 'winner-announcement',
        milestone: 'Winner Announcement',
        active: true,
        start: poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined,
        end: tierMine?.id >= poolData?.pre_order_min_tier
          ? (poolData?.start_pre_order_time ? new Date(Number(poolData?.start_pre_order_time) * 1000) : undefined)
          : (poolData?.start_time ? new Date(Number(poolData?.start_time) * 1000) : undefined),
        info: {
          countdownTitle: tierMine?.id >= poolData?.pre_order_min_tier ? 'Pre-order starts in' : (hasFCFS ? 'Phase 1 Starts In' : 'Buying Phase Starts In')
        }
      },
      {
        key: 'pre-order',
        milestone: 'Pre-order',
        active: !!poolData?.start_pre_order_time,
        start: poolData?.start_pre_order_time ? new Date(Number(poolData?.start_pre_order_time) * 1000) : undefined,
        end: poolData?.start_time ? new Date(Number(poolData?.start_time) * 1000) : undefined,
        info: {
          minTier: preOrderMinTier,
          countdownTitle: hasFCFS ? 'Phase 1 Starts In' : 'Buying Phase Starts In'
        }
      },
      {
        key: 'buying-phase',
        milestone: 'Buying Phase',
        active: true,
        start: poolData?.start_time ? new Date(Number(poolData?.start_time) * 1000) : undefined,
        end: poolData?.finish_time ? new Date(Number(poolData?.finish_time) * 1000) : undefined,
        info: {
          countdownTitle: 'Buying Phase Ends In'
        },
        subMilestones: hasFCFS
          ? [
            {
              key: 'buying-phase-1',
              milestone: 'Phase 1 - Guaranteed',
              active: true,
              start: poolData?.start_time ? new Date(Number(poolData?.start_time) * 1000) : undefined,
              end: poolData?.freeBuyTimeSetting?.start_buy_time ? new Date(Number(poolData?.freeBuyTimeSetting?.start_buy_time) * 1000) : undefined,
              info: {
                countdownTitle: 'Phase 2 Starts In'
              }
            },
            {
              key: 'buying-phase-2',
              milestone: 'Phase 2 - FCFS',
              active: true,
              start: poolData?.freeBuyTimeSetting?.start_buy_time ? new Date(Number(poolData?.freeBuyTimeSetting?.start_buy_time) * 1000) : undefined,
              end: poolData?.finish_time ? new Date(Number(poolData?.finish_time) * 1000) : undefined,
              info: {
                countdownTitle: 'Phase 2 Ends In'
              }
            }
          ]
          : []
      },
      {
        key: 'claim',
        milestone: 'Claim',
        active: !!poolData?.start_pre_order_time,
        start: poolData?.start_pre_order_time ? new Date(Number(poolData?.start_pre_order_time) * 1000) : undefined,
        end: poolData?.start_time ? new Date(Number(poolData?.start_time) * 1000) : undefined,
        info: {
          countdownTitle: 'Next Claim In'
        }
      }
    ]
  }, [curItem, hasFCFS, preOrderMinTier, tierMine?.id])

  useEffect(() => {
    const poolData = get(curItem, 'pool')
    if (!poolData) return setCurrent(null)
    if (!poolData.start_join_pool_time && poolData.campaign_status?.toLowerCase() === 'tba') {
      return setCurrent(timeline[TIMELINE.TBA])
    }

    if (now?.getTime() < dateFromString(poolData.start_join_pool_time)?.getTime()) {
      return setCurrent(timeline[TIMELINE.PRE_WHITELIST])
    }

    if (isInRange(poolData?.start_join_pool_time, poolData?.end_join_pool_time, now)) {
      return setCurrent(timeline[TIMELINE.WHITELIST])
    }

    if (poolData.start_pre_order_time && tierMine?.id >= poolData.pre_order_min_tier && isInRange(poolData?.end_join_pool_time, poolData?.start_pre_order_time, now)) {
      return setCurrent(timeline[TIMELINE.WINNER_ANNOUNCEMENT])
    }

    if ((!poolData.start_pre_order_time || tierMine?.id < poolData.pre_order_min_tier) &&
      isInRange(poolData.end_join_pool_time, poolData.start_time, now)) {
      return setCurrent(timeline[TIMELINE.WINNER_ANNOUNCEMENT])
    }

    if (poolData.start_pre_order_time &&
      tierMine?.id >= poolData?.pre_order_min_tier &&
      isInRange(poolData?.start_pre_order_time, poolData?.start_time, now)) {
      return setCurrent(timeline[TIMELINE.PRE_ORDER])
    }

    if (!hasFCFS &&
      isInRange(poolData?.start_time, poolData?.finish_time, now)) {
      return setCurrent(timeline[TIMELINE.BUYING_PHASE])
    }

    if (hasFCFS &&
      isInRange(poolData?.start_time, poolData?.freeBuyTimeSetting?.start_buy_time, now)) {
      return setCurrent(timeline[TIMELINE.BUYING_PHASE].subMilestones[0])
    }

    if (hasFCFS &&
      isInRange(poolData?.freeBuyTimeSetting?.start_buy_time, poolData?.finish_time, now)) {
      return setCurrent(timeline[TIMELINE.BUYING_PHASE].subMilestones[1])
    }

    if (now?.getTime() > dateFromString(poolData.finish_time)?.getTime()) {
      return setCurrent(timeline.find(item => item.key === 'claim'))
    }
  }, [curItem, hasFCFS, now, tierMine?.id, timeline])

  return (
    !isMobile
      ? <div>
        <div id='flicking1wrapper' className="flex max-w-[1180px] mx-auto items-center gap-4 relative">
          <div className="hidden sm:block">
            <img src={arrowLeft.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={prev}/>
          </div>
          <Flicking onChanged={e => setCurPanelIndex(e.index)} defaultIndex={curPanelIndex} plugins={plugins} circular={true} className="flex-1" align="center" ref={refSlider} interruptable={true}>
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
                    poster={item.screen_shots_1}
                    onEnded={next}
                    onLoadedData={() => setVideoLoaded(true)}
                  >
                    <source src={item.intro_video} type="video/mp4"></source>
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ))}
          </Flicking>
          <div className="hidden sm:block">
            <img src={arrowRight.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={next}/>
          </div>

          <div className={clsx('group overflow-hidden absolute top-0 left-12 -right-14 bottom-0 h-full z-10 w-fit')} style={{ width: `${calculatedVideoLayerWidth}px` }}>
            <div className='relative w-full h-full justify-between flex'>
              <div className="absolute z-10 top-0 left-0 uppercase font-medium tracking-widest text-xs xl:text-sm text-left bg-[#15171E] md:w-[169px] md:pb-1 lg:pb-2 clipped-b-r-full inline-block">
                <span className="text-gamefiGreen-500">Featured</span> games
              </div>
              <div className={clsx(!isCurVideoPlaying ? 'w-2/5' : 'w-1/5', 'group-hover:w-2/5 h-ful bg-gradient-to-r from-[#15171e]')}></div>
              <div className={clsx(!isCurVideoPlaying ? 'w-2/5' : 'w-1/5', 'group-hover:w-2/5 bg-gradient-to-l from-[#15171e] h-full')}></div>
              <div className={clsx(!isCurVideoPlaying ? 'opacity-100' : 'opacity-0', 'absolute cursor-pointer w-[70px] h-[70px] top-0 left-0 right-0 bottom-0 mx-auto my-auto z-30 group-hover:opacity-100 transition-all duration-300')}>
                {
                  isCurVideoPlaying ? <PauseIcon onClick={() => pauseVideo(curPanelIndex, false)} /> : <PlayIcon onClick={() => playVideo(curPanelIndex)}/>
                }
              </div>

              <div id='flicking2wrapper' className={clsx(!isCurVideoPlaying ? 'right-6 opacity-100' : '-right-24 opacity-0', 'absolute top-6 w-32 z-20 group-hover:right-6 group-hover:opacity-100 transition-all duration-300 ease-in-out')} style={{ height: `${flickingVerticalHeight}px` }}>
                <Flicking onChanged={e => setCurPanelIndex(e.index)} className="h-full" horizontal={false} ref={refSlider1} defaultIndex={curPanelIndex} bound={true} bounce={30} moveType="freeScroll">
                  {items.map((item, i) => <div key={`caurouse-paginate-${item.id}`} className={clsx('my-1 cursor-pointer rounded-sm overflow-hidden relative border border-transparent hover:border-gamefiGreen-700', curPanelIndex === i ? 'border border-gamefiGreen-700' : '')}>
                    <img className="h-20 w-36 object-cover thumbnail-bullet-active" src={item?.screen_shots_1} alt=""></img>

                    {
                      curPanelIndex === i && <div className='w-8 h-1 clipped-t-r-lg bg-gamefiGreen-700 absolute bottom-0 left-0'></div>
                    }
                  </div>)}
                </Flicking>
              </div>

              <div className="absolute md:bottom-8 lg:bottom-14 2xl:bottom-32 left-8 z-30">
                <div className="flex align-middle items-center w-full mb-5">
                  { <div className="flex align-middle items-center text-sm">
                    <Image src={require('@/assets/images/icons/heart.svg')} alt="heart"/>
                    <p className="ml-[10px] tracking-widest text-base text-white leading-[150%]">{getLikeById(get(curItem, 'id'))?.total_like || 0}</p>
                  </div> }
                  {
                    get(curItem, 'develop') && <div className="flex align-middle items-center ml-[30px] text-left">
                      <Image src={require('@/assets/images/icons/game-console.svg')} alt="game-console"/>
                      <p
                        className="ml-[10px] tracking-[0.16] uppercase text-white text-base whitespace-nowrap overflow-hidden overflow-ellipsis text-left  leading-[150%]"
                        style={{ maxWidth: '180px' }}
                      >{get(curItem, 'develop')}</p>
                    </div>
                  }
                </div>
                <div className="text-[40px] font-bold uppercase text-left mb-8  leading-[100%]">{get(curItem, 'game_name')}</div>
                { curItem.pool && <div className='uppercase mt-8 font-bold text-[13px] tracking-[0.04em] leading-[150%] mb-1'>{get(current, 'info.countdownTitle') || ''}</div> }
                {
                  curItem.pool && <Countdown curItem={curItem} current={current}/>
                }
                <div>
                  <Link href={curItem.pool ? `/igo/${get(curItem, 'pool.id')}` : `/hub/${get(curItem, 'slug')}`} passHref>
                    <div className="bg-gamefiGreen text-gamefiDark-900 py-2 px-6 rounded-xs clipped-t-r hover:opacity-90 w-36 cursor-pointer">
                      <a className="flex align-middle items-center">
                        <div className="mr-2 uppercase font-bold text-[13px]">{curItem.pool ? 'Join now' : 'View more'}</div>
                        <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" />
                      </a>
                    </div>
                  </Link>
                </div>
              </div>

              <div className='absolute bottom-0 right-4 z-10'>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 0V13H0L13 0Z" fill="#6CDB00"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      : <div>
        {/* TODO: Deep dive into debug to fix Did not expect server HTML to contain a <div> in <div>. */}
        <div></div>
        <div className="flex w-full h-full items-center gap-4">
          <Flicking circular={true} plugins={plugins} className="w-full h-full flex" align="center" ref={refSlider} interruptable={true}>
            {items.map(item => (
              <div key={`mobile-game-${item.id}`} className="w-full">
                <div className="w-full">
                  <div className="absolute z-20 top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-center md:text-left bg-gamefiDark-900 w-1/2 md:pb-1 lg:pb-2 clipped-b-r-full inline-block"><span className="text-gamefiGreen-500">Featured</span> games</div>
                  <video
                    id={`video-${item.id}`}
                    key={`video-${item.id}`}
                    className='clipped-t-r-lg'
                    style={{ aspectRatio: '16/9', objectFit: 'fill' }}
                    muted
                    controls
                    preload="auto"
                    controlsList="nodownload"
                    poster={item.screen_shots_1}
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
                        className="ml-2 tracking-widest uppercase text-gray-200 whitespace-nowrap max-w-[200px] overflow-hidden overflow-ellipsis"
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
            <div className="h-20 w-36 relative">
              <Image className="object-cover" src={item?.screen_shots_1} alt="" layout="fill"></Image>
            </div>
          </div>)}
        </Flicking>
      </div>
  )
}

export default GameCarousel
