import Modal from '@/components/Base/Modal'
import GameFiTaskLayout from '@/components/Layout/GameFiTask'
import GameFiPassV2 from '@/components/Pages/Adventure/Tasks/GameFiPassV2'
import BaseWorld from '@/components/Pages/Gamefiversary/BaseWorld'
import { useMyWeb3 } from '@/components/web3/context'
import HubProvider from '@/context/hubProvider'
import { fetcher, printNumber } from '@/utils'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const Detail = () => {
  const { account } = useMyWeb3()

  const [joinedTeam, setJoinedTeam] = useState(null)
  const [refferalLink, setRefferalLink] = useState('')
  const [inputTeamSlug, setInputTeamSlug] = useState('')
  const [showModalJoinTeam, setShowModalJoinTeam] = useState(false)
  const [gafish, setGafish] = useState(0)
  const [projects, setProjects] = useState([])

  const [loadingSocial, setLoadingSocial] = useState(false)
  const [listSocial, setListSocial] = useState([])
  const [accountEligible, setAccountEligible] = useState(false)

  const layoutBodyRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (router?.query?.team) {
      setRefferalLink(router.query.team?.toString())
      setInputTeamSlug(router.query.team?.toString())
      setShowModalJoinTeam(true)
    }
  }, [router.query.team])

  const fetchEligible = useCallback(async () => {
    return fetcher(`/api/adventure/${account}/checkEligible`).then(res => {
      setAccountEligible(false)
      if (res?.isEligible) {
        setAccountEligible(true)
      }
    }).catch(e => console.debug(e))
  }, [account])

  useEffect(() => {
    if (!account) return
    fetchEligible()
  }, [account, fetchEligible])

  const fetchJoinedTeam = useCallback(async () => {
    return fetcher(`/api/adventure/${account}/team`).then(res => {
      if (!res?.data?.team) {
        setJoinedTeam(null)
        return
      }

      setJoinedTeam(res?.data?.team)
    }).catch(e => console.debug(e))
  }, [account])
  useEffect(() => {
    if (!account) {
      setJoinedTeam(null)
      return
    }

    fetchJoinedTeam()
  }, [account, fetchJoinedTeam])

  const handleJoinTeam = useCallback(() => {
    if (!refferalLink) return
    const regex = /^https:\/\/gamefi\.org\/adventure\/join\?team=([a-zA-Z0-9-]*)$/

    let matches = []
    let slug = ''
    if (regex.test(refferalLink)) {
      matches = refferalLink.match(regex)
      slug = matches?.length > 0 && matches[1]
    } else {
      slug = /^[a-zA-Z0-9-]*$/.test(refferalLink) && refferalLink
    }

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
    }).then(res => {
      if (!res || res.error) {
        toast.error(res?.message)
        return
      }
      toast.success(res?.message || 'Join team successfully')
    }).catch(e => {
      toast.error(e?.message)
    }).finally(() => {
      setShowModalJoinTeam(false)
      toast.dismiss(toasting)
      setRefferalLink('')
      fetchJoinedTeam()
    })
  }, [account, fetchJoinedTeam, refferalLink])

  const fetchTasks = useCallback(async () => {
    return fetcher(`/api/adventure/project/${account}`).then(res => {
      if (res) {
        setProjects(res)
      }
    }).catch(e => console.debug(e))
  }, [account])

  const fetchProjects = useCallback(async () => {
    return fetcher('/api/adventure/project').then(res => {
      if (res) {
        setProjects(res)
      }
    }).catch(e => console.debug(e))
  }, [])

  useEffect(() => {
    if (!account) {
      fetchProjects()
    } else {
      fetchTasks()
    }
  }, [account, fetchProjects, fetchTasks])

  const topProjects = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find((el) => el?.name === 'TOP_WORLD')?.projects
  }, [projects])

  const middleProjects = useMemo(() => {
    if (!projects?.length || !projects) return []

    return projects.find((el) => el?.name === 'MIDDLE_WORLD')?.projects
  }, [projects])

  const gamefiTasks = useMemo(() => {
    if (!projects?.length) return []

    return projects.find(el => el?.name?.toUpperCase() === 'GAMEFI_WORLD')?.projects?.[0]?.tasks
  }, [projects])

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
          const quests = res?.data?.groupQuests[0]?.quests?.filter(v => LIST_SOCIAL_REQUIRED.some(c => v.name?.includes(c.name)))
          setListSocial(quests)
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

  return <GameFiTaskLayout>
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
    <HubProvider><div ref={layoutBodyRef} className="w-full h-full">
      <section className="max-w-[1180px] px-4 lg:px-0 mx-auto flex flex-col items-center gap-1 mb-6">
        <p className="text-center uppercase font-bold font-mechanic text-lg tracking-[0.2em] text-white/50 bg-transparent p-2">Gamefiversary</p>
        <div className="">
          <Image src={require('@/components/Pages/Adventure/images/text-multiverse.png')} alt=""></Image>
        </div>
        <p className="p-4 font-casual font-medium text-[11px] sm:text-sm flex items-center gap-1">Finish all <Image src={require('@/components/Pages/Adventure/images/smile.svg')} alt="" className='inline' /> <span className='text-[#70C81B]'>Easy Tasks</span> to get bonus Gafish</p>
      </section>
      <section className="max-w-[1180px] px-6 xl:px-0 mx-auto flex flex-col items-center pt-5 pb-10 md:pt-10 md:pb-20 md:flex-row md:items-center gap-7 md:gap-0">
        {joinedTeam
          ? <div className="w-full md:max-w-[400px] flex gap-1 px-4 h-14 justify-between bg-[#22252F] rounded border-[1px] border-[#303342]">
            <input
              type="text"
              placeholder="Enter referral link here"
              value={`You have joined team ${joinedTeam.name}`}
              disabled
              className="font-casual text-sm focus:border-none focus:ring-0 bg-transparent border-none ring-0 w-full"
            >
            </input>
          </div>
          : <div className="w-full md:max-w-[500px] flex gap-1 px-4 h-14 justify-between bg-[#22252F] rounded border-[1px] border-[#303342]">
            <input
              type="text"
              placeholder="Enter referral link here"
              value={refferalLink}
              onChange={(e) => { setRefferalLink(e?.target?.value || '') }}
              className="focus:border-none focus:ring-0 bg-transparent border-none ring-0 w-full"
            >
            </input>
            <button
              className={`w-32 flex items-center justify-start font-bold text-sm tracking-[0.02em] uppercase ${refferalLink ? 'text-gamefiGreen-700' : 'text-gamefiDark-200 cursor-not-allowed'}`}
              onClick={() => { refferalLink && setShowModalJoinTeam(true) }}
            >Join a team</button>
          </div>}
        {/* <div className='flex items-center md:ml-auto'>
        <img src={leaderboard.src} alt="" />
        <span className='ml-2 font-casual text-[#FFD600] text-sm border-b-[1px] border-[#FFD600]'>Event Leaderboard</span>
      </div> */}
        <div className="w-full md:w-[200px] md:ml-auto px-4 h-14 flex items-center bg-[#FFA800]/5 rounded border-[1px] border-[#FFD600]/40">
          <Image src={require('@/components/Pages/Adventure/images/current-fish.svg')} alt="" />
          <div className="ml-5">
            <p className='font-mechanic font-bold text-white/50 uppercase text-sm'>Current gafish</p>
            <p className='font-casual font-medium text-sm mt-auto'>{printNumber(gafish)}</p>
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
          ></GameFiPassV2>
        </div>
        {/* Top world */}
        <BaseWorld projects={topProjects} type="top-world" className="mb-20" layoutBodyRef={layoutBodyRef} accountEligible={false} />
        {/* Middle world */}
        <BaseWorld projects={middleProjects} type="middle-world" layoutBodyRef={layoutBodyRef} accountEligible={false} />
      </section>
      {/* GameFi world */}
      <section className="w-full bg-[#111218] mt-9">
        <div className="w-full h-fit relative z-0">
          <div className="w-full relative z-10">
            <Image src={require('@/assets/images/adventure/meow-2.png')} alt=""/>
          </div>
        </div>
        <div className="relative w-full bg-[#111218]">
          <div className="w-full flex justify-center gap-3 sm:gap-6 p-5">
            <Image src={require('@/components/Pages/Adventure/images/left.svg')} alt="" />
            <span className="uppercase font-bold min-w-fit sm:text-2xl">Gamefi World</span>
            <Image src={require('@/components/Pages/Adventure/images/right.svg')} alt="" />
          </div>
          {/* <div className="my-4 mx-auto z-0">
              <div className="uppercase text-gamefiDark-200 font-semibold">We will land on this world in</div>
              <div className="w-full absolute top-0 left-0 right-0 bottom-0 z-[-1]"><Image src={require('@/assets/images/adventure/bg-countdown.png')} alt=""></Image></div>
            </div> */}
          <div className='max-w-[1180px] w-full pt-4 gap-1 mx-auto'>
            {gamefiTasks?.length > 0 && gamefiTasks.map((task, i) => <div key={`task-gamefi-${i}`} className='flex flex-col gap-2 w-full md:w-2/3 p-2 mx-auto'>
              <a href="#" className='flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]'>
                <div className='w-full md:w-1/3'>
                  <span className='font-casual font-medium text-sm'>{ task?.name }</span>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-4'>
                    <Image src={require('@/components/Pages/Adventure/images/smile.svg')} alt="" />
                    <div className="w-full max-w-[200px] h-2 bg-[#111218] rounded-sm overflow-hidden">
                      {!!(Number(task?.currentRepetition) / Number(task?.stages?.[0]?.repetition)) && <div className={`w-[${(Number(task?.currentRepetition) / Number(task?.stages?.[0]?.repetition))}%] h-full bg-white`}></div>}
                    </div>
                    <span className="font-casual text-xs text-white/40">{ task?.currentRepetition }/{ task?.stages?.[0]?.repetition }</span>
                    <div className="ml-auto flex font-casual font-medium text-[#FFD600] gap-2">
                      <span>+{task?.stages?.[0]?.reward}</span>
                      <Image src={require('@/components/Pages/Adventure/images/current-fish.svg')} alt="" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            </div>)}
          </div>
        </div>
      </section>
    </div>
    </HubProvider>
    <Modal show={showModalJoinTeam} toggle={setShowModalJoinTeam} className={'bg-slate-800'}>
      <div className='p-9' style={{ background: 'rgb(31 31 35)' }}>
        {
          account && accountEligible && <>
            <div className="text-xl font-bold uppercase">Join A Team</div>
            <div className="mt-8 font-casual text-sm text-gamefiDark-100">
              <div>This step cannot be reversed, you are only allowed to join one team. Do you want to join the team with slug <span className="font-bold">{inputTeamSlug}</span>?</div>
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
          </>
        }
        {
          !account && <>
            <div className="text-xl font-bold uppercase">Join A Team</div>
            <div className="mt-8 font-casual text-sm text-gamefiDark-100">
              <div>Please connect wallet before joining a team!</div>
            </div>
            <div className="mt-8 flex gap-2 justify-end">
              <button
                className="bg-gamefiDark-400 rounded-sm clipped-t-r w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                onClick={() => { setShowModalJoinTeam(false) }}
              >Cancel</button>
            </div>
          </>
        }
        {
          account && !accountEligible && <>
            <div className="text-xl font-bold uppercase">Join A Team</div>
            <div className="mt-8 font-casual text-sm">
              <div>Please register your GameFi Pass before joining a team!</div>
            </div>
            <div className="mt-8 flex gap-2 justify-end">
              <button
                className="bg-gamefiDark-300 rounded-sm clipped-t-r w-32 px-4 py-2 font-semibold text-black flex justify-center items-center"
                onClick={() => { setShowModalJoinTeam(false) }}
              >Cancel</button>
            </div>
          </>
        }
      </div>
    </Modal>
  </GameFiTaskLayout>
}

export default Detail
