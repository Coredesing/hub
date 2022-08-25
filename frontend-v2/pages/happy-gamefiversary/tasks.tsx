import Modal from '@/components/Base/Modal'
import GameFiTaskLayout from '@/components/Layout/GameFiTask'
import GameFiPassV2 from '@/components/Pages/Adventure/Tasks/GameFiPassV2'
import BaseWorld from '@/components/Pages/Gamefiversary/BaseWorld'
import { useMyWeb3 } from '@/components/web3/context'
import HubProvider from '@/context/hubProvider'
import { fetcher, printNumber } from '@/utils'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import toast from 'react-hot-toast'
import logoGameFi from '@/components/Pages/Adventure/images/logo-gradient.png'
import SocialTaskButton from '@/components/Pages/Gamefiversary/SocialTaskButton'
import Tippy from '@tippyjs/react'
import smile from '@/components/Pages/Adventure/images/smile.svg'
import currentFish from '@/components/Pages/Adventure/images/current-fish.svg'

export const AdventureTasksContext = createContext<{
  fetchTasks:() => Promise<any>;
    }>({
      fetchTasks: null
    })

const Detail = () => {
  const { account } = useMyWeb3()

  const [joinedTeam, setJoinedTeam] = useState(null)
  const [refferalLink, setRefferalLink] = useState('')
  const [inputTeamSlug, setInputTeamSlug] = useState('')
  const [showModalJoinTeam, setShowModalJoinTeam] = useState(false)
  const [gafish, setGafish] = useState(0)
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])

  const [loadingSocial, setLoadingSocial] = useState(false)
  const [listSocial, setListSocial] = useState([])
  const [accountEligible, setAccountEligible] = useState(false)
  const [fetchEligibleDone, setFetchEligibleDone] = useState(false)

  const layoutBodyRef = useRef(null)
  const gamefiWorldRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (router?.query?.g === 'gamefi') {
      setTimeout(() => {
        gamefiWorldRef?.current?.scrollIntoView()
      }, 1000)
    }
    if (router?.query?.team) {
      setRefferalLink(router.query.team?.toString())
      setInputTeamSlug(router.query.team?.toString())
      setShowModalJoinTeam(true)
    }
  }, [router.query?.g, router.query.team])

  const fetchEligible = useCallback(async () => {
    return fetcher(`/api/adventure/${account}/checkEligible`)
      .then((res) => {
        setAccountEligible(res?.data?.isEligible)
        setFetchEligibleDone(true)
      })
      .catch((e) => console.debug(e))
  }, [account])

  useEffect(() => {
    if (!account) return
    fetchEligible()
  }, [account, fetchEligible])

  const fetchJoinedTeam = useCallback(async () => {
    return fetcher(`/api/adventure/${account}/team`)
      .then((res) => {
        if (!res?.data?.team) {
          setJoinedTeam(null)
          return
        }

        setJoinedTeam(res?.data?.team)
      })
      .catch((e) => console.debug(e))
  }, [account])
  useEffect(() => {
    if (!account) {
      setJoinedTeam(null)
      return
    }

    fetchJoinedTeam()
  }, [account, fetchJoinedTeam])

  const parseInputJoinTeam = useCallback((input) => {
    const regex =
      /^https:\/\/gamefi\.org\/adventure\/join\?team=([a-zA-Z0-9-]*)$/

    let matches = []
    let slug = ''
    if (regex.test(input)) {
      matches = input.match(regex)
      slug = matches?.length > 0 && matches[1]
    } else {
      slug = /^[a-zA-Z0-9-]*$/.test(input) && input
    }

    return slug
  }, [])
  const handleJoinTeam = useCallback(() => {
    if (!refferalLink) return

    const slug = parseInputJoinTeam(refferalLink)
    setInputTeamSlug(slug)

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
        setRefferalLink('')
        fetchJoinedTeam()
      })
  }, [account, fetchJoinedTeam, parseInputJoinTeam, refferalLink])

  const fetchTasks = useCallback(async () => {
    return account && fetcher(`/api/adventure/project/${account}`)
      .then((res) => {
        if (res) {
          setTasks(res)
        }
      })
      .catch((e) => console.debug(e))
  }, [account])

  const fetchProjects = useCallback(async () => {
    return fetcher('/api/adventure/project')
      .then((res) => {
        if (res) {
          setProjects(res)
        }
      })
      .catch((e) => console.debug(e))
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (account) {
      fetchTasks()
    }
  }, [account, fetchTasks])

  const topProjects = useMemo(() => {
    if (!projects?.length && !tasks?.length) return []

    return (account ? tasks : projects)
      .find((el) => el?.name === 'TOP_WORLD')
      ?.projects.sort((a, b) => {
        if (a?.status === 'UNLOCK') return -1
        if (a?.status === 'LOCK') return 1
        return 0
      })
  }, [account, projects, tasks])

  const middleProjects = useMemo(() => {
    if (!projects?.length && !tasks?.length) return []

    const middleWorldProjects = (account ? tasks : projects)
      .find((el) => el?.name === 'MIDDLE_WORLD')
      ?.projects.sort((a, b) => {
        if (a?.status === 'UNLOCK') return -1
        if (a?.status === 'LOCK') return 1
        return 0
      })
    return middleWorldProjects?.map((project) => {
      return {
        ...project,
        tasks: (project?.tasks || []).map((task) => {
          return {
            ...task,
            projectSlug: project.slug
          }
        })
      }
    })
  }, [account, projects, tasks])

  const gamefiTasks = useMemo(() => {
    if (!projects?.length && !tasks?.length) return []
    const gamefiWorldProject = (account ? tasks : projects).find(
      (el) => el?.name?.toUpperCase() === 'GAMEFI_WORLD'
    )?.projects?.[0]

    return (gamefiWorldProject?.tasks || []).map((task) => {
      return {
        ...task,
        projectSlug: gamefiWorldProject.slug
      }
    })
    // return ?.projects?.[0]?.tasks
  }, [account, projects, tasks])

  useEffect(() => {
    if (account) {
      setLoadingSocial(true)
      fetcher('/api/account/ranks/getUserRankAndQuests', {
        method: 'POST',
        body: JSON.stringify({ walletId: account })
      })
        .then((res) => {
          setLoadingSocial(false)
          if (!res?.data?.groupQuests?.length) return
          const LIST_SOCIAL_REQUIRED = [
            { name: 'Twitter' },
            { name: 'Telegram' }
          ]
          const quests = res?.data?.groupQuests[0]?.quests?.filter((v) =>
            LIST_SOCIAL_REQUIRED.some((c) => v.name?.includes(c.name))
          )
          setListSocial(quests)
        })
        .catch(() => setLoadingSocial(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    if (!account) {
      setGafish(0)
      return
    }

    fetcher(`/api/adventure/${account}/points`)
      .then((res) => {
        if (res?.currentPoint) {
          setGafish(res.currentPoint)
        }
      })
      .catch((e) => console.debug(e))
  }, [account])

  const [loadingRecheck, setLoadingRecheck] = useState(false)
  const handleRecheck = useCallback(
    (task) => {
      setLoadingRecheck(true)

      fetcher('/api/adventure/recheckSocialTask', {
        method: 'POST',
        body: JSON.stringify({
          walletAddress: account,
          projectSlug: task.projectSlug,
          taskSlug: task.slug
        })
      })
        .then((res) => {
          if (!res) {
            toast.error('Failed')
            return
          }

          console.log(res)
          toast.success('Success')
          fetchTasks()
        })
        .catch((e) => console.debug(e))
        .finally(() => {
          setLoadingRecheck(false)
        })

      // fetcher(`/api/adventure/recheckSocialTask/${task}/${task?.slug}`)
    },
    [account, fetchTasks]
  )

  const handleRecheckDailyCheckIn = () => {
    if (!account) return

    setLoadingRecheck(true)

    fetcher(`/api/adventure/${account}/refreshDailyCheckInProgress`, {
      method: 'GET'
    })
      .then((res) => {
        if (!res) {
          toast.error('Failed')
          return
        }

        console.log(res)
        toast.success('Success')
        fetchTasks()
      })
      .catch((e) => console.debug(e))
      .finally(() => {
        setLoadingRecheck(false)
      })
  }

  return (
    <GameFiTaskLayout
      title="Happy Gamefiversary - Catventure in the Multiverse"
      description="Come along with Gafi the Catstronaut and his space clowder as they explore uncharted web3 gaming universes in hunt of the legendary Golden Gafish."
    >
      {
        // !account && <section className='flex-1 max-w-[1920px] mx-auto mt-32 mb-14 md:mt-60 md:mb-0 lg:mt-52 xl:mt-40 2xl:mt-24'>
        //   <div className='h-full mx-auto flex flex-col items-center md:container relative'>
        //     <div className="flex items-center justify-center">
        //       <Image src={require('@/components/Pages/Adventure/images/welcome.png')} alt="" className="px-5 md:px-0" />
        //     </div>
        //     <div className="text-gamefiGreen font-casual font-medium mt-4">Please connect wallet before joining the adventure!</div>
        //     <a href="https://www.youtube.com/watch?v=X4XWR6lZ63I" target="_blank" rel="noreferrer" className="relative mt-16" onClick={() => {}}>
        //       <div className="w-24 h-24"><Image src={require('@/assets/images/adventure/play.png')} alt=""></Image></div>
        //       {/* <div className="" style={{ transformOrigin: 'center' }}>GameFi.org aniversary - join multiversee adventure - </div> */}
        //     </a>
        //     <div className="flex items-center justify-center">
        //       <Image src={require('@/components/Pages/Adventure/images/cat-start.png')} alt="" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full md:w-1/2 max-w-[722px]" />
        //     </div>
        //   </div>
        // </section>
      }
      <HubProvider>
        <AdventureTasksContext.Provider
          value={{
            fetchTasks
          }}
        >
          <div ref={layoutBodyRef} className="w-full h-full">
            <section className="max-w-[1180px] px-4 lg:px-0 mx-auto flex flex-col items-center gap-1 mb-6">
              <p className="text-center uppercase font-bold font-mechanic text-lg tracking-[0.2em] text-white/50 bg-transparent p-2">
                Gamefiversary
              </p>
              <div className="">
                <Image
                  src={require('@/components/Pages/Adventure/images/text-multiverse.png')}
                  alt=""
                ></Image>
              </div>
              <p className="p-4 font-casual font-medium text-[11px] sm:text-sm flex items-center gap-1">
                Finish all{' '}
                <Image
                  src={require('@/components/Pages/Adventure/images/smile.svg')}
                  alt=""
                  className="inline"
                />{' '}
                <span className="text-[#70C81B]">Easy Tasks</span> to get bonus
                Gafish
              </p>
            </section>
            <section className="max-w-[1180px] px-6 xl:px-0 mx-auto flex flex-col items-center pt-5 pb-10 md:pt-10 md:pb-20 md:flex-row md:items-center gap-7 md:gap-0">
              {joinedTeam
                ? (
                  <div className="w-full md:max-w-[400px] flex gap-1 px-4 h-14 justify-between bg-[#22252F] rounded border-[1px] border-[#303342]">
                    <input
                      type="text"
                      placeholder="Enter referral link here"
                      value={`You have joined team ${joinedTeam.name}`}
                      disabled
                      className="font-casual text-sm focus:border-none focus:ring-0 bg-transparent border-none ring-0 w-full"
                    ></input>
                  </div>
                )
                : (
                  <div className="w-full md:max-w-[500px] flex gap-1 px-4 h-14 justify-between bg-[#22252F] rounded border-[1px] border-[#303342]">
                    <input
                      type="text"
                      placeholder="Enter referral link here"
                      value={refferalLink}
                      onChange={(e) => {
                        setRefferalLink(e?.target?.value || '')
                        setInputTeamSlug(
                          parseInputJoinTeam(e?.target?.value || '')
                        )
                      }}
                      className="focus:border-none focus:ring-0 bg-transparent border-none ring-0 w-full"
                    ></input>
                    <button
                      className={`w-32 flex items-center justify-start font-bold text-sm tracking-[0.02em] uppercase ${
                        refferalLink
                          ? 'text-gamefiGreen-700'
                          : 'text-gamefiDark-200 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        refferalLink && setShowModalJoinTeam(true)
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
              <div className="w-full md:w-[200px] md:ml-auto px-4 h-14 flex items-center bg-[#FFA800]/5 rounded border-[1px] border-[#FFD600]/40">
                <Image
                  src={require('@/components/Pages/Adventure/images/current-fish.svg')}
                  alt=""
                />
                <div className="ml-5">
                  <div className="font-mechanic font-bold text-white/50 text-sm uppercase flex items-center gap-2">
                    <div>Current gafish</div>
                    <Tippy
                      content={
                        <span>
                          Gafish can be earned from 24 Aug 2022, 13:00 UTC
                        </span>
                      }
                      className="font-casual text-sm leading-5 p-3"
                    >
                      <div>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z"
                            fill="#858689"
                          />
                        </svg>
                      </div>
                    </Tippy>
                  </div>
                  <p className="font-casual font-medium text-sm mt-auto">
                    {printNumber(gafish)}
                  </p>
                </div>
                {/* <img src={add.src} alt="" className='ml-auto cursor-pointer' /> */}
              </div>
            </section>
            <section className="max-w-[1180px] px-6 xl:px-0 mx-auto pb-10 md:pb-20 gap-7 md:gap-0">
              <div className="mb-12">
                <GameFiPassV2
                  listSocial={listSocial}
                  loadingSocial={loadingSocial}
                  accountEligible={accountEligible}
                  fetchEligible={fetchEligible}
                  fetchEligibleDone={fetchEligibleDone}
                ></GameFiPassV2>
              </div>
              {/* Top world */}
              <BaseWorld
                projects={topProjects}
                type="top-world"
                className="mb-20"
                layoutBodyRef={layoutBodyRef}
                accountEligible={accountEligible}
              />
              {/* Middle world */}
              <BaseWorld
                projects={middleProjects}
                type="middle-world"
                layoutBodyRef={layoutBodyRef}
                accountEligible={accountEligible}
              />
            </section>
            {/* GameFi world */}
            <section
              ref={gamefiWorldRef}
              className="w-full bg-[#111218] mt-9 pb-20 md:pb-0"
            >
              <div className="w-full h-fit relative z-0">
                <div className="w-full relative z-10">
                  <Image
                    src={require('@/assets/images/adventure/meow-2.png')}
                    alt=""
                  />
                </div>
              </div>
              <div className="relative w-full bg-[#111218]">
                <div className="w-full flex justify-center gap-3 sm:gap-6 p-5">
                  <Image
                    src={require('@/components/Pages/Adventure/images/left.svg')}
                    alt=""
                  />
                  <span className="uppercase font-bold min-w-fit sm:text-2xl">
                    Gamefi World
                  </span>
                  <Image
                    src={require('@/components/Pages/Adventure/images/right.svg')}
                    alt=""
                  />
                </div>
                {/* <div className="my-4 mx-auto z-0">
              <div className="uppercase text-gamefiDark-200 font-semibold">We will land on this world in</div>
              <div className="w-full absolute top-0 left-0 right-0 bottom-0 z-[-1]"><Image src={require('@/assets/images/adventure/bg-countdown.png')} alt=""></Image></div>
            </div> */}
                <div className="max-w-[1180px] w-full pt-4 gap-1 mx-auto">
                  {gamefiTasks?.length > 0 &&
                    gamefiTasks.map((task, i) => (
                      <div
                        key={`task-gamefi-${i}`}
                        className="flex flex-col gap-2 w-full md:w-2/3 p-2 mx-auto"
                      >
                        <div className="flex flex-col md:flex-row items-center w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]">
                          <div className="w-full md:w-1/6 lg:w-1/4">
                            <span className="font-casual font-medium text-sm">
                              {task?.name}
                            </span>
                          </div>
                          <div className="w-full flex flex-col lg:flex-row gap-2 items-center">
                            {task?.socialInfo && (
                              <div className="flex items-center gap-4">
                                <div>
                                  <Image
                                    src={smile.src}
                                    alt=""
                                    width={16}
                                    height={16}
                                  />
                                </div>
                                <SocialTaskButton data={task} />
                              </div>
                            )}
                            {!task?.socialInfo && (
                              <div className="w-full">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <Image
                                      src={smile.src}
                                      alt=""
                                      width={16}
                                      height={16}
                                    />
                                  </div>
                                  <div className="w-full lg:w-1/2 p-[3px] h-fit bg-[#111218] rounded-sm">
                                    <div
                                      className={`h-[6px] bg-white rounded-sm ${
                                        task?.stages[0]?.isCompleted && 'w-full'
                                      } ${
                                        !(
                                          task.currentRepetition /
                                          task.stages[0]?.repetition
                                        ) && 'w-0'
                                      }`}
                                      style={{
                                        width: `${
                                          (task.currentRepetition /
                                            task.stages[0]?.repetition) *
                                          100
                                        }%`
                                      }}
                                    />
                                  </div>
                                  <span className="font-casual text-xs text-white/40">
                                    {task.stages[0]?.isCompleted
                                      ? task?.stages[0]?.repetition
                                      : task.currentRepetition}
                                    /{task.stages[0]?.repetition}
                                  </span>
                                </div>
                                <span className="font-casual text-xs text-white/40">
                                  {task.stages[0]?.isCompleted
                                    ? task?.stages[0]?.repetition
                                    : task.currentRepetition}
                            /{task.stages[0]?.repetition}
                                </span>
                              </div>
                            )}
                            <div className="lg:ml-auto flex font-casual font-medium text-[#FFD600] gap-2">
                              <span>+{task.stages[0]?.reward}</span>
                              <img
                                src={currentFish.src}
                                alt=""
                                className="w-4 h-4"
                              />
                            </div>
                            {task?.socialInfo?.url &&
                              task?.currentRepetition !==
                                task?.stages?.[0]?.repetition &&
                                  account && (
                              <button
                                onClick={() => {
                                  if (loadingRecheck) return
                                  handleRecheck(task)
                                }}
                                className={`text-sm font-semibold ${
                                  loadingRecheck
                                    ? 'text-gamefiDark-200'
                                    : 'text-gamefiGreen'
                                }`}
                              >
                                  Recheck
                              </button>
                            )}
                            {task?.slug === 'daily-checkin' && account && (
                              <button
                                onClick={() => {
                                  if (loadingRecheck) return
                                  handleRecheckDailyCheckIn()
                                }}
                                className={`ml-2 text-sm font-semibold ${
                                  loadingRecheck
                                    ? 'text-gamefiDark-200'
                                    : 'text-gamefiGreen'
                                }`}
                              >
                                Recheck
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="max-w-[1180px] mx-auto p-8 mt-14">
                <div className="flex flex-col md:flex-row items-center justify-center relative">
                  <img
                    src={logoGameFi.src}
                    alt="GameFi.org"
                    className="h-5 w-auto"
                  />
                  <div className="text-sm text-white text-opacity-60 text-center my-4 flex-1 md:my-0">
                    Crafted with love © GameFi.org 2022{' '}
                    <br className="md:hidden" />
                    <span className="hidden md:inline">–</span> All Rights
                    Reserved.
                  </div>
                  <div className="flex gap-4 md:gap-0">
                    <div className="cursor-pointer">
                      <a
                        href="https://gamefi.org/"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 block group"
                      >
                        <svg
                          className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" />
                        </svg>
                      </a>
                    </div>
                    <div className="cursor-pointer">
                      <a
                        href="https://t.me/GameFi_OfficialANN"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 block group"
                      >
                        <svg
                          className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#x)">
                            <path d="M15.9683 1.68422C15.9557 1.62517 15.9276 1.57057 15.8868 1.52608C15.846 1.48158 15.794 1.44883 15.7363 1.43122C15.526 1.3893 15.3084 1.40484 15.1063 1.47622C15.1063 1.47622 1.08725 6.51422 0.286252 7.07222C0.114252 7.19322 0.056252 7.26222 0.027252 7.34422C-0.110748 7.74422 0.320252 7.91722 0.320252 7.91722L3.93325 9.09422C3.99426 9.10522 4.05701 9.10145 4.11625 9.08322C4.93825 8.56422 12.3863 3.86122 12.8163 3.70322C12.8843 3.68322 12.9343 3.70322 12.9163 3.75222C12.7443 4.35222 6.31025 10.0712 6.27525 10.1062C6.25818 10.1205 6.2448 10.1387 6.23627 10.1592C6.22774 10.1798 6.2243 10.2021 6.22625 10.2242L5.88925 13.7522C5.88925 13.7522 5.74725 14.8522 6.84525 13.7522C7.62425 12.9732 8.37225 12.3272 8.74525 12.0142C9.98725 12.8722 11.3243 13.8202 11.9013 14.3142C11.9979 14.4083 12.1125 14.4819 12.2383 14.5305C12.3641 14.5792 12.4985 14.6018 12.6333 14.5972C12.7992 14.5767 12.955 14.5062 13.0801 14.3952C13.2051 14.2841 13.2934 14.1376 13.3333 13.9752C13.3333 13.9752 15.8943 3.70022 15.9793 2.31722C15.9873 2.18222 16.0003 2.10022 16.0003 2.00022C16.0039 1.89392 15.9931 1.78762 15.9683 1.68422Z" />
                          </g>
                          <defs>
                            <clipPath id="x">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    </div>
                    <div className="cursor-pointer">
                      <a
                        href="https://t.me/GameFi_Official"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 block group"
                      >
                        <svg
                          className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#y)">
                            <path
                              d="M15.9683 1.68422C15.9557 1.62517 15.9276 1.57057 15.8868 1.52608C15.846 1.48158 15.794 1.44883 15.7363 1.43122C15.526 1.3893 15.3084 1.40484 15.1063 1.47622C15.1063 1.47622 1.08725 6.51422 0.286252 7.07222C0.114252 7.19322 0.056252 7.26222 0.027252 7.34422C-0.110748 7.74422 0.320252 7.91722 0.320252 7.91722L3.93325 9.09422C3.99426 9.10522 4.05701 9.10145 4.11625 9.08322C4.93825 8.56422 12.3863 3.86122 12.8163 3.70322C12.8843 3.68322 12.9343 3.70322 12.9163 3.75222C12.7443 4.35222 6.31025 10.0712 6.27525 10.1062C6.25818 10.1205 6.2448 10.1387 6.23627 10.1592C6.22774 10.1798 6.2243 10.2021 6.22625 10.2242L5.88925 13.7522C5.88925 13.7522 5.74725 14.8522 6.84525 13.7522C7.62425 12.9732 8.37225 12.3272 8.74525 12.0142C9.98725 12.8722 11.3243 13.8202 11.9013 14.3142C11.9979 14.4083 12.1125 14.4819 12.2383 14.5305C12.3641 14.5792 12.4985 14.6018 12.6333 14.5972C12.7992 14.5767 12.955 14.5062 13.0801 14.3952C13.2051 14.2841 13.2934 14.1376 13.3333 13.9752C13.3333 13.9752 15.8943 3.70022 15.9793 2.31722C15.9873 2.18222 16.0003 2.10022 16.0003 2.00022C16.0039 1.89392 15.9931 1.78762 15.9683 1.68422Z"
                              fill="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="y">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    </div>
                    <div className="cursor-pointer">
                      <a
                        href="https://twitter.com/GameFi_Official"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 block group"
                      >
                        <svg
                          className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16 3C15.4 3.3 14.8 3.4 14.1 3.5C14.8 3.1 15.3 2.5 15.5 1.7C14.9 2.1 14.2 2.3 13.4 2.5C12.8 1.9 11.9 1.5 11 1.5C9.3 1.5 7.8 3 7.8 4.8C7.8 5.1 7.8 5.3 7.9 5.5C5.2 5.4 2.7 4.1 1.1 2.1C0.8 2.6 0.7 3.1 0.7 3.8C0.7 4.9 1.3 5.9 2.2 6.5C1.7 6.5 1.2 6.3 0.7 6.1C0.7 7.7 1.8 9 3.3 9.3C3 9.4 2.7 9.4 2.4 9.4C2.2 9.4 2 9.4 1.8 9.3C2.2 10.6 3.4 11.6 4.9 11.6C3.8 12.5 2.4 13 0.8 13C0.5 13 0.3 13 0 13C1.5 13.9 3.2 14.5 5 14.5C11 14.5 14.3 9.5 14.3 5.2C14.3 5.1 14.3 4.9 14.3 4.8C15 4.3 15.6 3.7 16 3Z" />
                        </svg>
                      </a>
                    </div>
                    <div className="cursor-pointer">
                      <a
                        href="https://discord.com/invite/gamefi"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 block group"
                      >
                        <svg
                          className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.8352 13.8052C12.8352 13.8052 12.3451 13.213 11.9367 12.7025C12.9235 12.4702 13.7964 11.8963 14.4009 11.0824C13.911 11.4084 13.3858 11.6778 12.8352 11.8856C12.2019 12.156 11.5395 12.3524 10.8611 12.471C9.69515 12.6859 8.49931 12.6813 7.33501 12.4574C6.65146 12.3237 5.98156 12.1277 5.33369 11.872C4.78846 11.662 4.26799 11.3926 3.78165 11.0687C4.36427 11.8656 5.20701 12.4339 6.16417 12.6752C5.75574 13.1858 5.252 13.8052 5.252 13.8052C4.44327 13.8271 3.64157 13.6498 2.91748 13.2889C2.19338 12.928 1.56911 12.3947 1.09961 11.7359C1.14379 8.97582 1.81414 6.26185 3.06008 3.79865C4.15652 2.93752 5.49326 2.43803 6.88573 2.36914L7.02188 2.53932C5.71427 2.86462 4.4942 3.47349 3.4481 4.32281C3.4481 4.32281 3.74761 4.15263 4.25135 3.92799C5.23036 3.48363 6.27333 3.19647 7.34182 3.07709C7.41803 3.06131 7.49547 3.0522 7.57326 3.04986C8.48253 2.92474 9.4035 2.90875 10.3166 3.00221C11.7547 3.16645 13.1468 3.61045 14.4145 4.30919C13.419 3.5018 12.2636 2.9148 11.0245 2.58697L11.2151 2.36914C12.6076 2.43803 13.9443 2.93752 15.0408 3.79865C16.2867 6.26185 16.9571 8.97582 17.0012 11.7359C16.5279 12.3941 15.901 12.9267 15.1749 13.2873C14.4489 13.648 13.6457 13.8258 12.8352 13.8052ZM5.51177 7.93044C5.76964 7.65048 6.12338 7.47774 6.50272 7.44654C6.69355 7.4533 6.88113 7.4979 7.05457 7.57776C7.22802 7.65763 7.38386 7.77116 7.51306 7.91175C7.64226 8.05235 7.74224 8.21722 7.80718 8.39678C7.87213 8.57634 7.90075 8.76702 7.89139 8.95774C7.89961 9.14818 7.87019 9.33839 7.80482 9.51745C7.73945 9.69652 7.63941 9.86094 7.51043 10.0013C7.38145 10.1417 7.22605 10.2552 7.05314 10.3355C6.88023 10.4157 6.69319 10.4611 6.50272 10.4689C6.12338 10.4377 5.76964 10.265 5.51177 9.98503C5.25389 9.70507 5.11074 9.33836 5.11074 8.95774C5.11074 8.57711 5.25389 8.2104 5.51177 7.93044ZM10.5971 7.63804C10.8628 7.48758 11.1677 7.42084 11.472 7.44654C11.6624 7.45441 11.8495 7.49977 12.0224 7.58001C12.1953 7.66026 12.3507 7.77381 12.4797 7.91417C12.6087 8.05453 12.7087 8.21895 12.7741 8.39802C12.8394 8.57709 12.8689 8.76729 12.8607 8.95774C12.8606 9.26306 12.7684 9.56126 12.596 9.81331C12.4237 10.0654 12.1793 10.2595 11.8948 10.3703C11.6103 10.4812 11.2989 10.5035 11.0015 10.4345C10.7041 10.3655 10.4344 10.2083 10.2278 9.98343C10.0213 9.75861 9.88735 9.47665 9.84365 9.17447C9.79995 8.87228 9.8485 8.56394 9.98294 8.28981C10.1174 8.01567 10.3315 7.78851 10.5971 7.63804Z"
                          />
                        </svg>
                      </a>
                    </div>
                    <div className="cursor-pointer">
                      <a
                        href="https://medium.com/gamefi-official"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 block group"
                      >
                        <svg
                          className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" />
                        </svg>
                      </a>
                    </div>
                    <div className="cursor-pointer">
                      <a
                        href="https://www.facebook.com/GameFi.org/"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 block group"
                      >
                        <svg
                          className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6.01972 15.3334L5.9987 8.66675H3.33203V6.00008H5.9987V4.33341C5.9987 1.85915 7.53091 0.666748 9.73812 0.666748C10.7954 0.666748 11.7041 0.745461 11.9689 0.780648V3.3664L10.4381 3.36709C9.23766 3.36709 9.00524 3.93751 9.00524 4.77455V6.00008H12.4987L11.1654 8.66675H9.00524V15.3334H6.01972Z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </AdventureTasksContext.Provider>
      </HubProvider>
      <Modal
        show={showModalJoinTeam}
        toggle={setShowModalJoinTeam}
        className={'bg-slate-800'}
      >
        <div className="p-9" style={{ background: 'rgb(31 31 35)' }}>
          {account && accountEligible && (
            <>
              <div className="text-xl font-bold uppercase">Join A Team</div>
              <div className="mt-8 font-casual text-sm text-gamefiDark-100">
                <div>
                  This step cannot be reversed, you are only allowed to join one
                  team. Do you want to join the team with slug{' '}
                  <span className="font-bold">{inputTeamSlug}</span>?
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
            </>
          )}
          {!account && (
            <>
              <div className="text-xl font-bold uppercase">Join A Team</div>
              <div className="mt-8 font-casual text-sm text-gamefiDark-100">
                <div>Please connect wallet before joining a team!</div>
              </div>
              <div className="mt-8 flex gap-2 justify-end">
                <button
                  className="bg-gamefiDark-400 rounded-sm clipped-t-r w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                  onClick={() => {
                    setShowModalJoinTeam(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {account && !accountEligible && (
            <>
              <div className="text-xl font-bold uppercase">Join A Team</div>
              <div className="mt-8 font-casual text-sm">
                <div>
                  Please register your GameFi Pass before joining a team!
                </div>
              </div>
              <div className="mt-8 flex gap-2 justify-end">
                <button
                  className="bg-gamefiDark-300 rounded-sm clipped-t-r w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                  onClick={() => {
                    setShowModalJoinTeam(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </GameFiTaskLayout>
  )
}

export default Detail

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
    imageVertical: require('@/assets/images/adventure/kucoin.jpeg'),
    imageMobile: require('@/assets/images/adventure/kucoin-m.jpeg')
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
    imageMobile: require('@/assets/images/adventure/isekai-verse.png')
  },
  'engine-of-fury': {
    imageVertical: require('@/assets/images/adventure/engine-of-fury.jpeg'),
    imageMobile: require('@/assets/images/adventure/engine-of-fury-m.jpeg')
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
    imageVertical: require('@/assets/images/adventure/metacity.jpeg'),
    imageMobile: require('@/assets/images/adventure/metacity.jpeg')
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
    imageVertical: require('@/assets/images/adventure/thunder-lands.jpeg'),
    imageMobile: require('@/assets/images/adventure/thunder-lands.jpeg')
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
  },
  'homie-wars': {
    imageVertical: require('@/assets/images/adventure/homie-wars.png'),
    imageMobile: require('@/assets/images/adventure/homie-wars.png')
  },
  'war-legends': {
    imageVertical: require('@/assets/images/adventure/war-legends.png'),
    imageMobile: require('@/assets/images/adventure/war-legends.png')
  },
  'step-app': {
    imageVertical: require('@/assets/images/adventure/step-app.png'),
    imageMobile: require('@/assets/images/adventure/step-app.png')
  }
}

export { imagesProjects }
