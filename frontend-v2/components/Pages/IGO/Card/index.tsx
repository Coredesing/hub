import React, { useContext, useMemo } from 'react'
import { Item } from '../type'
import Image from 'next/image'
import community from 'assets/images/icons/community.png'
import lock from 'assets/images/icons/lock.svg'
import { getCurrency, useLibraryDefaultFlexible } from '@/components/web3/utils'
import { ListIGOContext } from '@/pages/igo'
import Progress from './Progress'
import Countdown from './Countdown'

const Card = ({ item, color, background }: { item: Item; color?: string; background?:string }) => {
  const { network } = useLibraryDefaultFlexible(item?.network_available)
  const { now } = useContext(ListIGOContext)

  const poolStatus = (status: any) => {
    switch (status) {
    case 1:
      return {
        title: 'private',
        icon: lock
      }
    case 3:
      return {
        title: 'community',
        icon: community
      }
    case 0:
    default:
      return {
        title: 'public',
        icon: lock
      }
    }
  }

  const poolClaimTime = useMemo(() => {
    const start = item?.campaignClaimConfig?.[0]?.finish_time ? new Date(Number(item?.campaignClaimConfig?.[0]?.finish_time) * 1000) : undefined
    return {
      start
    }
  }, [item])

  const isClaimTime = useMemo(() => {
    return poolClaimTime.start <= now
  }, [poolClaimTime, now])

  return <div className={`bg-${background} w-full flex flex-col font-casual hover:opacity-90`}>
    <a href={`/igo/${item.id}`} className="w-full aspect-[16/9] bg-black relative">
      <img src={item?.banner} alt="" className="object-cover w-full h-full"></img>
      <div className={`absolute h-6 w-2/5 inline-flex align-middle items-center -top-[1px] -left-[1px] uppercase text-xs text-left bg-${color} clipped-b-r-full`}>
        <Image src={poolStatus(item.is_private).icon} alt="lock"></Image>
        <span className="ml-2 font-medium tracking-widest">{poolStatus(item.is_private).title}</span>
      </div>
      {/* <div className="absolute py-1 px-3 border-[1px] rounded-sm inline-flex gap-1 align-middle items-center top-1 right-1 uppercase text-xs text-left bg-black opacity-60">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_4_2212)">
            <path d="M6 0C4.81331 0 3.65328 0.351894 2.66658 1.01118C1.67989 1.67047 0.910851 2.60754 0.456726 3.7039C0.00259972 4.80026 -0.11622 6.00666 0.115291 7.17054C0.346802 8.33443 0.918247 9.40353 1.75736 10.2426C2.59648 11.0818 3.66558 11.6532 4.82946 11.8847C5.99335 12.1162 7.19975 11.9974 8.2961 11.5433C9.39246 11.0892 10.3295 10.3201 10.9888 9.33342C11.6481 8.34673 12 7.18669 12 6C11.9954 4.41012 11.3618 2.88668 10.2375 1.76246C9.11332 0.638241 7.58988 0.00461698 6 0V0ZM5 8.707L2.293 6L3 5.293L5 7.293L9 3.293L9.707 4L5 8.707Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_4_2212">
              <rect width="12" height="12" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        Joined
      </div> */}
    </a>
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <div className="w-5/6 overflow-hidden text-ellipsis whitespace-nowrap uppercase font-semibold hover:underline xl:text-lg">
          <a href={`/igo/${item.id}`} className="w-full overflow-hidden text-ellipsis">{item.title}</a>
        </div>
        <div className="w-6 h-6 xl:w-8 xl:h-8"><Image src={network?.image} alt=""></Image></div>
      </div>
      <div className="inline-flex gap-5">
        { item?.website && <a href={item?.website} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="currentColor"/>
          </svg>
        </a> }

        { item?.socialNetworkSetting?.telegram_link && <a href={item?.socialNetworkSetting?.telegram_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
          <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="currentColor"/>
          </svg>
        </a> }

        { item?.socialNetworkSetting?.twitter_link && <a href={item?.socialNetworkSetting?.twitter_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
          <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="currentColor"/>
          </svg>
        </a> }

        { item?.socialNetworkSetting?.medium_link && <a href={item?.socialNetworkSetting?.medium_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="currentColor"/>
          </svg>
        </a> }
      </div>
      <div>
        <div className="text-white/50 uppercase font-medium text-xs">Rate</div>
        <div className="text-gamefiGreen uppercase font-medium text-sm">
          1 {item.symbol} = {item.token_conversion_rate} {getCurrency(item).symbol}
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <div>
          <div className="text-white/50 uppercase font-medium text-xs">Total Rise</div>
          <div className="text-sm">${Number(parseInt(item?.total_sold_coin) * parseFloat(item?.token_conversion_rate)).toLocaleString('en-US')}</div>
        </div>
        <div>
          <div className="text-white/50 uppercase font-medium text-xs">Participants</div>
          <div className="text-sm">{Number(10000).toLocaleString('en-US')}</div>
        </div>
      </div>
      {
        item.campaign_status?.toLowerCase() === 'swap' && <div className="mt-4">
          { item && <Progress poolData={item} isClaimTime={isClaimTime}></Progress>}
        </div>
      }
    </div>
    <div className="mt-2 border-t-[1px] border-white/10 py-4">
      {
        !item?.start_time && item.campaign_status?.toLowerCase() === 'tba' && <div className="w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Pool Starts In</div>
          <div className="mt-2 font-medium">TBA</div>
        </div>
      }
      {
        item.finish_time && item.campaign_status?.toLowerCase() === 'swap' && <div className="w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Swap Ends In</div>
          <div className="mt-2">
            <Countdown to={item?.finish_time}></Countdown>
          </div>
        </div>
      }
      {
        item.buy_type?.toLowerCase() === 'whitelist' &&
        item.campaign_status?.toLowerCase() === 'upcoming' &&
        now.getTime() >= new Date(Number(item.start_join_pool_time) * 1000).getTime() &&
        now.getTime() < new Date(Number(item.end_join_pool_time) * 1000).getTime() &&
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Whitelist Ends In</div>
          <div className="mt-2">
            <Countdown to={item?.end_join_pool_time}></Countdown>
          </div>
        </div>
      }
      {
        item.buy_type?.toLowerCase() === 'whitelist' &&
        item.campaign_status?.toLowerCase() === 'upcoming' &&
        now.getTime() < new Date(Number(item.start_join_pool_time) * 1000).getTime() &&
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Whitelist Starts In</div>
          <div className="mt-2">
            <Countdown to={item?.end_join_pool_time}></Countdown>
          </div>
        </div>
      }
      {now.getTime() > new Date(Number(item.end_join_pool_time) * 1000).getTime() &&
      now.getTime() <= new Date(Number(item.start_time) * 1000).getTime() &&
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Buying Phase Starts In</div>
          <div className="mt-2">
            <Countdown to={item?.start_time}></Countdown>
          </div>
        </div>
      }
    </div>
  </div>
}

export default Card
