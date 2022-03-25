import Layout from '@/components/Layout'
import { getTierById } from '@/utils/tiers'
import React, { useEffect, useMemo, useState, useCallback, createContext } from 'react'
import { fetchOneWithSlug } from '../api/igo'
import { useMyWeb3 } from '@/components/web3/context'
import { fetcher, printNumber, formatterUSD, formatPrice } from '@/utils'
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

export const IGOContext = createContext({
  poolData: null,
  whitelistJoined: false,
  whitelistStatus: null,
  now: null,
  signature: null,

  poolOver: false,

  failedRequirements: false,
  usd: null,
  hasFCFS: false,

  setSignature: (v: any) => { console.log(v) },
  loadJoined: () => {},
  setFailedRequirements: (v: any) => { console.log(v) }
})

const IGODetails = ({ poolData }) => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const [failedRequirements, setFailedRequirements] = useState(false)
  const hasFCFS = useMemo(() => {
    return poolData.freeBuyTimeSetting?.start_buy_time
  }, [poolData.freeBuyTimeSetting?.start_buy_time])

  const usd = useMemo(() => {
    return getCurrency(poolData)
  }, [poolData])

  const totalRaised = useMemo(() => {
    return parseInt(poolData?.total_sold_coin) * parseFloat(poolData?.token_conversion_rate)
  }, [poolData])

  const { account } = useMyWeb3()
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

  const poolOver = useMemo(() => {
    return poolClaimTime.start <= now
  }, [poolClaimTime, now])

  const poolHasWinners = useMemo(() => {
    return poolPreOrderTime.start <= now || poolBuyTime.start <= now || poolFreeBuyTime.start <= now || poolOver
  }, [poolPreOrderTime, poolBuyTime, poolFreeBuyTime, now, poolOver])

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

          poolOver,

          failedRequirements,
          usd,
          hasFCFS,

          setSignature,
          loadJoined,
          setFailedRequirements
        }}>
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
              <div className="mt-4">
                {
                  !poolData?.start_time && poolData.campaign_status?.toLowerCase() === 'tba' &&
                  <div className="w-full flex flex-col items-center justify-center bg-black rounded-sm py-2 px-4">
                    <div className="font-semibold text-2xl">Coming Soon</div>
                  </div>
                }
                {
                  poolData.buy_type?.toLowerCase() === 'whitelist' &&
                  poolData.campaign_status?.toLowerCase() === 'upcoming' &&
                  now.getTime() >= new Date(Number(poolData.start_join_pool_time || 0) * 1000).getTime() &&
                  now.getTime() <= new Date(Number(poolData.end_join_pool_time || 0) * 1000).getTime() &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title="Whitelist Ends In" to={poolData?.end_join_pool_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  poolData.buy_type?.toLowerCase() === 'whitelist' &&
                  poolData.campaign_status?.toLowerCase() === 'upcoming' &&
                  now.getTime() < new Date(Number(poolData.start_join_pool_time || 0) * 1000).getTime() &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title="Whitelist Starts In" to={poolData?.start_join_pool_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  now.getTime() > new Date(Number(poolData.end_join_pool_time || 0) * 1000).getTime() &&
                  now.getTime() < new Date(Number(poolData.start_time || 0) * 1000).getTime() &&
                  <div className="w-full">
                    <div className="mt-2">
                      {
                        now.getTime() < new Date(Number(poolData.start_pre_order_time || 0) * 1000).getTime()
                          ? <Countdown title="Pre-order Starts In" to={poolData?.start_time}></Countdown>
                          : <Countdown title="Phase 1 Starts In" to={poolData?.start_time}></Countdown>
                      }
                    </div>
                  </div>
                }
                {
                  hasFCFS &&
                  now.getTime() >= new Date(Number(poolData.start_time || 0) * 1000).getTime() &&
                  now.getTime() < new Date(Number(hasFCFS || 0) * 1000).getTime() &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title="Phase 1 Ends In" to={hasFCFS}></Countdown>
                    </div>
                  </div>
                }
                {
                  hasFCFS && now.getTime() >= new Date(Number(hasFCFS || 0) * 1000).getTime() &&
                  now.getTime() <= new Date(Number(poolData.finish_time || 0) * 1000).getTime() &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title="Phase 2 Ends In" to={poolData?.finish_time}></Countdown>
                    </div>
                  </div>
                }
                {
                  !hasFCFS &&
                  now.getTime() >= new Date(Number(poolData.start_time || 0) * 1000).getTime() &&
                  now.getTime() <= new Date(Number(poolData.finish_time || 0) * 1000).getTime() &&
                  <div className="w-full">
                    <div className="mt-2">
                      <Countdown title="Buy Phase Ends In" to={poolData?.finish_time}></Countdown>
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
                  'WINNERS'
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
                  <span>{poolData?.symbol}</span>
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
                      Start
                    </div>
                    <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                      End
                    </div>
                  </div>

                  <div className="table-row">
                    <div className="table-cell align-middle py-2 rounded">
                      Apply Whitelist
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolWhitelistTime.start ? format(poolWhitelistTime.start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolWhitelistTime.end ? format(poolWhitelistTime.end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                  </div>

                  <div className="table-row">
                    <div className="table-cell align-middle py-2 rounded">
                      Winner Announcement
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolWhitelistTime.end ? format(poolWhitelistTime.end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolPreOrderTime.start ? format(poolPreOrderTime.start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                  </div>

                  <div className="table-row">
                    <div className="table-cell align-middle py-2 rounded">
                      Pre-order (Min Tier: {preOrderMinTier.name})
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolPreOrderTime.start ? format(poolPreOrderTime.start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolPreOrderTime.end ? format(poolPreOrderTime.end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                  </div>

                  <div className="table-row">
                    <div className="table-cell align-middle py-2 rounded">
                      Buy Phase 1 - Guarantee
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolBuyTime.start ? format(poolBuyTime.start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolBuyTime.end ? format(poolBuyTime.end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                  </div>

                  <div className="table-row">
                    <div className="table-cell align-middle py-2 rounded">
                      Buy Phase 2 - FCFS
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolFreeBuyTime.start ? format(poolFreeBuyTime.start, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                    <div className="table-cell align-middle py-2 font-normal">
                      {poolFreeBuyTime.end ? format(poolFreeBuyTime.end, 'HH:mm, dd MMM yyyy') : 'TBA'}
                    </div>
                  </div>

                  <div className="table-row">
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
            { failedRequirements ? <div className="my-4 w-full bg-gamefiDark-630/30 p-7 rounded clipped-t-r text-center font-semibold text-lg font-casual">You do not meet the requirements!</div> : <Swap></Swap> }
          </TabPanel>
          <TabPanel value={tab} index={2}>
            { failedRequirements ? <div className="my-4 w-full bg-gamefiDark-630/30 p-7 rounded clipped-t-r text-center font-semibold text-lg font-casual">You do not meet the requirements! {failedRequirements}</div> : <Claim></Claim> }
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
