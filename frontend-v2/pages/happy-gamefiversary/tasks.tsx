import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

// layout
import Head from 'next/head'
import Sidebar from '@/components/Base/Sidebar'
import Topbar from '@/components/Base/Topbar'
import Toolbox from '@/components/Base/Toolbox'
import { defaultDescription, defaultTitle } from '@/utils/constants'

// fonts
import fonts from '@/components/Pages/Adventure/index.module.scss'

// image
import textMultiverse from '@/components/Pages/Adventure/images/text-multiverse.png'
import currentFish from '@/components/Pages/Adventure/images/current-fish.svg'
import left from '@/components/Pages/Adventure/images/left.svg'
import right from '@/components/Pages/Adventure/images/right.svg'
import smile from '@/components/Pages/Adventure/images/smile.svg'
import { GameFiPass } from '@/components/Pages/Adventure/Tasks'
import mew from '@/components/Pages/Adventure/images/mew-world.png'
import bgMew from '@/components/Pages/Adventure/images/bg-mew-world.png'

import get from 'lodash.get'
import toast from 'react-hot-toast'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/react-flicking/dist/flicking.css'
import { fetcher, printNumber } from '@/utils'
import HubProvider from '@/context/hubProvider'
import { useMyWeb3 } from '@/components/web3/context'
import Modal from '@/components/Base/Modal'
import { useRouter } from 'next/router'
import BaseWorld from '@/components/Pages/Gamefiversary/BaseWorld'

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

export { imagesProjects }

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
  const [showModalJoinTeam, setShowModalJoinTeam] = useState(false)

  const router = useRouter()

  const layoutBodyRef = useRef(null)

  useEffect(() => {
    if (account) {
      fetcher('/api/account/ranks/getUserRankAndQuests', {
        method: 'POST',
        body: JSON.stringify({ walletId: account })
      })
        .then((res) => {
          const LIST_SOCIAL_REQUIRED = [
            { name: 'Twitter' },
            { name: 'Telegram' }
          ]
          const quests = get(res, 'data.groupQuests[0].quests', []).filter(
            (v) => LIST_SOCIAL_REQUIRED.some((c) => v.name?.includes(c.name))
          )
          setListSocial(quests)
          setLoadingSocial(false)
        })
        .catch(() => setLoadingSocial(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    if (!account) return

    fetcher(`/api/adventure/${account}/points`)
      .then((res) => {
        if (res?.currentPoint) {
          setGafish(res.currentPoint)
        }
      })
      .catch((e) => console.debug(e))
  }, [account])

  useEffect(() => {
    if (!account) return

    fetcher(`/api/adventure/${account}/team`)
      .then((res) => {
        if (res?.data?.team) {
          setJoinedTeam(res?.data?.team)
        }
      })
      .catch((e) => console.debug(e))
  }, [account])

  useEffect(() => {
    setLoading(true)
    fetcher(`/api/adventure/project/${account || 'guest'}`)
      .then((data) => {
        if (data) {
          setProjects(data)
          setLoading(true)
        }
      })
      .catch((e) => {
        toast.error('Failed to fetch data, please try again!')
      })
  }, [account])

  useEffect(() => {
    if (router?.query?.team) {
      setReferrerLink(router.query.team?.toString())
    }
  }, [router.query.team])

  const listProjectTop = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find((el) => el?.name === 'TOP_WORLD')?.projects
  }, [projects])

  const listProjectMiddle = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find((el) => el?.name === 'MIDDLE_WORLD')?.projects
  }, [projects])

  const listTaskGamefi = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find((el) => el?.name === 'GAMEFI_WORLD')?.projects?.[0]
      ?.tasks
  }, [projects])

  const title = ''
  const description = ''

  const handleJoinTeam = useCallback(() => {
    if (!referrerLink) return
    const regex =
      /^https:\/\/gamefi\.org\/adventure\/join\?team=([a-zA-Z0-9-]*)$/

    let matches = []
    let slug = ''
    if (regex.test(referrerLink)) {
      matches = referrerLink.match(regex)
      slug = matches?.length > 0 && matches[1]
    } else {
      slug = /^[a-zA-Z0-9-]*$/.test(referrerLink) && referrerLink
    }

    if (!slug) {
      setShowModalJoinTeam(false)
      toast.error('Team not found')
      return
    }

    const toasting = toast.loading('Processing')
    fetcher(`/api/adventure/project/${account}?slug=${slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res || res.error) {
          toast.error(res?.message)
          return
        }
        toast.success(res?.message || 'Join team successfully')
      })
      .catch((e) => {
        toast.error(e?.message)
      })
      .finally(() => {
        setShowModalJoinTeam(false)
        toast.dismiss(toasting)
      })
  }, [account, referrerLink])

  return (
    <div className={`flex w-full h-screen ${theme}`}>
      <div className="dark:bg-gamefiDark-900 dark:text-white w-full flex flex-col md:flex-row">
        <Head>
          <title>{title || defaultTitle}</title>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            property="og:title"
            content={title || defaultTitle}
            key="title"
          />
          <meta
            property="og:description"
            content={description || defaultDescription}
            key="description"
          />
          <meta
            property="og:image"
            content={'https://gamefi.org/gamefi.jpg?v=1655805418132'}
            key="image"
          />
          <meta
            name="keywords"
            content="launchpad, game hub, nft marketplace, game portal, game pass, game guild, tournament, metaverse, ido"
          ></meta>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title || defaultTitle} />
          <meta
            name="twitter:description"
            content={description || defaultDescription}
          />
          <meta
            name="twitter:image"
            content={'https://gamefi.org/gamefi.jpg?v=1655805418132'}
          />
        </Head>
        <div>
          <Sidebar></Sidebar>
        </div>
        <div
          ref={layoutBodyRef}
          className="bg-[#15171E] w-full h-full overflow-auto relative scroll-smooth"
        >
          <Topbar absolute={true}></Topbar>
          <Modal
            show={showModalJoinTeam}
            toggle={setShowModalJoinTeam}
            className={'bg-slate-800'}
          >
            <div className="p-9" style={{ background: 'rgb(31 31 35)' }}>
              <div className="text-xl font-bold uppercase">Join A Team</div>
              <div className="mt-8 font-casual text-sm">
                <div>
                  This step cannot be reversed, you are only allowed to join one
                  team. Do you want to join the team {}?
                </div>
              </div>
              <div className="mt-8 flex gap-2 justify-end">
                <button
                  className="bg-gamefiGreen-700 rounded-sm clipped-b-l w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                  onClick={() => {
                    handleJoinTeam()
                  }}
                >
                  Yes, I do
                </button>
                <button
                  className="bg-gamefiDark-300 rounded-sm clipped-t-r w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                  onClick={() => {
                    setShowModalJoinTeam(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>

          <div className={'mx-auto pb-20 relative z-0 mb-28'}>
            <div
              className={
                'top-20 absolute left-0 right-0 z-[-1] mx-auto clipped-down h-full w-full pt-4'
              }
              style={{
                background:
                  'linear-gradient(90.03deg, #52FF00 0%, #15171E 25vw, #15171E 75vw, #52FF00 99.44%)'
              }}
            >
              <div
                className="clipped-down h-full w-full"
                style={{
                  background:
                    'linear-gradient(180deg, #1D1F28 31.35%, #0F1116 104.36%)'
                }}
              ></div>
            </div>

            <section
              className={
                'max-w-[1920px] mx-auto px-2 sm:px-5 relative mt-[160px]'
              }
            >
              <div className={'md:container mx-auto overflow-hidden'}>
                <p className="text-center uppercase font-bold font-mechanic text-lg tracking-[0.2em] text-white/50 bg-transparent p-2">
                  Gamefiversary
                </p>
                <div className="flex justify-center">
                  <img src={textMultiverse.src} alt="" />
                </div>
                <div className="flex justify-center mb-6">
                  <p className="p-4 font-casual font-medium text-[11px] sm:text-sm">
                    Finish all <img src={smile.src} alt="" className="inline" />{' '}
                    <span className="text-[#70C81B]">Easy Tasks</span> to get
                    bonus Gafish
                  </p>
                </div>
                <div className="w-full relative bg-transparent">
                  <div
                    className="p-6 clipped-t-l-full pl-40 flex flex-col gap-[10px] justify-center"
                    style={{
                      background:
                        'linear-gradient(89.97deg, #272935 60.34%, rgba(27, 29, 38, 0) 97.74%);'
                    }}
                  >
                    <span className="font-casual font-medium text-base leading-[100%] text-white">
                      {!account
                        ? 'Meoww! You need to connect wallet first.'
                        : !connectedAllSocial
                          ? "Just a little bit more. Let's complete all tasks to verify your account."
                          : 'Meow~ Gafi needs sometime after landing in the multiverse!'}
                    </span>
                    {account && connectedAllSocial && (
                      <span className="font-casual font-normal text-sm text-white/60">
                        Gameplay in Catventure will be available in 48 hours.
                        Stay tuned, Catstronaut!
                      </span>
                    )}
                  </div>
                  <div className="w-28 h-28 absolute bottom-0 left-8">
                    <Image
                      src={require('@/assets/images/gamefiversary/cat.png')}
                      alt=""
                      layout="fill"
                    ></Image>
                  </div>
                </div>
                <section className="mx-auto mb-14 md:mb-0 mt-10">
                  <div className="md:container mx-auto md:mb-[90px] px-6">
                    {account && !connectedAllSocial && (
                      <GameFiPass
                        listSocial={listSocial}
                        loadingSocial={loadingSocial}
                        setConnectedAllSocial={setConnectedAllSocial}
                      />
                    )}
                  </div>
                </section>
                {
                  <div className="flex flex-col items-center pt-5 pb-10 md:pt-10 md:pb-20 md:flex-row md:items-center gap-7 md:gap-0">
                    {joinedTeam
                      ? (
                        <div className="font-casual text-gamefiGreen">
                        You have joined team {joinedTeam.name}
                        </div>
                      )
                      : (
                        <div className="w-full md:w-1/3 flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter referral link here"
                            value={referrerLink}
                            onChange={(e) => {
                              setReferrerLink(e?.target?.value)
                            }}
                            className="w-full px-4 h-14 justify-between bg-[#22252F] rounded border-[1px] border-[#303342] focus:border-none focus:ring-0"
                          ></input>
                          <button
                            className={`w-32 flex items-center justify-start font-bold text-sm tracking-[0.02em] uppercase ${
                              referrerLink
                                ? 'text-gamefiGreen-700'
                                : 'text-gamefiDark-200 cursor-not-allowed'
                            }`}
                            onClick={() => {
                              referrerLink && setShowModalJoinTeam(true)
                            }}
                          >
                          Join a team
                          </button>
                        </div>
                      )}
                    {/* <div className='flex items-center md:ml-auto'>
                  <img src={leaderboard.src} alt="" />
                  <span className='ml-2 font-casual text-[#FFD600] text-sm border-b-[1px] border-[#FFD600]'>Event Leaderboard</span>
                </div> */}
                    <div className="w-full md:w-1/5 md:ml-auto px-4 h-14 flex items-center bg-[#FFA800]/5 rounded border-[1px] border-[#FFD600]/40">
                      <img src={currentFish.src} alt="" />
                      <div className="ml-5">
                        <p className="font-mechanic font-bold text-white/50 uppercase text-sm">
                          Current gafish
                        </p>
                        <p className="font-casual font-medium text-sm mt-auto">
                          {printNumber(gafish)}
                        </p>
                      </div>
                      {/* <img src={add.src} alt="" className='ml-auto cursor-pointer' /> */}
                    </div>
                  </div>
                }

                {/* top world */}
                <BaseWorld
                  projects={listProjectTop}
                  type="top-world"
                  layoutBodyRef={layoutBodyRef}
                  connectedAllSocial={connectedAllSocial}
                />
                <BaseWorld
                  projects={listProjectMiddle}
                  type="middle-world"
                  layoutBodyRef={layoutBodyRef}
                  connectedAllSocial={connectedAllSocial}
                  className="mt-10"
                />
                {/* middle world */}
              </div>
            </section>
            {/* gamefi world */}
            <section className="mx-auto w-full bg-[#111218] mt-9">
              <div className="w-full h-fit relative">
                <img
                  src={bgMew.src}
                  alt=""
                  className="w-full absolute top-0 right-0 left-0 object-cover"
                />
                <img
                  src={mew.src}
                  alt=""
                  className="w-full relative z-10 object-cover"
                />
              </div>
              <div className="relative z-20 bg-[#111218]">
                <div className="max-w-[1920px] flex justify-center gap-3 sm:gap-6 p-5 mx-auto">
                  <img src={left.src} alt="" />
                  <span className="uppercase font-bold min-w-fit sm:text-2xl">
                    Gamefi World
                  </span>
                  <img src={right.src} alt="" />
                </div>
                {/* <div className="my-4 mx-auto z-0">
                  <div className="uppercase text-gamefiDark-200 font-semibold">We will land on this world in</div>
                  <div className="w-full absolute top-0 left-0 right-0 bottom-0 z-[-1]"><Image src={require('@/assets/images/adventure/bg-countdown.png')} alt=""></Image></div>
                </div> */}
                <div className="max-w-[1920px] w-full pt-4 gap-1 mx-auto">
                  {listTaskGamefi?.map((el, i) => (
                    <div
                      key={`task-gamefi-${i}`}
                      className="flex flex-col gap-2 w-full md:w-2/3 p-2 mx-auto"
                    >
                      <a
                        href="#"
                        className="flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]"
                      >
                        <div className="w-full md:w-1/3">
                          <span className="font-casual font-medium text-sm">
                            {el?.name}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <img src={smile.src} alt="" />
                            <span className="font-casual text-xs text-white/40">
                              {el?.currentRepetition}/
                              {el?.stages?.[0]?.repetition}
                            </span>
                            <div className="ml-auto flex font-casual font-medium text-[#FFD600] gap-2">
                              <span>+{el?.stages?.[0]?.reward}</span>
                              <img
                                src={currentFish.src}
                                alt=""
                                className="w-4 h-4"
                              />
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Toolbox></Toolbox>
    </div>
  )
}

const Adventure = () => {
  return (
    <HubProvider>
      <Content />
    </HubProvider>
  )
}

export default Adventure
