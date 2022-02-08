import React from 'react'
import LeftSideBar from '@/components/Pages/Account/LeftSideBar'
import Layout from '@/components/Layout'
import WrapperAccount from '@/components/Pages/Account/WrapperAccount'
import AccountContent from '@/components/Pages/Account/AccountContent'
const Account = () => {
  return <Layout title="My Account">
    <WrapperAccount>
      {/* <LeftSideBar /> */}
      <AccountContent>

      </AccountContent>
    </WrapperAccount>
  </Layout>
}

export default Account
