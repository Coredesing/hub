import Layout from '@/components/Layout'
import { getTierById } from '@/utils/tiers'
import React, { useEffect, useMemo, useState, useCallback, createContext } from 'react'
import { fetchOneWithSlug } from '../api/igo'
import { useMyWeb3 } from '@/components/web3/context'
import { fetcher, printNumber, formatterUSD, formatPrice, useFetch } from '@/utils'
import Swap from '@/components/Pages/IGO/Swap'
import Claim from '@/components/Pages/IGO/Claim'
import Link from 'next/link'
import { API_BASE_URL } from '@/utils/constants'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import { useLibraryDefaultFlexible, getCurrency } from '@/components/web3/utils'

import { format } from 'date-fns'
import Recaptcha from '@/components/Base/Recaptcha'
import Requirements from '@/components/Pages/IGO/Requirements'
import SwapProgress from '@/components/Pages/IGO/SwapProgress'
import Countdown from '@/components/Pages/IGO/Countdown'
import { dateFromString, isInRange } from '@/components/Pages/IGO/utils'
import { TIMELINE } from '@/components/Pages/IGO/constants'
import Notification from '@/components/Pages/IGO/Notification'
import { useAppContext } from '@/context'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Tippy from '@tippyjs/react'
import { ethers } from 'ethers'
import { switchNetwork } from '@/components/web3'
import ERC20_ABI from '@/components/web3/abis/ERC20.json'
type Milestone = {
  key: string;
  milestone: string;
  active: boolean;
  start: Date | undefined;
  end: Date | undefined;
  info?: any;
  subMilestones?: Milestone[];
}
export const IGOContext = createContext({
  poolData: null,
  whitelistJoined: false,
  whitelistStatus: null,
  now: null,
  signature: null,

  current: null,

  failedRequirements: false,
  usd: null,
  hasFCFS: false,
  completed: false,
  timeline: [],
  allocation: null,

  setSignature: (v: any) => { console.log(v) },
  loadJoined: () => {},
  setFailedRequirements: (v: any) => { console.log(v) },
  setCompleted: (v: any) => { console.log(v) },
  setCurrent: (v: any) => { console.log(v) }
})

const IGODetails = ({ poolData }) => {
  const { tierMine } = useAppContext()

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const [failedRequirements, setFailedRequirements] = useState(false)
  const [completed, setCompleted] = useState(false)
  const hasFCFS = useMemo(() => {
    return poolData.freeBuyTimeSetting?.start_buy_time
  }, [poolData.freeBuyTimeSetting?.start_buy_time])

  const usd = useMemo(() => {
    return getCurrency(poolData)
  }, [poolData])

  const totalRaised = useMemo(() => {
    return parseInt(poolData?.total_sold_coin) * parseFloat(poolData?.token_conversion_rate)
  }, [poolData])

  const { account, library, network } = useMyWeb3()
  const { network: poolNetwork } = useLibraryDefaultFlexible(poolData?.network_available)
  const [signature, setSignature] = useState('')
  const preOrderMinTier = useMemo(() => {
    return getTierById(poolData?.pre_order_min_tier)
  }, [poolData])

  const [whitelistJoined, setWhitelistJoined] = useState(false)
  const [whitelistStatus, setWhitelistStatus] = useState({})
  const loadJoined = useCallback(() => {
    if (!poolData?.id || !account) {
      setWhitelistJoined(false)
      return
    }

    fetcher(`${API_BASE_URL}/user/whitelist-apply/${poolData.id}?wallet_address=${account}`)
      .then(res => {
        setWhitelistStatus(res?.data || {})
      })

    fetcher(`${API_BASE_URL}/user/check-join-campaign/${poolData.id}?wallet_address=${account}`)
      .then(res => {
        setWhitelistJoined(!!res.data)
      })
  }, [poolData, account])
  useEffect(() => {
    console.log(poolData)
    loadJoined()
  }, [loadJoined])
  const [tab, setTab] = useState(0)

  const poolWhitelistTime = useMemo(() => {
    const start = poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined
    const end = poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined
    return {
      start,
      end
    }
  }, [poolData])

  const poolPreOrderTime = useMemo(() => {
    const start = poolData?.start_pre_order_time ? new Date(Number(poolData?.start_pre_order_time) * 1000) : undefined
    const end = poolData?.start_time ? new Date(Number(poolData?.start_time) * 1000) : undefined
    return {
      start,
      end
    }
  }, [poolData])

  const poolBuyTime = useMemo(() => {
    const start = poolData?.start_time ? new Date(Number(poolData?.start_time) * 1000) : undefined
    const end = poolData?.freeBuyTimeSetting?.start_buy_time ? new Date(Number(poolData?.freeBuyTimeSetting?.start_buy_time) * 1000) : undefined
    return {
      start,
      end
    }
  }, [poolData])

  const poolFreeBuyTime = useMemo(() => {
    const start = poolData?.freeBuyTimeSetting?.start_buy_time ? new Date(Number(poolData?.freeBuyTimeSetting?.start_buy_time) * 1000) : undefined
    const end = poolData?.finish_time ? new Date(Number(poolData?.finish_time) * 1000) : undefined
    return {
      start,
      end
    }
  }, [poolData])

  const poolClaimTime = useMemo(() => {
    const start = poolData?.campaignClaimConfig?.[0]?.finish_time ? new Date(Number(poolData?.campaignClaimConfig?.[0]?.finish_time) * 1000) : undefined
    return {
      start
    }
  }, [poolData])

  const isClaimTime = useMemo(() => {
    return poolClaimTime.start <= now
  }, [poolClaimTime, now])

  const [winnerSearch, setWinnerSearch] = useState('')
  const [captchaWinner, setCaptchaWinner] = useState('')
  const [winnerSearchResults, setWinnerSearchResults] = useState([])

  const onCaptchaWinnerLoad = () => {
    setCaptchaWinner('')
  }
  const onCaptchaWinner = token => {
    setCaptchaWinner(token)
  }

  const lookupWinner = useCallback(() => {
    setWinnerSearchResults([])

    if (!captchaWinner) {
      return
    }

    fetcher(`${API_BASE_URL}/user/winner-search/${poolData?.id}/?wallet_address=${winnerSearch}&captcha_token=${captchaWinner}`)
      .then(res => {
        if (res?.status !== 200) {
          return
        }

        setWinnerSearchResults([
          {
            wallet_address: winnerSearch,
            result: !!res?.data
          }
        ])
      })
  }, [winnerSearch, captchaWinner, poolData, setWinnerSearchResults])

  const { response: winnerResponse, errorMessage: winnerError } = useFetch(`/user/winner-list/${poolData.id}`, !poolData)

  const winnerList = useMemo(() => {
    return winnerResponse?.data
  }, [winnerResponse])

  const poolHasWinners = useMemo(() => {
    return winnerList?.total > 0
  }, [winnerList])

  const timeline = useMemo<Milestone[]>(() => {
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
        end: new Date(Number(poolData?.start_join_pool_time) * 1000) || undefined,
        info: {
          countdownTitle: 'Whitelist Starts In'
        }
      },
      {
        key: 'whitelist',
        milestone: 'Apply Whitelist',
        active: true,
        start: new Date(Number(poolData?.start_join_pool_time) * 1000) || undefined,
        end: new Date(Number(poolData?.end_join_pool_time) * 1000) || undefined,
        info: {
          countdownTitle: 'Whitelist Ends In'
        }
      },
      {
        key: 'winner-announcement',
        milestone: 'Winner Announcement',
        active: true,
        start: new Date(Number(poolData?.end_join_pool_time) * 1000) || undefined,
        end: new Date(Number(poolData?.start_pre_order_time || poolData?.start_time || 0) * 1000) || undefined,
        info: {
          countdownTitle: hasFCFS ? 'Phase 1 Starts In' : 'Buying Phase Starts In'
        }
      },
      {
        key: 'pre-order',
        milestone: 'Pre-order',
        active: !!poolData?.start_pre_order_time,
        start: new Date(Number(poolData?.start_pre_order_time) * 1000) || undefined,
        end: new Date(Number(poolData?.start_time) * 1000) || undefined,
        info: {
          minTier: preOrderMinTier,
          countdownTitle: hasFCFS ? 'Phase 1 Starts In' : 'Buying Phase Starts In'
        }
      },
      {
        key: 'buying-phase',
        milestone: 'Buying Phase',
        active: true,
        start: new Date(Number(poolData?.start_time) * 1000) || undefined,
        end: new Date(Number(poolData?.finish_time) * 1000) || undefined,
        subMilestones: hasFCFS
          ? [
            {
              key: 'phase-1',
              milestone: 'Phase 1 - Guaranteed',
              active: true,
              start: new Date(Number(poolData?.start_time) * 1000) || undefined,
              end: new Date(Number(poolData?.freeBuyTimeSetting?.start_buy_time) * 1000) || undefined
            },
            {
              key: 'phase-2',
              milestone: 'Phase 2 - FCFS',
              active: true,
              start: new Date(Number(poolData?.freeBuyTimeSetting?.start_buy_time) * 1000) || undefined,
              end: new Date(Number(poolData?.finish_time) * 1000) || undefined
            }
          ]
          : []
      },
      {
        key: 'claim',
        milestone: 'Claim',
        active: !!poolData?.start_pre_order_time,
        start: new Date(Number(poolData?.start_pre_order_time) * 1000) || undefined,
        end: new Date(Number(poolData?.start_time) * 1000) || undefined,
        info: {
          countdownTitle: 'Next Claim In'
        }
      }
    ]
  }, [poolData, preOrderMinTier, hasFCFS])

  const [current, setCurrent] = useState(null)

  const { response: allocationResponse, errorMessage: allocationError } = useFetch(`/pool/${poolData.id}/user/${account}/current-tier`, !poolData)
  const allocation = useMemo(() => {
    return allocationResponse?.data
  }, [allocationResponse?.data])

  useEffect(() => {
    if (allocationError) toast.error('Failed to fetch allocation, reload the page to try again!')
  }, [allocationError])

  useEffect(() => {
    if (!poolData.start_join_pool_time || poolData.campaign_status?.toLowerCase() === 'tba') {
      return setCurrent(timeline[TIMELINE.TBA])
    }

    if (now.getTime() < dateFromString(poolData.start_join_pool_time).getTime()) {
      return setCurrent(timeline[TIMELINE.PRE_WHITELIST])
    }

    if (isInRange(poolData?.start_join_pool_time, poolData?.end_join_pool_time, now)) {
      return setCurrent(timeline[TIMELINE.WHITELIST])
    }

    if (poolData.start_pre_order_time && isInRange(poolData?.end_join_pool_time, poolData?.start_pre_order_time, now)) {
      return setCurrent(timeline[TIMELINE.WINNER_ANNOUNCEMENT])
    }

    if (isInRange(poolData.end_join_pool_time, poolData.start_time, now)) {
      return setCurrent(timeline[TIMELINE.WINNER_ANNOUNCEMENT])
    }

    if (poolData.start_pre_order_time &&
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

    if (now.getTime() > dateFromString(poolData.finish_time).getTime()) {
      return setCurrent(timeline.find(item => item.key === 'claim'))
    }
  }, [hasFCFS, now, poolData, timeline])

  const addToWallet = async (item: any) => {
    if (!library?.provider?.isMetaMask) {
      toast.error('MetaMask wallet is not found!')
      return
    }

    if (!item.token) {
      return
    }

    if (network?.alias !== poolNetwork?.alias) {
      return switchNetwork(library?.provider, poolNetwork.id)
    }

    const tokenContract = new ethers.Contract(item.token, ERC20_ABI, library.getSigner())
    console.log(library)
    if (!tokenContract) {
      return
    }
    const symbol = await tokenContract.symbol()
    const decimals = await tokenContract.decimals()
    const name = await tokenContract.name()

    await library?.provider?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenContract.address,
          symbol,
          decimals,
          name
        }
      }
    })
  }

  useEffect(() => {
    if (current?.key === 'buying-phase') {
      setTab(1)
      return
    }

    if (current?.key === 'claim') {
      setTab(1)
    }
  }, [current])

  return (
    <Layout title={poolData?.title || 'GameFi'}>
      <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
        {/* <div className="px-2 md:px-4 lg:px-24 md:container mx-auto lg:block mb-4 md:mb-8 lg:mb-10 xl:mb-16"> */}
        <Link href="/igo" passHref={true}>
          <a className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10"/>
              <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square"/>
            </svg>
            Back
          </a>
        </Link>
        { !poolData.id && <div className="uppercase font-bold text-3xl mb-6">IGO Not Found</div>}
        { poolData.id && <IGOContext.Provider value={{
          poolData,
          whitelistJoined,
          whitelistStatus,
          now,
          signature,

          current,

          failedRequirements,
          usd,
          hasFCFS,
          completed,
          timeline,
          allocation,

          setSignature,
          loadJoined,
          setFailedRequirements,
          setCompleted,
          setCurrent
        }}>
          {
            (!poolData?.public_winner_status || !winnerList?.total) &&
            current?.key === 'winner-announcement'
              ? <Notification type="info" text="Please wait for the winner announcement."></Notification>
              : ''
          }
          {
            current?.key === 'winner-announcement' &&
            poolData?.public_winner_status &&
            winnerList?.total &&
            allocation?.max_buy
              ? <Notification type="success" text={`Congratulations on your ${allocation.max_buy} ${usd.symbol} allocation for ${poolData.title}. You can join from ${poolData?.pre_order_min_tier !== null && tierMine?.id >= poolData?.pre_order_min_tier ? 'Pre-order' : 'Phase 1 - Guarantee'}.`}></Notification>
              : ''
          }
          {
            current?.key === 'winner-announcement' &&
            poolData?.public_winner_status &&
            winnerList?.total &&
            !allocation?.max_buy
              ? <Notification type="error" text={`Sorry! You are not one of the ${winnerList?.total || 0} winners.`}></Notification>
              : ''
          }
          {
            poolData?.finish_time && now.getTime() > new Date(poolData.finish_time).getTime()
              ? <Notification type="error" text="This pool is over. See you in the next pool."></Notification>
              : ''
          }
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 bg-gradient-to-b from-gamefiDark-630/30 p-4 xl:p-6 2xl:p-7 rounded">
              <div className="flex items-center gap-6">
                <div>
                  <img src={poolData?.token_images} alt={poolData.name} className="w-32 h-32 object-contain bg-black rounded" />
                </div>
                <div>
                  <h2 className="font-semibold text-2xl font-casual capitalize my-2">{ poolData?.title }</h2>
                  <p className="inline-flex gap-5 justify-end my-4">
                    { poolData?.website && <a href={poolData?.website} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="currentColor"/>
                      </svg>
                    </a> }

                    { poolData?.socialNetworkSetting?.telegram_link && <a href={poolData?.socialNetworkSetting?.telegram_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="currentColor"/>
                      </svg>
                    </a> }

                    { poolData?.socialNetworkSetting?.twitter_link && <a href={poolData?.socialNetworkSetting?.twitter_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="currentColor"/>
                      </svg>
                    </a> }

                    { poolData?.socialNetworkSetting?.medium_link && <a href={poolData?.socialNetworkSetting?.medium_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="currentColor"/>
                      </svg>
                    </a> }
                  </p>
                </div>
              </div>
              <div className="font-casual text-sm text-white/80 mt-8">
                { poolData.description }
              </div>
              {poolData.slug && <div className=""><a href={`/aggregator/${poolData.slug}`}>Full Research &gt;&gt;</a></div>}
              <div className="mt-4">
                {
                  current?.key === 'tba' &&
                  <div className="w-full flex flex-col items-center justify-center bg-black rounded-sm py-2 px-4">
                    <div className="font-semibold text-2xl">Coming Soon</div>
                  </div>
                }
                {
                  current?.key === 'pre-whitelist' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={poolData?.start_join_pool_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  current?.key === 'whitelist' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={poolData?.end_join_pool_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  current?.key === 'winner-announcement' &&
                  <div className="w-full">
                    <div className="mt-2">
                      {
                        tierMine?.id >= poolData?.pre_order_min_tier
                          ? <Countdown title="Pre-order Starts In" to={poolData?.start_pre_order_time}></Countdown>
                          : <Countdown title="Phase 1 Starts In" to={poolData?.start_time}></Countdown>
                      }
                    </div>
                  </div>
                }
                {
                  current?.key === 'buying-phase' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={hasFCFS}></Countdown>
                    </div>
                  </div>
                }
                {
                  current?.key === 'buying-phase-1' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={poolData?.finish_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  current?.key === 'buying-phase-2' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={poolData?.finish_time}></Countdown>
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className="lg:w-[26rem] flex flex-col gap-6">
              <Requirements></Requirements>
              <SwapProgress></SwapProgress>
            </div>
          </div>

          <Tabs
            titles={
              poolHasWinners
                ? [
                  'POOL INFO',
                  'SWAP',
                  'CLAIM',
                  `WINNERS (${winnerList.total})`
                ]
                : [
                  'POOL INFO',
                  'SWAP',
                  'CLAIM'
                ]}
            currentValue={tab}
            onChange={setTab}
            className="mt-10"
          />

          <TabPanel value={tab} index={0}>
            <div className="flex flex-col xl:flex-row gap-4 mt-4">
              <div className="xl:w-1/3 bg-gamefiDark-630 bg-opacity-30 clipped-t-r rounded-md p-6 font-casual text-sm">
                <p className="uppercase font-mechanic font-bold text-lg mb-6">Token Info</p>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Symbol</strong>
                  <span className="flex gap-2 items-center">
                    {poolData?.symbol}
                    {poolData.token && poolData.campaign_status?.toLowerCase() === 'ended' && poolData.token_type === 'erc20' && <>
                      <Tippy content="Add to Metamask">
                        <button
                          className="w-6 h-6 xl:w-8 xl:h-8 hover:opacity-90"
                          onClick={() => addToWallet(poolData)}
                        >
                          <Image src={require('@/assets/images/wallets/metamask.svg')} alt=""></Image>
                        </button>
                      </Tippy>
                    </>}
                  </span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Price</strong>
                  <span>{poolData?.token_conversion_rate} {usd?.symbol}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Total Raised</strong>
                  <span>{formatterUSD.format(totalRaised).replace(/\D00(?=\D*$)/, '')}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Swap Amount</strong>
                  <span>{printNumber(poolData?.total_sold_coin)} {poolData?.symbol}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Network</strong>
                  <span className="inline-flex items-center"><img src={poolNetwork?.image?.default?.src} className="w-5 h-5 mr-2" alt={poolNetwork?.name} />{poolNetwork?.name}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Accepted Currency</strong>
                  <span className="inline-flex items-center"><img src={usd?.image} className="w-5 h-5 mr-2" alt={usd?.name} />{usd?.symbol}</span>
                </div>
                <div className="">
                  <strong className="font-semibold block">Vesting</strong>
                  <span className="text-gamefiDark-100 text-[13px]">{poolData?.claim_policy}</span>
                </div>
              </div>
              <div className="flex-1 bg-gamefiDark-630 bg-opacity-30 clipped-t-r rounded-md p-6 font-casual text-sm">
                <p className="uppercase font-mechanic font-bold text-lg mb-6">Pool Timeline</p>
                <div className="table w-full font-casual text-sm mt-2 font-medium border-separate [border-spacing:0_0.4rem]">
                  <div className="table-row">
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">Milestone</div>
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                      From
                    </div>
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                      To
                    </div>
                  </div>

                  <div className={`table-row ${current?.key === 'whitelist' && 'text-gamefiGreen'}`}>
                    <div className="table-cell align-middle py-2 rounded">
                      Apply Whitelist
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.WHITELIST].start ? `${format(timeline[TIMELINE.WHITELIST].start, 'HH:mm, dd MMM yyyy')} (${format(new Date(), 'z')})` : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.WHITELIST].end ? `${format(timeline[TIMELINE.WHITELIST].end, 'HH:mm, dd MMM yyyy')} (${format(new Date(), 'z')})` : 'TBA'}
                    </div>
                  </div>

                  <div className={`table-row ${current?.key === 'winner-announcement' && 'text-gamefiGreen'}`}>
                    <div className="table-cell align-middle py-2 rounded">
                      Winner Announcement
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.WINNER_ANNOUNCEMENT].end ? `${format(timeline[TIMELINE.WINNER_ANNOUNCEMENT].end, 'HH:mm, dd MMM yyyy')} (${format(new Date(), 'z')})` : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                    </div>
                  </div>

                  <div className={`table-row ${current?.key === 'pre-order' && 'text-gamefiGreen'}`}>
                    <div className="table-cell align-middle py-2 rounded">
                      Pre-order (Min Tier: {preOrderMinTier.name})
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.PRE_ORDER].start ? format(timeline[TIMELINE.PRE_ORDER].start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.PRE_ORDER].end ? format(timeline[TIMELINE.PRE_ORDER].end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                  </div>

                  {
                    hasFCFS
                      ? <>
                        <div className={`table-row ${current?.key === 'buying-phase-1' && 'text-gamefiGreen'}`}>
                          <div className="table-cell align-middle py-2 rounded">
                      Buying Phase 1 - Guarantee
                          </div>
                          <div className="table-cell align-middle py-2 font-normal">
                            {timeline[TIMELINE.BUYING_PHASE].subMilestones[0].start ? format(timeline[TIMELINE.BUYING_PHASE].subMilestones[0].start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                          </div>
                          <div className="table-cell align-middle py-2 font-normal">
                            {timeline[TIMELINE.BUYING_PHASE].subMilestones[0].end ? format(timeline[TIMELINE.BUYING_PHASE].subMilestones[0].end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                          </div>
                        </div>

                        <div className={`table-row ${current?.key === 'buying-phase-2' && 'text-gamefiGreen'}`}>
                          <div className="table-cell align-middle py-2 rounded">
                      Buying Phase 2 - FCFS
                          </div>
                          <div className="table-cell align-middle py-2 font-normal">
                            {timeline[TIMELINE.BUYING_PHASE].subMilestones[1].start ? format(timeline[TIMELINE.BUYING_PHASE].subMilestones[1].start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                          </div>
                          <div className="table-cell align-middle py-2 font-normal">
                            {timeline[TIMELINE.BUYING_PHASE].subMilestones[1].end ? format(timeline[TIMELINE.BUYING_PHASE].subMilestones[1].end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                          </div>
                        </div>
                      </>
                      : <>
                        <div className={`table-row ${current?.key === 'buying-phase' && 'text-gamefiGreen'}`}>
                          <div className="table-cell align-middle py-2 rounded">
                      Buying Phase - Guarantee
                          </div>
                          <div className="table-cell align-middle py-2 font-normal">
                            {poolBuyTime.start ? format(poolBuyTime.start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                          </div>
                          <div className="table-cell align-middle py-2 font-normal">
                            {poolFreeBuyTime.end ? format(poolFreeBuyTime.end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                          </div>
                        </div></>
                  }

                  <div className={`table-row ${current?.key === 'claim' && 'text-gamefiGreen'}`}>
                    <div className="table-cell align-middle py-2 rounded">
                      Claim
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolClaimTime.start ? format(poolClaimTime.start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal"></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            { failedRequirements
              ? <div className="my-4 w-full flex flex-col gap-4 p-12 rounded items-center justify-center">
                <Image src={require('@/assets/images/icons/poolOver.png')} alt=""></Image>
                <div className="text-gamefiDark-200">You do not meet the requirements.</div>
              </div>
              : <Swap></Swap> }
          </TabPanel>
          <TabPanel value={tab} index={2}>
            { failedRequirements
              ? <div className="my-4 w-full flex flex-col gap-4 p-12 rounded items-center justify-center">
                <Image src={require('@/assets/images/icons/poolOver.png')} alt=""></Image>
                <div className="text-gamefiDark-200">You do not meet the requirements.</div>
              </div>
              : <Claim></Claim> }
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <div className="bg-gamefiDark-630/30 clipped-t-r rounded-md p-7 font-casual text-sm flex gap-6 mt-4">
              <div className="pr-6 border-r border-gamefiDark-630/50">
                <p className="font-mechanic uppercase font-bold text-lg mb-6">Winner Lookup</p>
                <input type="text" placeholder="Enter wallet address" className="w-full text-sm rounded-sm bg-gamefiDark-650/50 border-gamefiDark-400 mb-3" value={winnerSearch} onChange={e => setWinnerSearch(e.target.value)} />
                <Recaptcha className="w-full mb-3" onChange={onCaptchaWinner} onLoad={onCaptchaWinnerLoad}></Recaptcha>
                <div className="flex">
                  <button className='ml-auto py-3 px-10 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r bg-gamefiGreen-500 text-gamefiDark-900 inline-block text-center' onClick={lookupWinner}>
                    Search
                  </button>
                </div>
              </div>
              <div className="w-full">
                <div className="table w-full font-casual text-sm font-medium border-separate [border-spacing:0_0.4rem]">
                  <div className="table-row">
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                      Wallet Address
                    </div>
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                      Result
                    </div>
                  </div>

                  { winnerSearchResults.map(r => <div key={r.wallet_address} className="table-row">
                    <div className="table-cell align-middle py-2 rounded">
                      {r.wallet_address}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {r.result ? 'Winner' : 'Good luck next time!'}
                    </div>
                  </div>) }
                </div>
              </div>
            </div>
          </TabPanel>
        </IGOContext.Provider> }
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ params }) {
  if (!params?.slug) {
    return { props: { poolData: {} } }
  }

  const poolData = await fetchOneWithSlug(params.slug)
  if (!poolData?.data) {
    return { props: { poolData: {} } }
  }

  return { props: { poolData: poolData.data } }
}

export default IGODetails
