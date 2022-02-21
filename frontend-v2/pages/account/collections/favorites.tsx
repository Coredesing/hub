import React from 'react'
import Layout from 'components/Layout'
import Favorites from 'components/Pages/Account/Favorites'
import AccountLayout from '@/components/Pages/Account/AccountLayout'

const FavoritesPage = () => {
  return <Layout title="My Account: Favorites">
    <AccountLayout>
      <Favorites></Favorites>
    </AccountLayout>
  </Layout>
}

export default FavoritesPage
