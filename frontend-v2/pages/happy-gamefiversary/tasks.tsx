import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// layout
import Head from 'next/head'
import Sidebar from '@/components/Base/Sidebar'
import Topbar from '@/components/Base/Topbar'
import Toolbox from '@/components/Base/Toolbox'
import { defaultDescription, defaultTitle } from '@/utils/constants'
import Image from 'next/image'

// fonts
import fonts from '@/components/Pages/Adventure/index.module.scss'

// image
import welcome from '@/components/Pages/Adventure/images/welcome.png'
import catStart from '@/components/Pages/Adventure/images/cat-start.png'
import catStepByStep from '@/components/Pages/Adventure/images/cat-step-by-step.png'
import textMultiverse from '@/components/Pages/Adventure/images/text-multiverse.png'
import textMultiverseMobile from '@/components/Pages/Adventure/images/text-multiverse-mobile.png'
import leaderboard from '@/components/Pages/Adventure/images/leaderboard.svg'
import currentFish from '@/components/Pages/Adventure/images/current-fish.svg'
import add from '@/components/Pages/Adventure/images/add.svg'
import left from '@/components/Pages/Adventure/images/left.svg'
import right from '@/components/Pages/Adventure/images/right.svg'
import smile from '@/components/Pages/Adventure/images/smile.svg'
import angry from '@/components/Pages/Adventure/images/angry.svg'
import { GameFiPass } from '@/components/Pages/Adventure/Tasks'
import circleArrow from '@/components/Pages/Adventure/images/circle-arrow.svg'
import playNow from '@/components/Pages/Adventure/images/play-now.svg'
import mew from '@/components/Pages/Adventure/images/mew-world.png'
import bgMew from '@/components/Pages/Adventure/images/bg-mew-world.png'
import present from '@/components/Pages/Adventure/images/present.svg'

import get from 'lodash.get'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import Flicking, { ViewportSlot, Plugin } from '@egjs/react-flicking'
import { Sync } from '@egjs/flicking-plugins'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/react-flicking/dist/flicking.css'
import { fetcher, printNumber } from '@/utils'
import HubProvider from '@/context/hubProvider'
import { useMyWeb3 } from '@/components/web3/context'
import Modal from '@/components/Base/Modal'

// eslint-disable-next-line no-unused-expressions
fonts

const imagesProjects = {
  'dark-country': {
    imageVertical: require('@/assets/images/adventure/dark-country.png'),
    imageMobile: require('@/assets/images/adventure/dark-country.png')
  },
  metashooter: {
    imageVertical: require('@/assets/images/adventure/meta-shooter.png'),
    imageMobile: require('@/assets/images/adventure/meta-shooter.png')
  },
  gamefi: {
    imageVertical: '',
    imageMobile: ''
  },
  'titan-hunters': {
    imageVertical: require('@/assets/images/adventure/titan-hunters.png'),
    imageMobile: require('@/assets/images/adventure/titan-hunters.png')
  },
  kucoin: {
    // imageVertical: require('@/assets/images/adventure/kucoin.png'),
    // imageMobile: require('@/assets/images/adventure/kucoin.png')
  },
  dvision: {
    imageVertical: require('@/assets/images/adventure/dvision.png'),
    imageMobile: require('@/assets/images/adventure/dvision.png')
  },
  'moon-strike': {
    imageVertical: require('@/assets/images/adventure/moon-strike.png'),
    imageMobile: require('@/assets/images/adventure/moon-strike.png')
  },
  isekaiverse: {
    imageVertical: require('@/assets/images/adventure/isekai-verse.png'),
    imageMobile: ''
  },
  'engine-of-furry': {
    imageVertical: '',
    imageMobile: ''
  },
  monsterra: {
    imageVertical: require('@/assets/images/adventure/monsterra.png'),
    imageMobile: require('@/assets/images/adventure/monsterra.png')
  },
  codyfight: {
    imageVertical: require('@/assets/images/adventure/codyfight.png'),
    imageMobile: require('@/assets/images/adventure/codyfight.png')
  },
  'the-unfettered': {
    imageVertical: require('@/assets/images/adventure/unfettered.png'),
    imageMobile: require('@/assets/images/adventure/unfettered.png')
  },
  desports: {
    imageVertical: require('@/assets/images/adventure/desport.png'),
    imageMobile: require('@/assets/images/adventure/desport.png')
  },
  ninneko: {
    imageVertical: require('@/assets/images/adventure/ninneko.png'),
    imageMobile: require('@/assets/images/adventure/ninneko.png')
  },
  aradena: {
    imageVertical: require('@/assets/images/adventure/aradena.png'),
    imageMobile: require('@/assets/images/adventure/aradena.png')
  },
  'heroes-land': {
    imageVertical: require('@/assets/images/adventure/heroes-land.png'),
    imageMobile: require('@/assets/images/adventure/heroes-land.png')
  },
  metacity: {
    imageVertical: require('@/assets/images/adventure/metacity.png'),
    imageMobile: require('@/assets/images/adventure/metacity.png')
  },
  iguverse: {
    imageVertical: require('@/assets/images/adventure/iguverse.png'),
    imageMobile: require('@/assets/images/adventure/iguverse.png')
  },
  'dinox-world': {
    imageVertical: require('@/assets/images/adventure/dinox.png'),
    imageMobile: require('@/assets/images/adventure/dinox.png')
  },
  evermoon: {
    imageVertical: require('@/assets/images/adventure/evermoon.png'),
    imageMobile: require('@/assets/images/adventure/evermoon.png')
  },
  pikaster: {
    imageVertical: require('@/assets/images/adventure/pikaster.png'),
    imageMobile: require('@/assets/images/adventure/pikaster.png')
  },
  'moverse-run': {
    imageVertical: require('@/assets/images/adventure/moverse.png'),
    imageMobile: require('@/assets/images/adventure/moverse.png')
  },
  'aether-games': {
    imageVertical: require('@/assets/images/adventure/aether-games.png'),
    imageMobile: require('@/assets/images/adventure/aether-games.png')
  },
  'planet-sandbox': {
    imageVertical: require('@/assets/images/adventure/psb.png'),
    imageMobile: require('@/assets/images/adventure/psb.png')
  },
  'monster-era': {
    imageVertical: require('@/assets/images/adventure/monster-era.png'),
    imageMobile: require('@/assets/images/adventure/monster-era.png')
  },
  'summoners-arena': {
    imageVertical: require('@/assets/images/adventure/summoners-arena.png'),
    imageMobile: require('@/assets/images/adventure/summoners-arena.png')
  },
  'thunder-lands': {
    imageVertical: '',
    imageMobile: ''
  },
  'planet-mojo': {
    imageVertical: require('@/assets/images/adventure/planet-mojo.png'),
    imageMobile: require('@/assets/images/adventure/planet-mojo.png')
  },
  'rise-of-immortals': {
    imageVertical: require('@/assets/images/adventure/rise-of-immortals.png'),
    imageMobile: require('@/assets/images/adventure/rise-of-immortals.png')
  },
  'goons-of-balatroon': {
    imageVertical: require('@/assets/images/adventure/goons-of-balatroon.png'),
    imageMobile: require('@/assets/images/adventure/goons-of-balatroon.png')
  },
  'epic-war': {
    imageVertical: require('@/assets/images/adventure/epic-war.png'),
    imageMobile: require('@/assets/images/adventure/epic-war.png')
  },
  befitter: {
    imageVertical: require('@/assets/images/adventure/befitter.png'),
    imageMobile: require('@/assets/images/adventure/befitter.png')
  }
}

const theme = 'dark'

const Content = () => {
  const [loadingSocial, setLoadingSocial] = useState(true)
  const [connectedAllSocial, setConnectedAllSocial] = useState(false)
  const [listSocial, setListSocial] = useState([])
  const { account } = useMyWeb3()
  const [gafish, setGafish] = useState(0)
  const [referrerLink, setReferrerLink] = useState('')
  const [joinedTeam, setJoinedTeam] = useState(null)

  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [topWorld, setTopWorld] = useState(0)
  const [middleWorld, setMiddleWorld] = useState(0)
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [showModalJoinTeam, setShowModalJoinTeam] = useState(false)

  const flickingGame = useRef()
  const flickingListGame = useRef()

  const flickingMiddle = useRef()
  const flickingListMiddle = useRef()

  useEffect(() => {
    if (account) {
      fetcher('/api/account/ranks/getUserRankAndQuests', {
        method: 'POST',
        body: JSON.stringify({ walletId: account })
      })
        .then((res) => {
          setLoadingSocial(false)
          const LIST_SOCIAL_REQUIRED = [
            { name: 'Twitter' },
            { name: 'Telegram' }
          ]
          const quests = get(res, 'data.groupQuests[0].quests', []).filter(v => LIST_SOCIAL_REQUIRED.some(c => v.name?.includes(c.name)))
          setListSocial(quests)
        })
        .catch(() => setLoadingSocial(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    if (!account) return

    fetcher(`/api/adventure/${account}/points`).then(res => {
      if (res?.currentPoint) {
        setGafish(res.currentPoint)
      }
    }).catch(e => console.debug(e))
  }, [account])

  useEffect(() => {
    if (!account) return

    fetcher(`/api/adventure/${account}/team`).then(res => {
      if (res?.data?.team) {
        setJoinedTeam(res?.data?.team)
      }
    }).catch(e => console.debug(e))
  }, [account])

  useEffect(() => {
    setLoading(true)
    if (account) {
      fetcher(`/api/adventure/project/${account}`).then(data => {
        if (data) {
          setProjects(data)
          setLoading(true)
        }
      }).catch(e => {
        toast.error('Failed to fetch data, please try again!')
      })
    }
  }, [account])

  const listProjectTop = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find(el => el?.name === 'TOP_WORLD')?.projects
  }, [projects])

  const listProjectMiddle = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find(el => el?.name === 'MIDDLE_WORLD')?.projects
  }, [projects])

  const listTaskGamefi = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find(el => el?.name === 'GAMEFI_WORLD')?.projects?.[0]?.tasks
  }, [projects])

  useEffect(() => {
    if (!projects?.length || !projects) return
    setTimeout(() => {
      setPlugins([
        new Sync({
          type: 'index',
          synchronizedFlickingOptions: [{
            flicking: flickingGame.current,
            isSlidable: true
          }, {
            flicking: flickingListGame.current,
            isClickable: true
          }]
        })
      ])
    }, 1000)
  }, [projects])

  const title = ''
  const description = ''

  const handleJoinTeam = useCallback(() => {
    if (!referrerLink) return
    const regex = /^https:\/\/gamefi\.org\/adventure\/join\?team=([a-zA-Z0-9-]*)$/

    if (!regex.test(referrerLink)) return

    const matches = referrerLink.match(regex)
    const slug = matches?.length > 0 && matches[1]
    console.log(slug)

    const toasting = toast.loading('Processing')
    fetcher(`/api/adventure/project/${account}?slug=${slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res)
      if (!res || !res.user_id) {
        toast.error(res?.message)
        return
      }
      toast.success('Join team successfully')
    }).catch(e => {
      toast.error(e?.message)
    }).finally(() => {
      setShowModalJoinTeam(false)
      toast.dismiss(toasting)
    })
  }, [account, referrerLink])

  return <div className={`flex w-full h-screen ${theme}`}>
    <div className="dark:bg-gamefiDark-900 dark:text-white w-full flex flex-col md:flex-row">
      <Head>
        <title>{title || defaultTitle}</title>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={title || defaultTitle} key="title" />
        <meta property="og:description" content={description || defaultDescription} key="description" />
        <meta property="og:image" content={'https://gamefi.org/gamefi.jpg?v=1655805418132'} key="image" />
        <meta name="keywords" content="launchpad, game hub, nft marketplace, game portal, game pass, game guild, tournament, metaverse, ido"></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || defaultTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
        <meta name="twitter:image" content={'https://gamefi.org/gamefi.jpg?v=1655805418132'} />
      </Head>
      <div><Sidebar></Sidebar></div>
      <div id='layoutBody' className='bg-[#15171E] w-full h-full overflow-auto relative scroll-smooth'>
        <Topbar absolute={true}></Topbar>
        <div className={clsx('flex min-h-screen h-full mx-auto', account ? 'hidden' : 'block')}>
          <section className='flex-1 max-w-[1920px] mx-auto mt-32 mb-14 md:mt-60 md:mb-0 lg:mt-52 xl:mt-40 2xl:mt-24'>
            <div className='h-full mx-auto flex flex-col items-center md:container relative'>
              <div className="flex items-center justify-center">
                <img src={welcome.src} alt="" className="px-5 md:px-0" />
              </div>
              <div className="text-gamefiGreen font-casual font-medium mt-4">Coming soon!</div>
              <a href="https://www.youtube.com/watch?v=X4XWR6lZ63I" target="_blank" rel="noreferrer" className="relative mt-16" onClick={() => {}}>
                <div className="w-24 h-24"><Image src={require('@/assets/images/adventure/play.png')} alt=""></Image></div>
                {/* <div className="" style={{ transformOrigin: 'center' }}>GameFi.org aniversary - join multiversee adventure - </div> */}
              </a>
              <div className="flex items-center justify-center">
                <img src={catStart.src} alt="" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full md:w-1/2 max-w-[722px]" />
              </div>
            </div>
          </section>
        </div>
        <Modal show={showModalJoinTeam} toggle={setShowModalJoinTeam} className={'bg-slate-800'}>
          <div className='p-9' style={{ background: 'rgb(31 31 35)' }}>
            <div className="text-xl font-bold uppercase">Join A Team</div>
            <div className="mt-8 font-casual text-sm">
              <div>This step cannot be reversed, you are only allowed to join one team. Do you want to join the team {}?</div>
            </div>
            <div className="mt-8 flex gap-2 justify-end">
              <button
                className="bg-gamefiGreen-700 rounded-sm clipped-b-l w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                onClick={() => { handleJoinTeam() }}
              >Yes, I do</button>
              <button
                className="bg-gamefiDark-300 rounded-sm clipped-t-r w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                onClick={() => { setShowModalJoinTeam(false) }}
              >Cancel</button>
            </div>
          </div>
        </Modal>

        {
          account && <div className={`mx-auto pb-20 relative z-0 ${connectedAllSocial ? 'mb-28' : 'h-screen overflow-hidden'}`}>
            <div className={`${connectedAllSocial ? 'top-20' : 'top-48'} absolute left-0 right-0 z-[-1] mx-auto clipped-down h-full w-full pt-4`} style={{ background: 'linear-gradient(90.03deg, #52FF00 0%, #15171E 25vw, #15171E 75vw, #52FF00 99.44%)' }}>
              <div className="clipped-down h-full w-full" style={{ background: 'linear-gradient(180deg, #1D1F28 31.35%, #0F1116 104.36%)' }}></div>
            </div>
            <section className='mx-auto mb-14 md:mb-0 mt-20 xl:mt-40 2xl:mt-24'>
              <div className='md:container mx-auto md:mb-[90px] lg:mt-[120px] px-6'>
                <GameFiPass listSocial={listSocial} loadingSocial={loadingSocial} setConnectedAllSocial={setConnectedAllSocial} />
              </div>
            </section>

            <section className={`max-w-[1920px] mx-auto px-2 sm:px-5 relative ${!connectedAllSocial && 'h-[calc(100vh-27rem)] md:h-[calc(100vh-34rem)] xl:h-[calc(100vh-30rem)] 2xl:h-[calc(100vh-28rem)]'}`}>
              {
                !connectedAllSocial && <div className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-10 bg-[#1D2029]/80">
                  <div className="text-center font-medium font-casual">Hey! Before you can play with me;<br></br>Please sync your Twitter and Telegram first!</div>
                  <div className="absolute bottom-[56px] md:bottom-0 right-0 left-0 w-1/2 sm:max-w-[224px] 2xl:max-w-[324px] mx-auto hide-on-small-device">
                    <Image src={require('@/assets/images/adventure/gafi-cat.png')} alt=""></Image>
                  </div>
                </div>
              }
              <div className={`md:container mx-auto overflow-hidden ${!connectedAllSocial && 'blur-sm'}`}>
                <p className='text-center uppercase font-bold font-mechanic text-lg tracking-[0.2em] text-white/50 bg-transparent p-2'>Gamefiversary</p>
                <div className='flex justify-center'>
                  <img src={textMultiverse.src} alt="" />
                </div>
                <div className='flex justify-center'>
                  <p className='p-4 font-casual font-medium text-[11px] sm:text-sm'>Finish all <img src={smile.src} alt="" className='inline' /> <span className='text-[#70C81B]'>Easy Tasks</span> to get bonus Gafish</p>
                </div>
                {
                  <div className='flex flex-col items-center pt-5 pb-10 md:pt-10 md:pb-20 md:flex-row md:items-center gap-7 md:gap-0'>
                    {joinedTeam
                      ? <div className="font-casual text-gamefiGreen">You have joined team {joinedTeam.name}</div>
                      : <div className="w-full md:w-1/3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter referral link here"
                          value={referrerLink}
                          onChange={(e) => { setReferrerLink(e?.target?.value) }}
                          className='w-full px-4 h-14 justify-between bg-[#22252F] rounded border-[1px] border-[#303342] focus:border-none focus:ring-0'
                        >
                        </input>
                        <button
                          className={`w-32 flex items-center justify-start font-bold text-sm tracking-[0.02em] uppercase ${referrerLink ? 'text-gamefiGreen-700' : 'text-gamefiDark-200 cursor-not-allowed'}`}
                          onClick={() => { referrerLink && setShowModalJoinTeam(true) }}
                        >Join a team</button>
                      </div>}
                    {/* <div className='flex items-center md:ml-auto'>
                  <img src={leaderboard.src} alt="" />
                  <span className='ml-2 font-casual text-[#FFD600] text-sm border-b-[1px] border-[#FFD600]'>Event Leaderboard</span>
                </div> */}
                    <div className='w-full md:w-1/5 md:ml-auto px-4 h-14 flex items-center bg-[#FFA800]/5 rounded border-[1px] border-[#FFD600]/40'>
                      <img src={currentFish.src} alt="" />
                      <div className='ml-5'>
                        <p className='font-mechanic font-bold text-white/50 uppercase text-sm'>Current gafish</p>
                        <p className='font-casual font-medium text-sm mt-auto'>{printNumber(gafish)}</p>
                      </div>
                      {/* <img src={add.src} alt="" className='ml-auto cursor-pointer' /> */}
                    </div>
                  </div>
                }

                {/* top world */}
                {
                  listProjectTop?.length !== 0 && <section>
                    <div className='flex justify-center gap-3 sm:gap-6'>
                      <img src={left.src} alt="" />
                      <span className='uppercase font-bold min-w-fit sm:text-2xl'>Top world</span>
                      <img src={right.src} alt="" />
                    </div>
                    <div className="hidden w-full lg:flex justify-center mb-12 mx-auto"><Image src={require('@/assets/images/adventure/meowo.png')} alt=""></Image></div>
                    <div className="lg:hidden w-full flex justify-center mb-12 mx-auto"><Image src={require('@/assets/images/adventure/meowo-mobile.png')} alt=""></Image></div>
                    <div className='my-3'>
                      {/* <img src={circleArrow.src} alt="" /> */}
                      <Flicking
                        defaultIndex={topWorld}
                        ref={flickingListGame}
                        bound={true}
                        preventClickOnDrag={false}
                      >
                        {listProjectTop.map((el, i) => (
                          <div key={`top-world-${i}`} className="w-1/3 md:w-1/6 pr-2">
                            <div className={clsx('p-[2px] border-2 border-transparent rounded-xl cursor-pointer', i === topWorld && 'border-gamefiGreen-500')}>
                              <div className='w-full rounded-xl overflow-hidden aspect-[158/213]'>
                                {imagesProjects[`${el?.slug}`]?.imageVertical && <img src={imagesProjects[`${el?.slug}`]?.imageVertical?.default?.src} alt="" className='w-full h-full object-cover' />}
                              </div>
                            </div>
                            <div className='mx-auto mt-3 justify-center w-2 h-2 rounded-full bg-gradient-to-t from-[#C9DB00] to-[#6CDB00]' />
                          </div>
                        ))}
                      </Flicking>
                      {/* <img src={circleArrow.src} alt="" /> */}
                    </div>
                    <Flicking
                      defaultIndex={topWorld}
                      ref={flickingGame}
                      plugins={plugins}
                      preventClickOnDrag={false}
                      onWillChange={(e) => {
                        setTopWorld(e.index)
                      }}
                    >
                      {listProjectTop.map((el, i) => <div key={`top-world-info-${i}`} className='flex md:h-96 flex-col md:flex-row w-full rounded md:overflow-hidden'>
                        <img src={imagesProjects[`${el?.slug}`]?.imageVertical?.default?.src} className='aspect-[158/213] object-fill hidden md:block' alt="" />
                        <img src={imagesProjects[`${el?.slug}`]?.imageMobile?.default?.src} className='aspect-[2/1] object-cover md:hidden' alt="" />
                        <div className='flex flex-col h-[600px] md:h-auto md:flex-1 bg-[#1B1D26] relative'>
                          <div className='flex flex-col md:flex-row md:items-center w-full p-6 pt-8'>
                            <p className='font-bold text-xl p-2 md:p-0'>{el?.name}</p>
                            <p className='font-casual text-sm text-white/40 md:ml-auto p-2 md:p-0'>Account Type: {el?.accountType}</p>
                          </div>
                          <div className='flex-1 flex flex-col overflow-y-scroll md:mr-2 gap-2'>
                            {el?.tasks?.length > 0 && el?.tasks.map((task, iTask) => <div key={`task-${iTask}`} className='gap-1 md:gap-0 mr-2 ml-4'>
                              <div className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                                <div className='w-full md:w-1/12 lg:w-1/6'>
                                  <span className='font-casual font-medium text-sm'>{task?.name}</span>
                                </div>
                                <div className='flex-1'>
                                  <div className='flex items-center pb-5 gap-4'>
                                    <img src={smile.src} alt="" />
                                    <div className='w-1/3 sm:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm'>
                                      <div className={clsx('h-[6px] bg-white rounded-sm', task?.stages[0]?.isCompleted && 'w-full', task?.currentRepetition === 0 ? 'w-0' : `w-${task?.currentRepetition}/${task?.stages[0]?.repetition}`)} />
                                    </div>
                                    <span className='font-casual text-xs text-white/40'>{task.stages[0]?.isCompleted ? task?.stages[0]?.repetition : task.currentRepetition}/{task.stages[0]?.repetition}</span>
                                    <div className='ml-auto flex font-casual font-medium text-[#FFD600] gap-2'>
                                      <span>+{task.stages[0]?.reward}</span>
                                      <img src={currentFish.src} alt="" className='w-4 h-4' />
                                    </div>
                                  </div>
                                  {task.stages[1] && <><div className='h-[1px] bg-gradient-to-r from-[#303342]/0 to-[#2A2D3D]' />
                                    <div className='flex items-center pt-5 gap-4'>
                                      <img src={angry.src} alt="" />
                                      <div className='w-1/3 sm:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm'>
                                        <div className={clsx('h-[6px] bg-white rounded-sm', task.stages[1]?.isCompleted && 'w-full', task.currentRepetition === 0 ? 'w-0' : `w-${task.currentRepetition}/${task.stages[1]?.repetition}`)} />
                                      </div>
                                      <span className='font-casual text-xs text-white/40'>{task.stages[1]?.isCompleted ? task?.stages[1]?.repetition : task?.currentRepetition}/{task?.stages[1]?.repetition}</span>
                                      <div className='ml-auto flex font-casual font-medium text-[#FFD600] gap-2'>
                                        <span>+{task?.stages[1]?.reward}</span>
                                        <img src={currentFish.src} alt="" className='w-4 h-4' />
                                      </div>
                                    </div></>}
                                </div>
                              </div>
                            </div>)}
                            <div className='gap-1 md:gap-0 mr-2 ml-4'>
                              <div className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                                <div className='w-full'>
                                  <span className='font-casual font-medium text-sm'>Like on GameHub</span>
                                </div>
                              </div>
                            </div>
                            <div className='gap-1 md:gap-0 mr-2 ml-4'>
                              <div className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                                <div className='w-full'>
                                  <span className='font-casual font-medium text-sm'>Review on GameHub</span>
                                </div>
                              </div>
                            </div>
                            <div className='gap-1 md:gap-0 mr-2 ml-4'>
                              <div className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                                <div className='h-10 w-full md:w-1/6 lg:w-1/4' />
                              </div>
                            </div>
                            {/* <div className='w-full h-11 md:h-24'></div> */}
                          </div>
                          <div className='absolute bottom-0 left-0 right-0'>
                            <div className='flex flex-col md:flex-row w-full pt-8 bg-gradient-to-t from-[#1B1D26] via-[#1B1D26]/95 to-transparent'>
                              <div className='flex flex-col md:flex-row md:items-center px-6 py-2 text-sm font-casual hidden'>
                                <span className='text-white'>This game has extra contribute bonus. </span>
                                <span className='text-gamefiGreen-700'>View Detail</span>
                              </div>
                              { el?.status?.toUpperCase() !== 'LOCK' || el?.slug === 'epic-war' || el?.slug === 'befitter'
                                ? <a
                                  className="bg-gradient-to-tl from-[#6CDB00] via-[#6CDB00] to-[#C9DB00] ml-auto flex items-center justify-center w-2/3 sm:w-1/3 md:w-1/5 aspect-6 md:aspect-[5/1.1] 2xl:aspect-6 uppercase text-sm text-black font-bold tracking-[0.02em] rounded-br"
                                  style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)' }}
                                  href={`${el?.slug === 'epic-war' ? 'https://portal.epicwar.io/' : el?.slug === 'befitter' ? 'https://befitter.io/' : ''}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {(el?.status?.toUpperCase() !== 'LOCK' || el?.slug === 'epic-war' || el?.slug === 'befitter') ? 'Play now' : 'Coming soon'}
                                  <img src={playNow.src} alt="" className='m-2' />
                                </a>
                                : <div
                                  className="bg-gamefiDark-400 ml-auto flex items-center justify-center w-2/3 sm:w-1/3 md:w-1/5 aspect-6 md:aspect-[5/1.1] 2xl:aspect-6 uppercase text-sm text-black font-bold tracking-[0.02em] rounded-br"
                                  style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)' }}
                                >
                                Coming Soon
                                  <img src={playNow.src} alt="" className='m-2' />
                                </div>}
                            </div>
                          </div>
                        </div>
                      </div>)}
                    </Flicking>
                  </section>
                }
                {/* middle world */}
                {
                  // listProjectMiddle?.length > 0 && <section className='mt-14  md:mt-20'>
                  //   <div className='flex justify-center gap-3 sm:gap-6'>
                  //     <img src={left.src} alt="" />
                  //     <span className='uppercase font-bold min-w-fit sm:text-2xl'>Middle world</span>
                  //     <img src={right.src} alt="" />
                  //   </div>
                  //   <div className='my-3 pt-7 md:pt-9'>
                  //     {/* <img src={circleArrow.src} alt="" /> */}
                  //     <Flicking
                  //       defaultIndex={middleWorld}
                  //       ref={flickingListMiddle}
                  //       bound={true}
                  //       preventClickOnDrag={false}
                  //     >
                  //       {listProjectMiddle?.map((el, i) => (
                  //         <div key={`top-world-${i}`} className="w-1/3 md:w-1/6 pr-2">
                  //           <div className={clsx('p-[3px] border-2 border-transparent rounded-xl cursor-pointer', i === topWorld && 'border-gamefiGreen-500')}>
                  //             <div className='rounded-xl overflow-hidden aspect-[158/213]'>
                  //               <img src={imagesProjects[`${el?.name}`]?.imageVertical} alt="" className='object-cover' />
                  //             </div>
                  //           </div>
                  //           <div className='mx-auto mt-3 justify-center w-2 h-2 rounded-full bg-gradient-to-t from-[#C9DB00] to-[#6CDB00]' />
                  //         </div>
                  //       ))}
                  //     </Flicking>
                  //     {/* <img src={circleArrow.src} alt="" /> */}
                  //   </div>
                  //   <Flicking
                  //     defaultIndex={middleWorld}
                  //     ref={flickingMiddle}
                  //     plugins={plugins}
                  //     preventClickOnDrag={false}
                  //     onWillChange={(e) => {
                  //       setMiddleWorld(e.index)
                  //     }}
                  //   >
                  //     {/* bg-gradient-to-r from-[#1B1D26]/0 to-[#1B1D26] */}
                  //     {listProjectMiddle?.map((el, i) => <div key={`top-world-info-${i}`} className='flex md:h-96 flex-col md:flex-row w-full rounded md:overflow-hidden'>
                  //       <img src={imagesProjects[`${el?.name}`]?.imageVertical} alt="" className='aspect-[158/213] object-cover hidden md:block'/>
                  //       <img src={imagesProjects[`${el?.name}`]?.imageMobile} alt="" className='aspect-[2/1] object-cover md:hidden'/>
                  //       <div className='flex flex-col h-[600px] md:h-auto md:flex-1 bg-[#1B1D26] relative blur-sm'>
                  //         <div className='flex flex-col md:flex-row md:items-center w-full p-6 pt-8'>
                  //           <p className='font-bold text-xl p-2 md:p-0'>{el?.name}</p>
                  //           <div className='md:ml-auto p-2 md:p-0'>
                  //             <img src={present.src} alt=""/>
                  //           </div>
                  //         </div>
                  //         <div className='flex-1 flex flex-col overflow-y-scroll md:mr-2 gap-2'>
                  //           {el?.tasks?.length > 0 && el?.tasks.map((task, iTask) => <div key={`task-${iTask}`} className='gap-1 md:gap-0 mr-2 ml-4'>
                  //             <div className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                  //               <div className='w-full md:w-1/12 lg:w-1/6'>
                  //                 <span className='font-casual font-medium text-sm'>{task?.name}</span>
                  //               </div>
                  //               <div className='flex-1'>
                  //                 <div className='flex items-center pb-5 gap-4'>
                  //                   <img src={smile.src} alt="" />
                  //                   <div className='w-1/3 sm:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm'>
                  //                     <div className={clsx('h-[6px] bg-white rounded-sm', task?.stages[0]?.isCompleted && 'w-full', task?.currentRepetition === 0 ? 'w-0' : `w-${task?.currentRepetition}/${task?.stages[0]?.repetition}`)} />
                  //                   </div>
                  //                   <span className='font-casual text-xs text-white/40'>{task.stages[0]?.isCompleted ? task?.stages[0]?.repetition : task.currentRepetition}/{task.stages[0]?.repetition}</span>
                  //                   <div className='ml-auto flex font-casual font-medium text-[#FFD600] gap-2'>
                  //                     <span>+{task.stages[0]?.reward}</span>
                  //                     <img src={currentFish.src} alt="" className='w-4 h-4' />
                  //                   </div>
                  //                 </div>
                  //                 {task.stages[1] && <><div className='h-[1px] bg-gradient-to-r from-[#303342]/0 to-[#2A2D3D]' />
                  //                   <div className='flex items-center pt-5 gap-4'>
                  //                     <img src={angry.src} alt="" />
                  //                     <div className='w-1/3 sm:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm'>
                  //                       <div className={clsx('h-[6px] bg-white rounded-sm', task.stages[1]?.isCompleted && 'w-full', task.currentRepetition === 0 ? 'w-0' : `w-${task.currentRepetition}/${task.stages[1]?.repetition}`)} />
                  //                     </div>
                  //                     <span className='font-casual text-xs text-white/40'>{task.stages[1]?.isCompleted ? task?.stages[1]?.repetition : task?.currentRepetition}/{task?.stages[1]?.repetition}</span>
                  //                     <div className='ml-auto flex font-casual font-medium text-[#FFD600] gap-2'>
                  //                       <span>+{task?.stages[1]?.reward}</span>
                  //                       <img src={currentFish.src} alt="" className='w-4 h-4' />
                  //                     </div>
                  //                   </div></>}
                  //               </div>
                  //             </div>
                  //           </div>)}
                  //           <div className='gap-1 md:gap-0 mr-2 ml-4'>
                  //             <div className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                  //               <div className='h-10 w-full md:w-1/6 lg:w-1/4' />
                  //             </div>
                  //           </div>
                  //           {/* <div className='w-full h-11 md:h-24'></div> */}
                  //         </div>
                  //       </div>
                  //     </div>)}
                  //   </Flicking>
                  // </section>
                }
              </div>
            </section>
            {/* gamefi world */}
            <section className='mx-auto w-full bg-[#111218] mt-9'>
              <div className='w-full h-fit relative'>
                <img src={bgMew.src} alt="" className='w-full absolute top-0 right-0 left-0 object-cover'/>
                <img src={mew.src} alt="" className='w-full relative z-10 object-cover'/>
              </div>
              <div className='relative z-20 bg-[#111218]'>
                <div className='max-w-[1920px] flex justify-center gap-3 sm:gap-6 p-5 mx-auto'>
                  <img src={left.src} alt="" />
                  <span className='uppercase font-bold min-w-fit sm:text-2xl'>Gamefi World</span>
                  <img src={right.src} alt="" />
                </div>
                {/* <div className="my-4 mx-auto z-0">
                  <div className="uppercase text-gamefiDark-200 font-semibold">We will land on this world in</div>
                  <div className="w-full absolute top-0 left-0 right-0 bottom-0 z-[-1]"><Image src={require('@/assets/images/adventure/bg-countdown.png')} alt=""></Image></div>
                </div> */}
                <div className='max-w-[1920px] w-full pt-4 gap-1 mx-auto'>
                  {listTaskGamefi?.map((el, i) => <div key={`task-gamefi-${i}`} className='flex flex-col gap-2 w-full md:w-2/3 p-2 mx-auto'>
                    <a href="#" className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                      <div className='w-full md:w-1/3'>
                        <span className='font-casual font-medium text-sm'>{ el?.name }</span>
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-4'>
                          <img src={smile.src} alt="" />
                          <span className='font-casual text-xs text-white/40'>{ el?.currentRepetition }/{ el?.stages?.[0]?.repetition }</span>
                          <div className='ml-auto flex font-casual font-medium text-[#FFD600] gap-2'>
                            <span>+{el?.stages?.[0]?.reward}</span>
                            <img src={currentFish.src} alt="" className='w-4 h-4' />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>)}
                </div>
              </div>
            </section>
          </div>}
      </div>
    </div>
    <Toolbox></Toolbox>
  </div>
}

const Adventure = () => {
  return <ParallaxProvider>
    <HubProvider>
      <Content />
    </HubProvider>
  </ParallaxProvider>
}

export default Adventure
