import React from 'react'
import Layout from 'components/Layout'
import Profile from 'components/Pages/Account/Profile'
import AccountLayout from '@/components/Pages/Account/AccountLayout'

const ProfilePage = () => {
  return <Layout title="My Account">
    <AccountLayout>
      <Profile></Profile>
    </AccountLayout>
  </Layout>
}

export default ProfilePage
