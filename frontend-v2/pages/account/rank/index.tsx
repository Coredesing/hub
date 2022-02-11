import React from 'react'
import LeftSideBar from 'components/Pages/Account/LeftSideBar'
import Layout from 'components/Layout'
import WrapperAccount from 'components/Pages/Account/WrapperAccount'
import AccountContent from 'components/Pages/Account/AccountContent'
import Rank from 'components/Pages/Account/Rank'

const RankPage = () => {
  return <Layout title="My Account: Rank">
    <WrapperAccount>
      <LeftSideBar />
      <AccountContent>
        <Rank />
      </AccountContent>
    </WrapperAccount>
  </Layout>
}

export default RankPage
