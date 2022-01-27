import React from 'react'
import LeftSideBar from 'components/Pages/Account/LeftSideBar'
import Layout from 'components/Layout'
import AccountContent from 'components/Pages/Account/AccountContent'
import Asset from 'components/Pages/Account/Asset'
import WrapperAccount from 'components/Pages/Account/WrapperAccount'
const Account = () => {
  return <Layout title="My Account">
    <WrapperAccount>
      {/* <LeftSideBar /> */}
      <AccountContent>
        <Asset />
      </AccountContent>
    </WrapperAccount>
  </Layout>
}

export default Account
