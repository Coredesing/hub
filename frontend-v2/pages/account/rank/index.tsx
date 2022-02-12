import React from 'react'
import Layout from 'components/Layout'
import Rank from 'components/Pages/Account/Rank'
import AccountLayout from '@/components/Pages/Account/AccountLayout'

const RankPage = () => {
  return <Layout title="My Account">
    <AccountLayout>
      <Rank></Rank>
    </AccountLayout>
  </Layout>
}

export default RankPage
