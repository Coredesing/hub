import React from 'react'
import LeftSideBar from '@/components/Pages/Account/LeftSideBar'
import Layout from '@/components/Layout'
import WrapperAccount from '@/components/Pages/Account/WrapperAccount'
import AccountContent from '@/components/Pages/Account/AccountContent'
import Profile from '@/components/Pages/Account/Profile'
const Account = () => {
  return <Layout title="My Account">
    <WrapperAccount>
      <LeftSideBar />
      <AccountContent>
        <Profile />
      </AccountContent>
    </WrapperAccount>
  </Layout>
}

export default Account
