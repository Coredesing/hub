import { useState, useMemo, useEffect, useCallback } from 'react'
import AppContext from './index'
import useTiersOld from './tiersOld'
import useMarketActivities from './market-activities'
import { tiersFromConfigs, TierConfigs } from '@/utils/tiers'
import { useMyWeb3 } from '@/components/web3/context'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

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
  const { account } = useMyWeb3()
  const [data, setData] = useState<{ id: number; tier: number; stakedInfo: { tokenStaked: string; uniStaked: string } } | null>(null)
  const tier = useMemo(() => {
    if (!data || !tiers.state.all) {
      return null
    }

    return tiers.state.all.find(x => x.id === data.tier)
  }, [data, tiers])
  const loadData = useCallback(() => {
    if (!account) {
      setData(null)
      return
    }

    return fetcher(`${API_BASE_URL}/user/tier-info?wallet_address=${account}`)
      .then(response => {
        setData(response.data)
      })
  }, [account])

  useEffect(() => {
    loadData()
  }, [loadData])
  const tierNextTokens = useMemo(() => {
    if (!data || !tiers.state.all || !tier) {
      return null
    }

    const t = tiers.state.all.find(x => x.id === data.tier + 1)
    if (!t) {
      return null
    }

    if (!t.config?.tokens || t.config?.requirement) {
      return 0
    }

    return (parseInt(t.config?.tokens) - parseInt(tier.config?.tokens)) || 0
  }, [data, tiers, tier])

  return {
    state: {
      tier,
      staking: {
        ...data?.stakedInfo,
        nextTokens: tierNextTokens
      }
    },
    actions: {
      loadData
    }
  }
}

const AppProvider = (props: any) => {
  const $tiers = useTiersOld()
  const tiers = useTiers()
  const myTier = useMyTier(tiers)
  const marketActivities = useMarketActivities()

  return (
    <AppContext.Provider value={{
      $tiers,
      tiers,
      myTier,
      marketActivities
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppProvider
