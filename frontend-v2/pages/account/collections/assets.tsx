import React from 'react'
import Layout from '@/components/Layout'
import Asset from '@/components/Pages/Account/Asset'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
const Account = () => {
  return <Layout title="My Account">
    <AccountLayout>
      <Asset></Asset>
    </AccountLayout>
  </Layout>
}

export default Account
