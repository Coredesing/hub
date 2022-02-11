import { useState, useMemo, useCallback } from 'react'
import AppContext from './index'
import useTiersOld from './tiersOld'
import useMarketActivities from './market-activities'
import { tiersFromConfigs, TierConfigs } from '@/utils/tiers'
import { useMyWeb3 } from '@/components/web3/context'
import { useWeb3Default, GAFI } from '@/components/web3'
import ABIStakingPool from '@/components/web3/abis/StakingPool.json'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { Contract, utils } from 'ethers'

const useTiers = () => {
  const [configs, setConfigs] = useState<TierConfigs | null>(null)

  const all = useMemo(() => {
    if (!configs) {
      return []
    }

    return tiersFromConfigs(configs)
  }, [configs])

  return {
    state: {
      all
    },

    actions: {
      setConfigs
    }
  }
}

const useMyTier = (tiers) => {
  const { library: libraryDefault } = useWeb3Default()
  const { account } = useMyWeb3()
  const [data, setData] = useState<{ id: number; tier: number; stakedInfo: { tokenStaked: string; uniStaked: string } } | null>(null)
  const tier = useMemo(() => {
    if (!data || !tiers.state.all) {
      return null
    }

    return tiers.state.all.find(x => x.id === data.tier)
  }, [data, tiers])
  const loadMyStakingData = useCallback(({ pool_id: poolID, pool_address: poolAddress }) => {
    if (!account) {
      setData(null)
      return
    }

    if (!poolID || !poolAddress) {
      setData(null)
      return
    }

    if (!libraryDefault) {
      setData(null)
      return
    }

    const contract = new Contract(poolAddress, ABIStakingPool, libraryDefault)

    return Promise.allSettled([
      fetcher(`${API_BASE_URL}/user/tier-info?wallet_address=${account}`),
      contract.linearStakingData(poolID, account).then(x => utils.formatUnits(x.balance, GAFI.decimals))
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
  }, [account, setData, libraryDefault])
  const tierNextTokens = useMemo<number | string>(() => {
    if (!data || !tiers.state.all || !tier) {
      return 0
    }

    const t = tiers.state.all.find(x => x.id === data.tier + 1)
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
    loadMyStakingData,
    state: {
      tier,
      staking: {
        ...data?.stakedInfo,
        nextTokens: tierNextTokens
      }
    }
  }
}

const AppProvider = (props: any) => {
  const $tiers = useTiersOld()
  const tiers = useTiers()
  const myTier = useMyTier(tiers)
  const { loadMyStakingData } = myTier
  const marketActivities = useMarketActivities()

  return (
    <AppContext.Provider value={{
      $tiers,
      tiers,
      myTier,
      loadMyStakingData,
      marketActivities
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppProvider
