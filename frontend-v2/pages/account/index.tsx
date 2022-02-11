import React from 'react'
import LeftSideBar from '@/components/Pages/Account/LeftSideBar'
import Layout from '@/components/Layout'
import WrapperAccount from '@/components/Pages/Account/WrapperAccount'
import AccountContent from '@/components/Pages/Account/AccountContent'
import Profile from '@/components/Pages/Account/Profile'
import TopSideBar from '@/components/Pages/Account/TopSideBar'
import { useScreens } from '@/components/Pages/Home/utils'
const Account = () => {
  const screens = useScreens()
  return <Layout title="My Account">
    {(screens.mobile || screens.tablet)
      ? <div className="px-1 md:px-4 lg:px-16 md:container mx-auto pb-4">
        <TopSideBar />
        <AccountContent>
          <Profile />
        </AccountContent>
      </div>
      : <div className="px-1 md:px-4 lg:px-16 md:container mx-auto pb-4" style={{ display: 'grid', gridTemplateColumns: '235px 1fr' }}>
        <LeftSideBar />
        <AccountContent>
          <Profile />
        </AccountContent>
      </div>}
  </Layout>
}

export default Account
