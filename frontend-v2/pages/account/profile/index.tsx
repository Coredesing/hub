import React from 'react'
import LeftSideBar from 'components/Pages/Account/LeftSideBar'
import Layout from 'components/Layout'
import AccountContent from 'components/Pages/Account/AccountContent'
import Profile from 'components/Pages/Account/Profile'
import { useScreens } from '@/components/Pages/Home/utils'
import TopSideBar from '@/components/Pages/Account/TopSideBar'

const ProfilePage = () => {
  const screens = useScreens()
  return <Layout title="My Account: Profile">
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

export default ProfilePage
