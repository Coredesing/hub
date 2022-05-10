import { useState, useMemo, useCallback, useEffect } from 'react'
import AppContext from './index'
import useTiersOld from './tiersOld'
import useMarketActivities, { useCollectionsMarket, useDiscoverMarket } from './market-activities'
import { TIERS, Tier } from '@/utils/tiers'
import { useMyWeb3 } from '@/components/web3/context'
import { useWeb3Default } from '@/components/web3'
import ABIStakingPool from '@/components/web3/abis/StakingPool.json'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { Contract } from 'ethers'

const useIgoPool = () => {
  const [poolCount, setPoolCount] = useState(0)

  useEffect(() => {
    fetcher(`${API_BASE_URL}/pools/count-pools?token_type=erc20&is_display=1`).then(response => {
      const count = response?.data?.count || 0
      setPoolCount(count)
    })
  }, [])

  return {
    count: poolCount
  }
}

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
  const [loading, setLoading] = useState(false)

  const tier = useMemo(() => {
    if (!data || !tiers.all) {
      return null
    }

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
    if (!account) {
      setData(null)
      return
    }

    setLoading(true)
    return Promise.allSettled([
      fetcher(`${API_BASE_URL}/user/tier-info?wallet_address=${account}`)
    ]).then((results) => {
      setLoading(false)
      if (results[0]?.status !== 'fulfilled') {
        setData(null)
        return
      }

      const data = results[0]?.value?.data
      setData(data)
    })
  }, [account, setData])

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
    loading,
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
  const igoPool = useIgoPool()
  const {
    loading: tierMineLoading,
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

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AppContext.Provider value={{
      now,
      $tiers,
      tiers,
      tierMine,
      tierMineLoading,
      stakingMine,
      stakingPool,
      setStakingPool,
      loadMyStaking,
      contractStaking,
      contractStakingReadonly,
      marketActivities,
      discoverMarket,
      collectionsMarket,
      igoPool
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppProvider
