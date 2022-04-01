import React from 'react'
import Layout from 'components/Layout'
import Pools from 'components/Pages/Account/Pools'
import AccountLayout from '@/components/Pages/Account/AccountLayout'

const PoolsPage = () => {
  return <Layout title="GameFi.org - My Pools">
    <AccountLayout>
      <Pools></Pools>
    </AccountLayout>
  </Layout>
}

export default PoolsPage
