import Layout from '@/components/Layout'
import { getTierById } from '@/utils/tiers'
import React, { useEffect, useMemo, useState, useCallback, createContext, ChangeEvent } from 'react'
import { fetchOneWithSlug } from '../api/igo'
import { useMyWeb3 } from '@/components/web3/context'
import { fetcher, printNumber, formatterUSD, useFetch, formatNumber, safeToFixed, shortenAddress } from '@/utils'
import Swap from '@/components/Pages/IGO/Swap'
import Claim from '@/components/Pages/IGO/Claim'
import { API_BASE_URL } from '@/utils/constants'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import { useLibraryDefaultFlexible, getCurrency } from '@/components/web3/utils'

import { format } from 'date-fns'
import Recaptcha from '@/components/Base/Recaptcha'
import Requirements from '@/components/Pages/IGO/Requirements'
import SwapProgress from '@/components/Pages/IGO/SwapProgress'
import Countdown from '@/components/Pages/IGO/Countdown'
import { dateFromString, isInRange } from '@/utils/pool'
import { TIMELINE } from '@/components/Pages/IGO/constants'
import Notification from '@/components/Pages/IGO/Notification'
import { useAppContext } from '@/context'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Tippy from '@tippyjs/react'
import { Contract, ethers, utils } from 'ethers'
import { airdropNetworks, STAKING_CONTRACT, switchNetwork, useWeb3Default } from '@/components/web3'
import ERC20_ABI from '@/components/web3/abis/ERC20.json'
import { useRouter } from 'next/router'
import imgRocket from '@/assets/images/rocket.png'
import { useCountdown } from '@/components/Pages/Hub/Countdown'
import useWalletSignature from '@/hooks/useWalletSignature'
import Modal from '@/components/Base/Modal'
import ABIStakingPool from '@/components/web3/abis/StakingPool.json'
import { IS_TESTNET } from '@/components/web3/connectors'
import Link from 'next/link'

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
  signature: null,

  current: null,

  failedRequirements: false,
  usd: null,
  hasFCFS: false,
  completed: false,
  timeline: [],
  allocation: null,
  now: new Date(),

  setSignature: (v: any) => { console.debug(v) },
  loadJoined: () => { },
  setFailedRequirements: (v: any) => { console.debug(v) },
  setCompleted: (v: any) => { console.debug(v) },
  setCurrent: (v: any) => { console.debug(v) }
})

const IGODetails = ({ poolData }) => {
  const router = useRouter()
  const { setStakingPool, loadMyStaking, tierMine } = useAppContext()
  const [readMore, setReadMore] = useState(false)
  const { now } = useAppContext()

  useEffect(() => {
    fetcher(`${API_BASE_URL}/staking-pool`).then(pools => {
      const pool = pools?.data?.find(x => !!x?.rkp_rate)
      setStakingPool(pool)
    })
  }, [setStakingPool])
  useEffect(() => {
    loadMyStaking()
  }, [loadMyStaking])

  const [failedRequirements, setFailedRequirements] = useState(false)
  const [completed, setCompleted] = useState(false)
  const hasFCFS = useMemo(() => {
    return poolData.freeBuyTimeSetting?.start_buy_time
  }, [poolData.freeBuyTimeSetting?.start_buy_time])

  const usd = useMemo(() => {
    return getCurrency(poolData)
  }, [poolData])

  const totalRaise = useMemo(() => {
    return Math.round(parseInt(poolData?.total_sold_coin) * parseFloat(poolData?.token_conversion_rate))
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
    loadJoined()
  }, [loadJoined])
  const [tab, setTab] = useState(0)

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

  const { response: winnerResponse } = useFetch(`/user/winner-list/${poolData.id}`, !poolData)

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
  }, [poolData, preOrderMinTier, hasFCFS, tierMine])

  const [current, setCurrent] = useState(null)

  const { response: allocationResponse, errorMessage: allocationError } = useFetch(`/pool/${poolData.id}/user/${account}/current-tier`, !poolData || !account)
  const allocation = useMemo(() => {
    return allocationResponse?.data
  }, [allocationResponse?.data])

  useEffect(() => {
    if (allocationError) toast.error('Failed to fetch allocation, reload the page to try again!')
  }, [allocationError])

  useEffect(() => {
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
  }, [hasFCFS, now, poolData, timeline, tierMine])

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
    if (current?.key === 'winner-announcement' || current?.key === 'pre-order' || current?.key?.includes('buying-phase')) {
      setTab(1)
    }

    if (current?.key === 'claim') {
      setTab(2)
    }
  }, [current])

  const [games, setGames] = useState([])
  useEffect(() => {
    fetcher(`${API_BASE_URL}/gaming/pools/${poolData?.id}/games`)
      .then(data => {
        setGames((data?.data || []).filter(x => !x.disabled))
      })
      .catch(err => {
        console.debug(err)
      })
  }, [poolData])

  return (
    <Layout title={poolData?.title ? `GameFi.org - ${poolData?.title}` : 'GameFi.org - Initial DEX Offering'} description="The first game-specific launchpad conducting Initial Game Offerings for game projects.">
      <div className="px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
        {/* <div className="px-4 lg:px-24 md:container mx-auto lg:block mb-4 md:mb-8 lg:mb-10 xl:mb-16"> */}
        <a onClick={() => {
          router.back()
        }} className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10" />
            <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square" />
          </svg>
          Back
        </a>
        {!poolData.id && <div className="uppercase font-bold text-3xl mb-6">IGO Not Found</div>}
        {poolData.id && <IGOContext.Provider value={{
          poolData,
          whitelistJoined,
          whitelistStatus,
          signature,
          now,

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
              winnerList?.total > 0 &&
              allocation?.max_buy
              ? <Notification type="success" text={`Congratulations on your ${allocation.max_buy} ${usd.symbol} allocation for ${poolData.title}. You can join from ${poolData?.pre_order_min_tier !== null && tierMine?.id >= poolData?.pre_order_min_tier ? 'Pre-order' : 'Phase 1 - Guarantee'}.`}></Notification>
              : ''
          }
          {
            current?.key === 'winner-announcement' &&
              poolData?.public_winner_status &&
              winnerList?.total > 0 &&
              !allocation?.max_buy
              ? <Notification type="error" text={`Sorry! You are not one of the ${winnerList?.total || 0} winners.`}></Notification>
              : ''
          }
          {
            poolData?.finish_time && now?.getTime() > new Date(poolData.finish_time)?.getTime()
              ? <Notification type="error" text="This pool is over. See you in the next pool."></Notification>
              : ''
          }
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 bg-gradient-to-b from-gamefiDark-630/30 p-4 xl:p-6 2xl:p-7 rounded">
              <div className="flex items-center gap-6">
                <div>
                  <img src={poolData?.token_images} alt={poolData.title} className="w-[120px] h-[120px] object-contain bg-black rounded" />
                </div>
                <div>
                  <h2 className="font-semibold text-2xl font-casual capitalize my-2">{poolData?.title}</h2>
                  <p className="inline-flex gap-5 justify-end my-4">
                    {poolData?.website && <a href={poolData?.website} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="currentColor" />
                      </svg>
                    </a>}

                    {poolData?.socialNetworkSetting?.telegram_link && <a href={poolData?.socialNetworkSetting?.telegram_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="currentColor" />
                      </svg>
                    </a>}

                    {poolData?.socialNetworkSetting?.twitter_link && <a href={poolData?.socialNetworkSetting?.twitter_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="currentColor" />
                      </svg>
                    </a>}

                    {poolData?.socialNetworkSetting?.medium_link && <a href={poolData?.socialNetworkSetting?.medium_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="currentColor" />
                      </svg>
                    </a>}
                  </p>
                </div>
              </div>
              <div className={`font-casual text-sm text-white/80 mt-8 ${poolData.description?.split(' ')?.length > 60 && !readMore && 'line-clamp-4'}`}>
                {poolData.description}
              </div>
              <div className="w-full flex items-center justify-center">
                {
                  poolData.description?.split(' ')?.length > 60 && !readMore &&
                  <button onClick={() => setReadMore(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15L12.3536 15.3536L12 15.7071L11.6464 15.3536L12 15ZM18.3536 9.35355L12.3536 15.3536L11.6464 14.6464L17.6464 8.64645L18.3536 9.35355ZM11.6464 15.3536L5.64645 9.35355L6.35355 8.64645L12.3536 14.6464L11.6464 15.3536Z" fill="white" />
                    </svg>
                  </button>
                }
                {
                  poolData.description?.split(' ')?.length > 60 && readMore &&
                  <button onClick={() => setReadMore(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9L12.3536 8.64645L12 8.29289L11.6464 8.64645L12 9ZM18.3536 14.6464L12.3536 8.64645L11.6464 9.35355L17.6464 15.3536L18.3536 14.6464ZM11.6464 8.64645L5.64645 14.6464L6.35355 15.3536L12.3536 9.35355L11.6464 8.64645Z" fill="white" />
                    </svg>
                  </button>
                }
              </div>
              {poolData.slug && <div className="text-gamefiGreen-700 mt-4"><a href={`/hub/${poolData.slug}`}>Full Research &gt;&gt;</a></div>}
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
                  current?.key === 'pre-order' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={poolData?.start_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  current?.key === 'buying-phase' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={poolData?.finish_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  current?.key === 'buying-phase-1' &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title={current?.info?.countdownTitle} to={poolData?.freeBuyTimeSetting?.start_buy_time}></Countdown>
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

          {!!games?.length && <>
            {games.map(game => <GameDetails game={game} key={game.id}></GameDetails>)}
          </>}

          <Tabs
            titles={
              poolHasWinners
                ? [
                  'INFORMATION',
                  'SWAP',
                  'CLAIM',
                  `WINNERS (${winnerList.total})`
                ]
                : [
                  'INFORMATION',
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
                    {poolData.token &&
                      timeline[TIMELINE.BUYING_PHASE]?.end &&
                      now?.getTime() >= timeline[TIMELINE.BUYING_PHASE].end?.getTime() &&
                      poolData.token_type === 'erc20' &&
                      poolData.token?.toLowerCase() !== '0xe23c8837560360ff0d49ed005c5e3ad747f50b3d' &&
                      <>
                        <Tippy content="Add to Metamask">
                          <button
                            className="w-6 h-6 hover:opacity-90"
                            onClick={() => {
                              addToWallet(poolData)
                            }}
                          >
                            <Image src={require('@/assets/images/wallets/metamask.svg')} alt=""></Image>
                          </button>
                        </Tippy>
                      </>}
                  </span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Token Price</strong>
                  <span>{poolData?.token_conversion_rate} {usd?.symbol}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Total Raise</strong>
                  <span>{formatterUSD.format(totalRaise).replace(/\D00(?=\D*$)/, '')}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Swap Amount</strong>
                  <span>{printNumber(poolData?.total_sold_coin)} {poolData?.symbol}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Token Network</strong>
                  {
                    poolData.airdrop_network && poolData.airdrop_network !== 'none'
                      ? <span className="inline-flex items-center"><img src={airdropNetworks[poolData.airdrop_network]?.image?.default?.src} className="w-5 h-5 mr-2" alt={airdropNetworks[poolData.airdrop_network]?.name} />{airdropNetworks[poolData.airdrop_network]?.name}</span>
                      : <span className="inline-flex items-center"><img src={poolNetwork?.image?.default?.src} className="w-5 h-5 mr-2" alt={poolNetwork?.name} />{poolNetwork?.name}</span>
                  }
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">IGO Network</strong>
                  <span className="inline-flex items-center"><img src={poolNetwork?.image?.default?.src} className="w-5 h-5 mr-2" alt={poolNetwork?.name} />{poolNetwork?.name}</span>
                </div>
                <div className="flex justify-between mb-4 items-center">
                  <strong className="font-semibold">Accepted Currency</strong>
                  <span className="inline-flex items-center"><img src={usd?.image} className="w-5 h-5 mr-2" alt={usd?.name} />{usd?.symbol}</span>
                </div>
                <div className="">
                  <strong className="font-semibold block">Vesting Schedule</strong>
                  <span className="text-gamefiDark-100 text-[13px]">{poolData?.claim_policy}</span>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto bg-gamefiDark-630 bg-opacity-30 clipped-t-r rounded-md p-6 font-casual text-sm">
                <p className="uppercase font-mechanic font-bold text-lg mb-6">Pool Timeline</p>
                <div className="table w-full min-w-[600px] font-casual text-sm mt-2 font-medium border-separate [border-spacing:0_0.4rem]">
                  <div className="table-row">
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">Milestone</div>
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                      From {`(${format(new Date(), 'z')})`}
                    </div>
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                      To {`(${format(new Date(), 'z')})`}
                    </div>
                  </div>

                  <div className={`table-row ${current?.key === 'whitelist' && 'text-gamefiGreen'}`}>
                    <div className="table-cell align-middle py-2 rounded">
                      Apply Whitelist
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.WHITELIST].start ? `${format(timeline[TIMELINE.WHITELIST].start, 'HH:mm, dd MMM yyyy')}` : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.WHITELIST].end ? `${format(timeline[TIMELINE.WHITELIST].end, 'HH:mm, dd MMM yyyy')}` : 'TBA'}
                    </div>
                  </div>

                  <div className={`table-row ${current?.key === 'winner-announcement' && 'text-gamefiGreen'}`}>
                    <div className="table-cell align-middle py-2 rounded">
                      Winner Announcement
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {timeline[TIMELINE.WINNER_ANNOUNCEMENT].start ? `${format(timeline[TIMELINE.WINNER_ANNOUNCEMENT].start, 'HH:mm, dd MMM yyyy')}` : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                    </div>
                  </div>

                  {
                    poolData?.start_pre_order_time && <div className={`table-row ${current?.key === 'pre-order' && 'text-gamefiGreen'}`}>
                      <div className="table-cell align-middle py-2 rounded">
                        Pre-order (Min Rank: {preOrderMinTier.name})
                      </div>
                      <div className="table-cell align-middle py-2 font-normal">
                        {timeline[TIMELINE.PRE_ORDER].start ? format(timeline[TIMELINE.PRE_ORDER].start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                      </div>
                      <div className="table-cell align-middle py-2 font-normal">
                        {timeline[TIMELINE.PRE_ORDER].end ? format(timeline[TIMELINE.PRE_ORDER].end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                      </div>
                    </div>
                  }

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
                            {poolData?.is_private === 3 ? 'Buying Phase - FCFS' : 'Buying Phase - Guarantee'}
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
                      {poolData?.campaignClaimConfig[0]?.start_time ? format(new Date(Number(poolData?.campaignClaimConfig[0]?.start_time) * 1000), 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal"></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            {failedRequirements
              ? <div className="my-4 w-full flex flex-col gap-4 p-12 rounded items-center justify-center">
                <Image src={require('@/assets/images/icons/poolOver.png')} alt=""></Image>
                <div className="text-gamefiDark-100">Please complete requirements in the <span className="font-bold uppercase">Requirements</span> section.</div>
              </div>
              : <Swap></Swap>}
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Claim></Claim>
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <div className="bg-gamefiDark-630/30 clipped-t-r rounded-md p-7 font-casual text-sm flex flex-col xl:flex-row gap-6 mt-4">
              <div className="pr-6 xl:border-r border-gamefiDark-630/50">
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

                  {winnerSearchResults.map(r => <div key={r.wallet_address} className="table-row">
                    <div className="table-cell align-middle py-2 rounded">
                      {r.wallet_address}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {r.result ? 'Winner' : 'Good luck next time!'}
                    </div>
                  </div>)}
                </div>
              </div>
            </div>
          </TabPanel>
        </IGOContext.Provider>}
      </div>
    </Layout>
  )
}

const plural = (text, amount) => {
  const parts = text.split(' ')
  const word = parts.pop()
  if (!word) {
    return text
  }

  const matches = word.match(/(\w+)\((\w+)\)/)
  if (!matches) {
    return text
  }

  if (amount <= 1) {
    return `${parts.join(' ')} ${matches[1]}`
  }

  return `${parts.join(' ')} ${matches[1]}${matches[2]}`
}

const GameDetailsRewards = ({ game }) => {
  const rewards = useMemo(() => game?.settings?.rewards.map((reward, index) => {
    return <div key={index}>
      <strong className="font-semibold uppercase text-transparent bg-clip-text bg-gradient-to-br from-white to-white">- {reward.amount} {plural(reward.token || reward.reward, reward.amount)}</strong>
    </div>
  }), [game])

  return rewards
}

const GameDetails = ({ game }) => {
  const { countdown, ended } = useCountdown({ deadline: game?.endedAt })
  const snapshot = useMemo(() => new Date(game?.settings?.snapshot), [game])
  const [winners, setWinners] = useState(null)
  const [recordsMine, setRecordsMine] = useState(null)
  const { account } = useMyWeb3()
  const { library } = useWeb3Default()
  const { signMessage } = useWalletSignature()
  const { tierMine } = useAppContext()

  const contractReadonly = useMemo(() => {
    if (!library) {
      return null
    }
    return new Contract(STAKING_CONTRACT, ABIStakingPool, library)
  }, [library])

  const [earnStake, setEarnStake] = useState(null)
  useEffect(() => {
    if (!contractReadonly || !account) {
      setEarnStake('')
      return
    }
    setEarnStake(null)
    contractReadonly.linearStakingData(IS_TESTNET ? 4 : 2, account)
      .then(x => utils.formatUnits(x.balance, 18))
      .then(x => {
        setEarnStake(x)
      })
      .catch(() => {
        setEarnStake('')
      })
  }, [contractReadonly, account])
  const validRank = useMemo(() => {
    return tierMine?.id > 0
  }, [tierMine])
  const validEarn = useMemo(() => {
    if (!earnStake) {
      return false
    }
    return Number(earnStake) >= 1
  }, [earnStake])

  useEffect(() => {
    if (!game.answer) {
      return
    }

    fetcher(`${API_BASE_URL}/gaming/games/${game.id}/winners`)
      .then(data => {
        setWinners(data.data || [])
      })
      .catch(err => {
        console.debug(err)
      })
  }, [game])

  const loadRecordsMine = useCallback(() => {
    if (!account) {
      setRecordsMine([])
      return
    }

    setRecordsMine(null)

    fetcher(`${API_BASE_URL}/gaming/games/${game.id}/records?wallet=${account}`)
      .then(data => {
        setRecordsMine(data.data || [])
      })
      .catch(err => {
        setRecordsMine([])
        console.debug(err)
      })
  }, [game, account])

  useEffect(() => {
    loadRecordsMine()
  }, [loadRecordsMine])

  const endedNotJoined = useMemo(() => ended && recordsMine !== null && !recordsMine?.length, [recordsMine, ended])

  const [number, setNumber] = useState('')
  const [errorNumber, setErrorNumber] = useState('')
  useEffect(() => {
    setNumber('')
    setErrorNumber('')
  }, [account])

  const handleNumber = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setErrorNumber('')
    const target = event.target
    const value = safeToFixed(target.value, game?.settings?.digits || 2)
    if (!value) {
      setErrorNumber('Your prediction is invalid')
      setNumber('')
      return
    }

    if (Number(value) > 100000) {
      setErrorNumber('Your prediction is too large')
    }

    if (Number(value) < 0) {
      setNumber(`${Math.abs(Number(value))}`)
      return
    }

    setNumber(value)
  }, [game])

  const disabled = useMemo(() => {
    return ended || !!recordsMine?.[0]
  }, [ended, recordsMine])

  const [submitting, setSubmitting] = useState(false)
  const submit = useCallback(() => {
    if (disabled) {
      return
    }

    if (submitting) {
      return
    }

    if (!number) {
      toast.error('Please enter your prediction')
      return
    }

    if (errorNumber) {
      toast.error(errorNumber)
      return
    }

    setSubmitting(true)
    signMessage().then(data => {
      if (!data) {
        return
      }

      const signature = data.toString()
      return fetcher(`${API_BASE_URL}/gaming/games/${game.id}/records`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          wallet_address: account,
          wallet_signature: signature,
          answer: number
        })
      })
        .then(data => {
          if (data.error) {
            toast.error(`Error: ${data.error}`)
            return
          }

          loadRecordsMine()
        })
        .catch(err => {
          toast.error('Error occurred')
          console.debug(err)
        })
    }).catch(err => {
      console.debug(err)
      toast.error('Could not sign the authentication message')
    }).finally(() => {
      setSubmitting(false)
    })
  }, [number, errorNumber, signMessage, account, game.id, loadRecordsMine, disabled, submitting])

  const won = useMemo(() => {
    return !!winners?.length && !!winners.find(x => x.wallet?.toLowerCase() === account?.toLowerCase())
  }, [winners, account])
  const rewardsEach = useCallback((index: number) => {
    if (!winners?.length) {
      return []
    }

    return game.settings?.rewards?.map((reward) => {
      if (!reward?.amount) {
        return null
      }

      if (reward.token) {
        const amount = Math.round(reward.amount / winners?.length)
        return `${amount} ${plural(reward.token || reward.reward, amount)}`
      }

      if (reward.amount < index + 1) {
        return null
      }

      const amount = 1
      return `${amount} ${plural(reward.token || reward.reward, amount)}`
    }).filter(x => !!x) || []
  }, [game, winners])

  const [modalWinners, setModalWinners] = useState(false)
  const [modalRules, setModalRules] = useState(false)

  return <div className="mt-10 sm:mt-20">
    <div className="bg-black/50 relative sm:min-h-[250px] rounded-lg z-0">
      <div className="absolute w-full h-full overflow-hidden rounded-lg z-[-1]">
        <div className="absolute bg-[#FF8A00] w-64 h-64 rounded-full blur-2xl -top-32 -left-32 bg-opacity-[15%]"></div>
      </div>
      <div className="hidden xl:block absolute right-3 bottom-[-11%]">
        <Image src={imgRocket} alt={game.name} />
      </div>
      <div className="sm:absolute flex flex-col sm:flex-row items-center w-full h-full xl:pr-72">
        <div className="flex-1 font-casual p-6 sm:p-8 sm:py-0 sm:border-r sm:border-white/10 w-full">
          <div className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-rose-400">
            <h2 className="text-4xl font-bold">ROI</h2>
            <h3 className="text-3xl uppercase">Prediction</h3>
          </div>
          <div className="text-white/90 text-base">Guess the highest ROI to earn exclusive rewards <GameDetailsRewards game={game}></GameDetailsRewards></div>
          <p className="text-xs mt-4">
            <a href={`#/${game.id}`} className="text-gamefiGreen-500 hover:underline inline-flex" onClick={() => { setModalRules(true) }}>
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>
        </div>

        <div className="flex-1 w-full sm:flex-none sm:w-80 p-6 sm:p-8 sm:py-0 font-casual">
          {!ended && <><p className="text-sm text-white/80 uppercase">Ends in</p>
            <div className="text-base font-medium">
              {countdown.days ? formatNumber(countdown.days, 2) : '00'}d : {countdown.hours ? formatNumber(countdown.hours, 2) : '00'}h : {countdown.minutes ? formatNumber(countdown.minutes, 2) : '00'}m : {countdown.seconds ? formatNumber(countdown.seconds, 2) : '00'}s
            </div></>}

          {ended && !game.answer && <><p className="text-sm text-white/80 uppercase">Result snapshot</p>
            <div className="text-base font-medium">
              {format(snapshot, 'yyyy-MM-dd HH:mm:ss')}
            </div></>}

          {ended && game.answer && <div className="flex justify-between">
            <div>
              <p className="text-sm text-white/80 uppercase">Result</p>
              <div className="text-base font-medium">
                {game.answer}
              </div>
            </div>
            <div onClick={() => { setModalWinners(true) }}>
              <p className="text-sm text-white/80 uppercase">Winners</p>
              <div className="text-base font-medium hover:underline cursor-pointer">
                {winners?.length ? `${winners?.length} winner(s)` : 'To be updated'}
              </div>
            </div>
          </div>}

          <p className="text-sm text-white/80 uppercase mt-6">Your prediction</p>
          {!account && <div className="text-base font-medium text-rose-500">
            Please connect your wallet
          </div>}

          {account && recordsMine === null && <div className="text-base font-medium">
            Loading...
          </div>}

          {account && recordsMine !== null && endedNotJoined && <div className="text-base font-medium text-[#DE4343]">
            You did not join this game
          </div>}

          {account && recordsMine !== null && !endedNotJoined && <>
            {!winners?.length && <>
              <div className="relative mt-1">
                {earnStake === null && <div className="text-base font-medium">
                  Loading...
                </div>}
                {earnStake !== null && !validRank && !validEarn && <div className="text-base font-medium text-[#DE4343] hover:underline">
                  <Link href="/earn" passHref><a href="#">Stake <span className="hidden sm:inline">at least</span> 1 $GAFI in <span className="inline-flex justify-center items-center">Earn
                    <svg className="ml-1 inline w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 16H16.7C16.8657 16.6579 16.955 17.3327 16.966 18.011C16.9631 18.2743 16.8565 18.5258 16.6692 18.711C16.482 18.8962 16.2293 19 15.966 19H7V17H15C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H7C5.8 11.289 3.305 11 2.1 11H0V19.5L8.192 23.263C9.19998 23.7665 10.3631 23.8625 11.44 23.531L24 19.667C24 19.667 23.208 16 20 16Z" fill="currentColor" />
                      <path d="M15 0C13.8133 0 12.6533 0.351894 11.6666 1.01118C10.6799 1.67047 9.91085 2.60754 9.45673 3.7039C9.0026 4.80026 8.88378 6.00666 9.11529 7.17054C9.3468 8.33443 9.91825 9.40353 10.7574 10.2426C11.5965 11.0818 12.6656 11.6532 13.8295 11.8847C14.9933 12.1162 16.1997 11.9974 17.2961 11.5433C18.3925 11.0892 19.3295 10.3201 19.9888 9.33342C20.6481 8.34673 21 7.18669 21 6C20.9984 4.40919 20.3658 2.88399 19.2409 1.75911C18.116 0.63424 16.5908 0.00158843 15 0V0ZM16 9H14V3H16V9Z" fill="currentColor" />
                    </svg></span> to join</a></Link>
                </div>}
                {earnStake !== null && (validRank || validEarn) && <div>
                  <input type="number" className="hide-spin text-base bg-white/10 rounded-sm clipped-t-r-sm w-full border-transparent px-3 pr-24 py-2 block shadow-lg focus:ring-0 focus:shadow-none focus:border-transparent" placeholder="E.g. x5, x11.8" disabled={disabled} value={recordsMine?.[0]?.answer || number} onChange={handleNumber} />
                  <button className={`font-[13px] font-mechanic uppercase font-bold absolute right-1.5 top-[50%] -translate-y-1/2 rounded-sm clipped-t-r-sm  block text-sm px-4 py-1 ${disabled ? 'text-white/40 bg-gamefiDark-500/50 cursor-not-allowed' : 'text-black cursor-pointer bg-gradient-to-br from-amber-400 via-amber-400 to-rose-400'}`} onClick={() => { submit() }}>Submit</button>
                </div>
                }
              </div>
              <p className="mt-1 text-xs uppercase text-white/80">Result snapshot: {format(snapshot, 'yyyy-MM-dd HH:mm:ss')}</p>
            </>}
            { winners?.length && <div className="text-base font-medium">
              {recordsMine?.[0]?.answer || ''}
            </div> }
            {!!winners?.length && won && <div className="text-base font-medium text-gamefiGreen-500">
              Congratulations. You won!
            </div>}
            {!!winners?.length && !won && <div className="text-base font-medium text-[#DE4343]">
              Your prediction is not correct
            </div>}
            <p className="text-xs mt-1">
              {recordsMine?.[0] && won && <span className="text-white/60">Reward Distribution: <strong>{game?.settings?.distribution}</strong></span>}
              {recordsMine?.[0] && winners?.length && !won && <span className="text-white/60">Good luck next time!</span>}
              {errorNumber ? <span className="text-[#DE4343]">{errorNumber}</span> : <span>&nbsp;</span>}
            </p>
          </>}
        </div>
      </div>
    </div>

    <Modal show={modalRules} toggle={x => setModalRules(x)} className='dark:bg-transparent fixed z-50 sm:!max-w-2xl'>
      <div className="bg-gamefiDark-700">
        <div className="p-4 xl:p-6 2xl:p-7 pt-11 font-casual w-full text-white/90 leading-normal">
          <strong className="uppercase text-2xl font-mechanic mt-4 mb-6 block text-white">ROI Prediction</strong>
          <p className="mb-4">
            Predict highest ROI in a time-frame to win rewards. It&#39;s free to play for all users who meet any of these requirements
          </p>
          <ul className="mb-4 font-semibold">
            <li>
              - Are Rookies or above
            </li>
            <li>
              - Stake at least 1 GAFI in the Earn pool
            </li>
          </ul>
          <p className="mb-4">
            ROI = <strong className="font-semibold">Highest price / sale price</strong><br />
            E.g. In 24 hours after TGE<br />
            <strong className="font-semibold">- Sale price = $0.005</strong> <br />
            <strong className="font-semibold">- Highest price = $0.123456</strong><br />
            The correct answer will be <strong className="font-semibold">24.69</strong> (24.6912 - 2 digits rounding)
          </p>
          <p className="mb-4">Predictions must be done before TGE.</p>
          {game?.description && <p className="mb-4">{game.description}</p>}
          <p className="mb-4">If no one gives correct answer, 10 closest answers will be selected based on submission time. If there are more than one winner, rewards will be equally shared among them.</p>
          <p className="mb-4">There might be difference of prices between exchanges or snapshot times, GameFi.org decision will be the final decision.</p>
        </div>
      </div>
    </Modal>

    <Modal show={modalWinners} toggle={x => setModalWinners(x)} className='dark:bg-transparent fixed z-50 sm:!max-w-2xl'>
      <div className="bg-gamefiDark-700">
        <div className="p-4 xl:p-6 2xl:p-7 pt-11 font-casual w-full">
          <strong className="uppercase text-2xl font-mechanic mb-6 block">ROI Prediction Winners</strong>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="min-w-full mb-2">
                <thead className="border-b">
                  <tr>
                    <th scope="col" className="text-sm pr-4 py-2 text-left font-semibold">
                      Wallet
                    </th>
                    <th scope="col" className="text-sm px-4 py-2 text-left font-semibold">
                      Prediction
                    </th>
                    <th scope="col" className="text-sm px-4 py-2 text-left font-semibold">
                      Rewards
                    </th>
                    <th scope="col" className="text-sm pl-4 py-2 text-left font-semibold">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {winners?.map((winner, i) => <tr key={winner.wallet} className={i < winners.length - 1 ? 'border-b border-white/30' : ''}>
                    <td className="text-sm pr-4 py-2 whitespace-nowrap font-medium">
                      {shortenAddress(winner.wallet, '*', 6, 4)}
                    </td>
                    <td className="text-sm px-4 py-2 whitespace-nowrap">
                      {winner.answer}
                    </td>
                    <td className="text-sm px-4 py-2 whitespace-nowrap">
                      {rewardsEach(i).join(' + ')}
                    </td>
                    <td className="text-sm pl-4 py-2 whitespace-nowrap">
                      {format(new Date(winner.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
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
