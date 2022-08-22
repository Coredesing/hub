import React, { useEffect } from 'react'
import Layout from '@/components/Layout'
import Profile from '@/components/Pages/Account/Profile'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
import { useAppContext } from '@/context'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

const Account = () => {
  const { setStakingPool, stakingPool, loadMyStaking } = useAppContext()
  useEffect(() => {
    loadMyStaking()
  }, [loadMyStaking])

  useEffect(() => {
    if (stakingPool) {
      return
    }

    fetcher(`${API_BASE_URL}/staking-pool`).then(pools => {
      const pool = pools?.data?.find(x => !!x?.rkp_rate)
      setStakingPool(pool)
    })
  }, [stakingPool, setStakingPool])

  return <Layout title="GameFi Pass">
    <AccountLayout>
      <Profile></Profile>
    </AccountLayout>
  </Layout>
}

export default Account
