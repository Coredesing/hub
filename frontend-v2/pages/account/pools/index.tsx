import React from 'react'
import LeftSideBar from 'components/Pages/Account/LeftSideBar'
import Layout from 'components/Layout'
import WrapperAccount from 'components/Pages/Account/WrapperAccount'
import AccountContent from 'components/Pages/Account/AccountContent'
import Pools from 'components/Pages/Account/Pools'

const PoolsPage = () => {
  return <Layout title="My Account: Pools">
    <WrapperAccount>
      <LeftSideBar />
      <AccountContent>
        <Pools />
      </AccountContent>
    </WrapperAccount>
  </Layout>
}

export default PoolsPage
