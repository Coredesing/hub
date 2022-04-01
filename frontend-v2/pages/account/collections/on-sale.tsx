import React from 'react'
import Layout from 'components/Layout'
import OnSale from 'components/Pages/Account/OnSale'
import AccountLayout from '@/components/Pages/Account/AccountLayout'

const OnSalePage = () => {
  return <Layout title="GameFi.org - My On-sale Assets">
    <AccountLayout>
      <OnSale></OnSale>
    </AccountLayout>
  </Layout>
}

export default OnSalePage
