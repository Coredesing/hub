import { useState, useMemo, useCallback, useEffect } from 'react'
import AppContext from './index'
import useTiersOld from './tiersOld'
import useMarketActivities, { useCollectionsMarket, useDiscoverMarket } from './market-activities'
import { TIERS, Tier } from '@/utils/tiers'
import { useMyWeb3 } from '@/components/web3/context'
import { useWeb3Default, GAFI } from '@/components/web3'
import ABIStakingPool from '@/components/web3/abis/StakingPool.json'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { Contract, utils } from 'ethers'

const useTiers = () => {
  const all = useMemo<Tier[]>(() => {
    return TIERS
  }, [])

  const priority = useMemo(() => {
    if (!all?.length) {
      return []
    }

    return all.filter(x => !x.config?.social)
  }, [all])

  return {
    all,
    priority
  }
}

const useTierMine = (tiers) => {
  const { library: libraryDefault } = useWeb3Default()
  const { library, account } = useMyWeb3()
  const [data, setData] = useState<{ id: number; tier: number; stakedInfo: { tokenStaked: string; uniStaked: string } } | null>(null)
  const [pool, setPool] = useState(null)

  const tier = useMemo(() => {
    if (!data || !tiers.all) {
      return null
    }

    console.log('looking up for user\'s tier', JSON.stringify(tiers.all.map(x => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, ...fields } = x
      return {
        ...fields
      }
    })), data.tier)

    return tiers.all.find(x => x.id === data.tier)
  }, [data, tiers])

  const contractStakingReadonly = useMemo(() => {
    if (!libraryDefault || !pool?.pool_address) {
      return null
    }

    return new Contract(pool.pool_address, ABIStakingPool, libraryDefault)
  }, [libraryDefault, pool])

  const contractStaking = useMemo(() => {
    if (!library || !pool?.pool_address) {
      return null
    }

    return new Contract(pool.pool_address, ABIStakingPool, library.getSigner())
  }, [library, pool])

  const loadMyStaking = useCallback(() => {
    if (!contractStakingReadonly) {
      setData(null)
      return
    }

    return Promise.allSettled([
      fetcher(`${API_BASE_URL}/user/tier-info?wallet_address=${account}`),
      contractStakingReadonly.linearStakingData(pool.pool_id, account).then(x => utils.formatUnits(x.balance, GAFI.decimals))
    ]).then((results) => {
      if (results[0]?.status !== 'fulfilled') {
        setData(null)
        return
      }

      const data = results[0]?.value?.data

      if (results[1]?.status !== 'fulfilled') {
        setData(data)
        return
      }

      if (data?.stakedInfo) {
        data.stakedInfo.tokenStaked = results[1]?.value
      }

      setData(data)
    })
  }, [account, setData, pool, contractStakingReadonly])
  useEffect(() => {
    loadMyStaking()
  }, [loadMyStaking])

  const tierNextTokens = useMemo<number | string>(() => {
    if (!data || !tiers.all || !tier) {
      return 0
    }

    const t = tiers.all.find(x => x.id === data.tier + 1)
    if (!t) {
      return 0
    }

    if (t?.config?.requirement) {
      return t?.config?.requirement
    }

    if (!data?.stakedInfo?.tokenStaked) {
      return 0
    }

    return parseFloat(t.config?.tokens) - parseFloat(data?.stakedInfo?.tokenStaked)
  }, [data, tiers, tier])

  return {
    pool,
    tier,
    staking: {
      ...data?.stakedInfo,
      nextTokens: tierNextTokens
    },
    setPool,
    loadMyStaking,
    contractStaking,
    contractStakingReadonly
  }
}

const AppProvider = (props: any) => {
  const $tiers = useTiersOld()
  const tiers = useTiers()
  const {
    loadMyStaking,
    tier: tierMine,
    staking: stakingMine,
    setPool: setStakingPool,
    pool: stakingPool,
    contractStaking,
    contractStakingReadonly
  } = useTierMine(tiers)
  const marketActivities = useMarketActivities()
  const discoverMarket = useDiscoverMarket()
  const collectionsMarket = useCollectionsMarket()

  useEffect(() => {
    fetcher(`${API_BASE_URL}/staking-pool`).then(pools => {
      const pool = pools?.data?.find(x => !!x?.rkp_rate)
      setStakingPool(pool)
    })
  }, [setStakingPool])

  return (
    <AppContext.Provider value={{
      $tiers,
      tiers,
      tierMine,
      stakingMine,
      stakingPool,
      loadMyStaking,
      contractStaking,
      contractStakingReadonly,
      marketActivities,
      discoverMarket,
      collectionsMarket
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppProvider
