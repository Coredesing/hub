import Layout from '@/components/Layout'
import { fetchAll, PoolSubjects } from '@/pages/api/earn'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { BigNumber } from 'ethers'
import type { Pool } from '@/pages/api/earn'
import ContractPools from '@/components/Pages/Earn/ContractPools'
import { format, intervalToDuration } from 'date-fns'
import { formatNumber } from '@/utils'

export type PoolExtended = Pool & {
  totalCap?: BigNumber;
  staked?: BigNumber;
  totalCapParsed?: string;
  stakedParsed?: string;
  amountMin?: BigNumber;
  amountMinParsed?: string;
  remaining?: BigNumber;
  remainingParsed?: string;
  progress?: number;
  timeOpening?: Date;
  timeClosing?: Date;
  myPendingReward?: BigNumber;
  myPendingRewardParsed?: string;
  myStake?: BigNumber;
  myStakeParsed?: string;
}

const Earn = ({ pools: initPools }) => {
  const [pools] = useState(initPools)
  const poolsByContract = useMemo<Record<string, Pool[]>>(() => {
    return pools.reduce((acc, val) => {
      if (!val?.contractAddress) {
        return acc
      }

      const items = acc[val?.contractAddress]
      if (items) {
        items.push(val)
        return acc
      }

      acc[val?.contractAddress] = [val]
      return acc
    }, {})
  }, [pools])

  const [openSoon, setOpenSoon] = useState<boolean>(true)
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [setNow])
  const [deadlineSoon] = useState(new Date('2022-04-03T00:00:00Z'))
  const countdown = useMemo(() => {
    return intervalToDuration({
      start: now,
      end: deadlineSoon
    })
  }, [now, deadlineSoon])

  return <Layout title="GameFi Earn">
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
      <h1 className="uppercase font-bold text-4xl hidden">GameFi Earn</h1>
      <h3 className="font-medium text-xl mb-14 hidden">A Safe and Simple Way to Grow Your Digital Assets.</h3>
      <div className="mt-4 mb-14 mx-auto flex items-center justify-center max-w-[1128px]">
        <Image src={require('@/assets/images/earn/banner.png')} alt="" />
      </div>

      {Object.keys(poolsByContract).map(contractAddress => {
        const pools = (poolsByContract?.[contractAddress] || []).sort((a, b) => Number(a.lockDuration) - Number(b.lockDuration))
        return <ContractPools
          key={contractAddress}
          pools={pools}
          contractAddress={contractAddress}
          className="mb-4"
        ></ContractPools>
      })}
      <div className="rounded-sm overflow-hidden mb-4 relative">
        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-lg text-gamefiDark-100 font-semibold z-[1]">Coming Soon</div>
        <div className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 w-full md:items-center bg-gamefiDark-630/80 p-4 md:px-6 md:py-4 blur-[4px] opacity-30">
          <div className="flex justify-between">
            <div className="flex-none inline-flex items-center truncate w-[10rem]">
              <div className="w-10 h-10 rounded-full mr-3 bg-gamefiDark-200" />
              <span className="text-xl uppercase font-semibold tracking-wide font-casual">****</span>
            </div>
            <div className="min-w-[8rem]">
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">APR</p>
              <span className="text-base uppercase font-medium font-casual">TBA</span>
            </div>
            <div className="hidden sm:block min-w-[12rem]">
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Remaining Quota</p>
              <div className="text-base uppercase font-medium font-casual my-0.5">TBA</div>
            </div>
          </div>
          <div>
            <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-0.5">Lock-in term</p>
            { pools && <div className="flex text-[12px] gap-2 font-casual flex-wrap">
              <div className="px-2 py-1 rounded-sm border cursor-pointer">Flexible</div>
              <div className="px-2 py-1 rounded-sm border cursor-pointer">30 days</div>
              <div className="px-2 py-1 rounded-sm border cursor-pointer">60 days</div>
              <div className="px-2 py-1 rounded-sm border cursor-pointer">90 days</div>
            </div> }
          </div>
          <div className="ml-auto flex-none hidden xl:block">
            <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Applicable subjects</p>
            <span className="text-base font-casual">{PoolSubjects.OPEN_TO_ALL}</span>
          </div>
          <div className="md:ml-auto xl:ml-0 mt-auto md:mt-0 flex items-center md:justify-end justify-center min-w-[5rem] text-right">
            <div className="items-center justify-center rounded text-sm cursor-pointer inline-flex hover:text-gamefiGreen-500">
              { openSoon
                ? <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-sm overflow-hidden mb-8 relative">
        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-lg text-gamefiDark-100 font-semibold z-[1]">Coming Soon</div>
        <div className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 w-full md:items-center bg-gamefiDark-630/80 p-4 md:px-6 md:py-4 blur-[4px] opacity-30">
          <div className="flex justify-between">
            <div className="flex-none inline-flex items-center truncate w-[10rem]">
              <div className="w-10 h-10 rounded-full mr-3 bg-gamefiDark-200" />
              <span className="text-xl uppercase font-semibold tracking-wide font-casual">****</span>
            </div>
            <div className="min-w-[8rem]">
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">APR</p>
              <span className="text-base uppercase font-medium font-casual">TBA</span>
            </div>
            <div className="hidden sm:block min-w-[12rem]">
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Remaining Quota</p>
              <div className="text-base uppercase font-medium font-casual my-0.5">TBA</div>
            </div>
          </div>
          <div>
            <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-0.5">Lock-in term</p>
            { pools && <div className="flex text-[12px] gap-2 font-casual flex-wrap">
              <div className="px-2 py-1 rounded-sm border cursor-pointer">Flexible</div>
              <div className="px-2 py-1 rounded-sm border cursor-pointer">30 days</div>
              <div className="px-2 py-1 rounded-sm border cursor-pointer">60 days</div>
              <div className="px-2 py-1 rounded-sm border cursor-pointer">90 days</div>
            </div> }
          </div>
          <div className="ml-auto flex-none hidden xl:block">
            <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Applicable subjects</p>
            <span className="text-base font-casual">{PoolSubjects.OPEN_TO_ALL}</span>
          </div>
          <div className="md:ml-auto xl:ml-0 mt-auto md:mt-0 flex items-center md:justify-end justify-center min-w-[5rem] text-right">
            <div className="items-center justify-center rounded text-sm cursor-pointer inline-flex hover:text-gamefiGreen-500">
              { openSoon
                ? <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              }
            </div>
          </div>
        </div>
      </div>
      <p className="text-center font-casual text-sm text-white/60">More high-reward earning programs are coming. Stay tuned!</p>
    </div>
  </Layout>
}

export default Earn

export async function getStaticProps () {
  const pools = await fetchAll()
  return {
    props: {
      pools
    },
    revalidate: 60
  }
}
