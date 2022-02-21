import { useMyWeb3 } from '@/components/web3/context'
import { useAppContext } from '@/context/index'
import { shortenAddress } from '@/utils'
import { ObjectType } from '@/utils/types'
import clsx from 'clsx'
import { BigNumber, utils } from 'ethers'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import FilterDropdown from '../Home/FilterDropdown'
import Ranks from '../Staking/Ranks'
import TopRanking from '../Staking/TopRanking'
import { handleChangeStaking } from '../Staking/utils'
import styles from './Rank.module.scss'

const Rank = ({ data }) => {
  const router = useRouter()
  const { account } = useMyWeb3()
  const { tiers, $tiers } = useAppContext()
  useEffect(() => {
    $tiers.actions.getUserTier(account)
  }, [account])
  useEffect(() => {
    tiers.actions.setConfigs(data.tierConfigs)
  }, [data])

  const myRank = useMemo(() => {
    const currentTier = $tiers.state?.data || {}
    const tiersConfig = tiers.state?.all || []
    const noTier = (currentTier?.tier || 0)
    const tokenStaked = +currentTier?.tokenStaked || 0
    const me = tiersConfig.find(t => t.id === noTier) || {}
    const requireNextRank: ObjectType = {}
    if (tiersConfig.length) {
      const nextTier = tiersConfig.find(t => t.id === (noTier + 1))
      if (!nextTier) {
        requireNextRank.requirementNextTier = 0
      } else if (nextTier.config.requirement) {
        requireNextRank.requirementNextTier = nextTier.config.requirement
      } else {
        const nextAmount = utils.parseEther(String(nextTier.config.tokens)).toString()
        const currentAmount = utils.parseEther(tokenStaked.toString())
        requireNextRank.requirementNextTier = `${+utils.formatEther(BigNumber.from(nextAmount).sub(BigNumber.from(currentAmount)))} GAFI`
      }
    }
    return { ...me, ...currentTier, ...requireNextRank }
  }, [$tiers, tiers.state?.all])

  const [rankingSelected, setRankingSelected] = useState<ObjectType[]>()
  const [isLive, setIsLive] = useState(null)
  const rankingOptions = useMemo(() => {
    let all = (data?.legendSnapshots || []).sort((a, b) => b.snapshot_at - a.snapshot_at).map(s => {
      return {
        key: s.id,
        label: s.name,
        value: s.top.map(x => ({ ...x, snapshot_at: x.snapshot_at ? new Date(x.snapshot_at * 1000) : null, wallet_address: shortenAddress(x.wallet_address, '*', 14, 13) }))
      }
    })

    if (data?.legendCurrent) {
      all.unshift({
        key: 0,
        label: 'Realtime',
        value: data.legendCurrent.map(x => ({ wallet_address: x.wallet_address, amount: parseFloat(x.amount), snapshot_at: x.last_time ? new Date(x.last_time * 1000) : null }))
      })
    }
    return all
  }, [data])
  

  useEffect(() => {
    if (!rankingSelected) {
      const selected = handleChangeStaking(rankingOptions, rankingOptions?.[0], account)
      setRankingSelected(selected.value)
    }

    if (isLive === null) {
      setIsLive(!rankingOptions?.[0]?.key)
    }
  }, [rankingOptions, rankingSelected, isLive, account])
  const handleRankingOption = (item: any) => {
    setIsLive(!item?.key)
    const selected = handleChangeStaking(rankingOptions, item, account)
    setRankingSelected(selected?.value)
  }

  return (
    <div className='py-10 px-9'>
      <div className='flex items-center justify-between'>
        <h3 className='hidden lg:block uppercase font-bold text-2xl mb-7'>My Rank</h3>
      </div>
      {/* <div className='w-full h-96 flex items-center justify-center'>
        <h1 className='text-6xl uppercase font-bold'>Coming Soon</h1>
      </div> */}
      <div>
        <div className={styles.myRank}>
          <div className={clsx(styles.boxRadient, 'rounded')}>
            <div className='rounded w-full h-full flex items-center gap-4'>
              {myRank.image && <Image src={myRank.image} width={60} height={60} className='object-cover' />}
              <div>
                <span className='uppercase text-13px text-white/50 font-bold block'>Current Rank</span>
                <span className='text-2xl block font-medium'>{myRank.name}</span>
              </div>
            </div>
          </div>
          <div className={clsx(styles.boxRadient, 'rounded')}>
            <div className='rounded w-full h-full gap-3 flex items-center flex-col sm:flex-row'>
              <div className='w-full flex flex-col justify-center'>
                <span className='uppercase text-13px text-white/50 font-bold block'>Current Staked</span>
                <span className='text-2xl block font-medium'>{+myRank.tokenStaked || 0} GAFI</span>
              </div>
              <div className='w-full flex flex-col justify-center'>
                <span className='uppercase text-13px text-white/50 font-bold block'>$GAFI LEFT TO NEXT RANK</span>
                <span className='text-2xl block font-medium'>{myRank.requirementNextTier}</span>
              </div>
              <div className='w-full flex items-center gap-1'>
                <button
                  onClick={() => router.push('/staking')}
                  className={clsx(
                    styles.btnUnstake,
                    'p-px h-9 cursor-pointer bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700 rounded-sm',
                  )}>
                  <div className={'py-2 px-5 bg-gamefiDark-900 text-13px flex justify-center items-center rounded-sm font-bold uppercase'}>
                    Unstake
                  </div>
                </button>

                <button
                  onClick={() => router.push('/staking')}
                  className={clsx(styles.btnStakeMore, 'bg-gamefiGreen-700 py-2 px-5 text-black uppercase font-bold text-13px h-9 rounded-sm')}>Stake More</button>
              </div>
            </div>
          </div>
        </div>
        <Ranks />
        <div>
          <div className="md:text-lg 2xl:text-2xl uppercase font-bold flex mt-6 items-center">
            <span className="mr-2">Ranking</span><FilterDropdown items={rankingOptions} selected={rankingSelected} onChange={handleRankingOption}></FilterDropdown>
          </div>
          <TopRanking isLive={isLive} rankings={rankingSelected} />
        </div>
      </div>
    </div>
  )
}

export default Rank
