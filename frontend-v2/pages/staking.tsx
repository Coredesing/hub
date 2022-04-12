import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Layout from '@/components/Layout'
import imgNA from '@/assets/images/ranks/na.png'
import { API_BASE_URL } from '@/utils/constants'
import { fetcher, printNumber, safeToFixed, shortenAddress } from '@/utils'
import ABIERC20 from '@/components/web3/abis/ERC20.json'
import { useWeb3Default, GAFI } from '@/components/web3'
import { Contract, BigNumber, utils } from 'ethers'
import { useAppContext } from '@/context'
import { useMyWeb3 } from '@/components/web3/context'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import TabStake from '@/components/Pages/Staking/TabStake'
import TabUnstake from '@/components/Pages/Staking/TabUnstake'
import Ranks from '@/components/Pages/Staking/Ranks'
import TopRanking from '@/components/Pages/Staking/TopRanking'
import { handleChangeStaking } from '@/components/Pages/Staking/utils'
import CountdownSVG from '@/components/Pages/Aggregator/Countdown'
import { format } from 'date-fns'
import imgLegend from '@/assets/images/ranks/legend.png'

const Staking = ({ legendSnapshots, legendCurrent }) => {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const { tierMine, stakingMine, stakingPool, contractStaking, contractStakingReadonly } = useAppContext()

  const [totalStaked, setTotalStaked] = useState<BigNumber | null>(null)
  const totalStakedNumber = useMemo(() => {
    if (totalStaked === null) {
      return 0
    }

    return parseFloat(utils.formatUnits(totalStaked, GAFI.decimals))
  }, [totalStaked])

  const { library: libraryDefault } = useWeb3Default()
  const { account } = useMyWeb3()
  const contractGAFIReadonly = useMemo(() => {
    if (!libraryDefault) {
      return null
    }

    return new Contract(GAFI.address, ABIERC20, libraryDefault)
  }, [libraryDefault])

  const [pendingWithdrawal, setPendingWithdrawal] = useState({
    amount: null,
    time: null
  })

  const loadMyPending = useCallback(() => {
    if (!account || !stakingPool) {
      setPendingWithdrawal({
        time: 0,
        amount: 0
      })
      return
    }

    if (!contractStakingReadonly) {
      setPendingWithdrawal({
        time: 0,
        amount: 0
      })
      return
    }

    setPendingWithdrawal({
      time: null,
      amount: null
    })

    contractStakingReadonly.linearPendingWithdrawals(stakingPool.pool_id, account).then(x => {
      if (!mounted.current) {
        return
      }

      const time = x.applicableAt.toNumber()
      const amount = x.amount

      if (!time) {
        setPendingWithdrawal({
          time: 0,
          amount: 0
        })
        return
      }

      setPendingWithdrawal({
        time: new Date(time * 1000),
        amount
      })
    }).catch(err => {
      console.debug(err)
      setPendingWithdrawal({
        time: 0,
        amount: 0
      })
    })
  }, [account, contractStakingReadonly, stakingPool, setPendingWithdrawal, mounted])

  useEffect(() => {
    if (!contractGAFIReadonly) {
      setTotalStaked(null)
      return
    }

    if (!stakingPool?.pool_address) {
      return
    }

    contractGAFIReadonly.balanceOf(stakingPool.pool_address).then(x => {
      if (!mounted.current) {
        return
      }

      setTotalStaked(x)
    })
  }, [contractGAFIReadonly, stakingPool, mounted])

  useEffect(() => {
    loadMyPending()
  }, [loadMyPending])

  const [tab, setTab] = useState(0)
  const router = useRouter()
  useEffect(() => {
    if (router.query.u !== undefined) {
      setTab(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [rankingSelected, setRankingSelected] = useState()
  const [isLive, setIsLive] = useState(null)
  const rankingOptions = useMemo(() => {
    let all = (legendSnapshots || []).sort((a, b) => b.snapshot_at - a.snapshot_at).map(s => {
      return {
        key: s.id,
        label: s.name,
        value: s.top.map(x => ({ ...x, snapshot_at: x.snapshot_at ? new Date(x.snapshot_at * 1000) : null, wallet_address: shortenAddress(x.wallet_address, '*', 14, 13) }))
      }
    })

    if (legendCurrent) {
      all = [{
        key: 0,
        label: 'Realtime',
        value: legendCurrent.map(x => ({ wallet_address: x.wallet_address, amount: parseFloat(x.amount), snapshot_at: x.last_time ? new Date(x.last_time * 1000) : null }))
      }, ...all]
    }

    return all
  }, [legendSnapshots, legendCurrent])
  useEffect(() => {
    if (!rankingSelected) {
      const selected = handleChangeStaking(rankingOptions, rankingOptions?.[0], account)
      setRankingSelected(selected?.value)
    }

    if (isLive === null) {
      setIsLive(!rankingOptions?.[0]?.key)
    }
  }, [rankingOptions, rankingSelected, isLive, account])

  const timezone = useMemo(() => format(new Date(), 'OOOO'), [])
  const [dataAuction, setDataAuction] = useState<{ limit: number; top: { amount: number; wallet_address: string; last_time: number; lastTime?: Date }[] } | null>(null)
  const [deadlineAuction, setDeadlineAuction] = useState<Date | null>(null)
  const rankingAuction = useMemo(() => {
    if (!dataAuction?.top) {
      return
    }

    return dataAuction?.top.map(x => {
      x.lastTime = new Date(Number(x.last_time) * 1000)
      return x
    })
  }, [dataAuction])
  useEffect(() => {
    fetcher(`${API_BASE_URL}/staking-pool/top-staked`).then(data => {
      if (data?.status !== 200 || !data?.data) {
        return
      }

      const endTime = new Date(Number(data?.data?.end_time) * 1000)
      if (!endTime.getTime()) {
        return
      }

      if (data?.data.disable) {
        return
      }

      try {
        const { limit, top } = data.data

        setDeadlineAuction(endTime)
        setDataAuction({
          limit: Number(limit),
          top
        })
      } catch (err) {
        console.debug(err)
      }
    })
  }, [])

  return (
    <Layout title="GameFi.org - Staking">
      <div className="px-2 lg:px-16 mx-auto lg:block max-w-7xl pb-4">
        <div className="p-px bg-gradient-to-r from-gamefiDark-500 via-gamefiDark-800 rounded">
          <div className="bg-gradient-to-r from-gamefiDark-700 via-gamefiDark-900 to-gamefiDark-900 rounded flex">
            <div className="py-1 px-1 md:px-10 sm:px-2 pl-1 sm:pl-2 md:pl-4 flex-1 md:flex-initial flex items-center border-r border-gamefiDark-500">
              {(!account || !tierMine) && <img src={imgNA.src} className="hidden md:block w-20 mr-2" alt="No Rank" />}
              {account && tierMine && <div className="hidden md:block w-20 mr-1 md:mr-2"> <Image src={tierMine.image} layout='responsive' objectFit='contain' alt={tierMine.name} /> </div>}
              <div>
                <span className="font-bold text-xs md:text-sm uppercase text-white opacity-50">Current Rank</span>
                {!account && <p className="sm:font-casual font-medium text-xs md:text-sm text-gamefiGreen-500 leading-6">Connect Wallet</p>}
                {account && <p className="font-semibold text-lg md:text-2xl text-white leading-6">{tierMine ? tierMine.name : 'Loading...'}</p>}
              </div>
            </div>
            <div className="px-1 md:px-10 sm:px-2 flex-1 md:flex-initial flex items-center border-r border-gamefiDark-600">
              <div>
                <span className="font-bold text-xs md:text-sm uppercase text-white opacity-50">Your Stake</span>
                {!account && <p className="sm:font-casual font-medium text-xs md:text-sm text-gamefiGreen-500 leading-6">Connect Wallet</p>}
                {account && <p className="font-semibold text-lg md:text-2xl text-white leading-6">{stakingMine?.tokenStaked !== undefined ? safeToFixed(stakingMine?.tokenStaked, 4) : 'Loading...'}</p>}
              </div>
            </div>
            <div className="px-1 md:px-10 sm:px-2 flex-1 md:flex-initial flex items-center border-r border-gamefiDark-700">
              <div>
                <span className="font-bold text-xs md:text-sm uppercase text-white opacity-50"><span className="hidden sm:inline">$GAFI Left To</span> Next Rank</span>
                {!account && <p className="sm:font-casual font-medium text-xs md:text-sm text-gamefiGreen-500 leading-6">Connect Wallet</p>}
                {account && <p className="font-semibold text-lg md:text-2xl text-white leading-6">{stakingMine?.nextTokens !== null ? safeToFixed(stakingMine?.nextTokens, 4) : 'Loading...'}</p>}
              </div>
            </div>
            <div className="px-1 md:px-10 sm:px-2 flex-1 md:flex-initial flex items-center">
              <div>
                <span className="font-bold text-xs md:text-sm uppercase text-white opacity-50">Total <span className="hidden sm:inline">$GAFI</span> Staked</span>
                <p className="font-semibold text-lg md:text-2xl text-white leading-6">{totalStaked === null ? 'Loading...' : totalStakedNumber.toLocaleString('en-US', undefined)}</p>
              </div>
            </div>
          </div>
        </div>

        <Ranks />

        { deadlineAuction && <div className="mt-2 md:mt-10 py-8 border-t border-gamefiDark-650">
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div>
              <div className="font-bold text-lg md:text-3xl uppercase">Legend Auction</div>
              <ul className="font-casual text-sm list-disc pl-4">
                <li>Top <strong>{dataAuction?.limit} competitor(s)</strong> will be rewarded with Legend NFT(s)</li>
                <li>Ranking will be updated every minute and will be finalized after review</li>
              </ul>
            </div>
            <div className="max-w-full w-96 sm:w-1/4 flex-none">
              <CountdownSVG title="AUCTION ENDS IN" deadline={deadlineAuction}></CountdownSVG>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className="mt-4 w-full">
              <thead>
                <tr>
                  <th scope="col" className="p-2 sm:p-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left sm:w-24">
                    Rank
                  </th>
                  <th scope="col" className="p-2 sm:p-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left">
                    Wallet <span className="hidden sm:inline">Address</span>
                  </th>
                  <th scope="col" className="p-2 sm:p-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left">
                    Amount <span className="hidden sm:inline">{GAFI.symbol}</span>
                  </th>
                  <th scope="col" className="p-2 sm:p-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left">
                    Last Staking ({timezone})
                  </th>
                </tr>
              </thead>
              <tbody>
                {(rankingAuction || []).map((x, index) => <tr key={index} className={`border-b border-gamefiDark-600 font-casual ${index < dataAuction?.limit ? 'bg-gamefiDark-630 border-gamefiGreen-700/10' : ''}`}>
                  <td className="p-2 sm:p-4 text-sm flex items-center justify-between sm:w-24">
                    <div className="leading-none font-mechanic text-lg sm:text-xl w-4 text-center font-bold">{index + 1}</div>
                    { index < dataAuction?.limit && <div className="w-10 h-10 relative">
                      <Image src={imgLegend} layout="fill" alt="legend"></Image>
                    </div> }
                  </td>
                  <td className="p-2 sm:p-4 text-sm whitespace-nowrap break-all md:w-auto w-12">
                    <span className="hidden sm:inline">{shortenAddress(x.wallet_address, '.', 10, 5)}</span>
                    <span className="sm:hidden">{shortenAddress(x.wallet_address, '.', 5, 3)}</span>
                  </td>
                  <td className="p-2 sm:p-4 text-sm whitespace-nowrap">
                    {printNumber(x.amount)}
                  </td>
                  <td className="p-2 sm:p-4 text-sm">
                    <span>{x.lastTime ? format(x.lastTime, 'yyyy/MM/dd') : '—'}</span>
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div> }

        <Tabs
          titles={[
            'Stake',
            'Unstake',
            'Legendary Ranking'
          ]}
          currentValue={tab}
          onChange={setTab}
          className="mt-2 sm:mt-6 lg:mt-10 sticky top-0 bg-gamefiDark-900 z-50"
        />

        <div>
          <TabPanel value={tab} index={0}>
            <TabStake {...{ contractStaking, stakingMine, loadMyPending, pendingWithdrawal }} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <TabUnstake {...{ contractStaking, stakingMine, loadMyPending, pendingWithdrawal, goStake: () => { setTab(0) } }} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            {<TopRanking isLive={isLive} rankings={rankingSelected} />}
          </TabPanel>
        </div>
      </div>
    </Layout>
  )
}

export default Staking

export async function getStaticProps () {
  const [legendSnapshots, legendCurrent] = await Promise.all([
    fetcher(`${API_BASE_URL}/staking-pool/legend-snapshots`),
    fetcher(`${API_BASE_URL}/staking-pool/legend-current`)
  ])

  return {
    props: {
      legendSnapshots: legendSnapshots?.data || null,
      legendCurrent: legendCurrent?.data || null
    },
    revalidate: 60
  }
}
