import React from 'react'
import Layout from 'components/Layout'
import Rank from 'components/Pages/Account/Rank'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

const RankPage = ({data}) => {
  return <Layout title="My Account">
    <AccountLayout>
      <Rank data={data}></Rank>
    </AccountLayout>
  </Layout>
}

export default RankPage

export async function getServerSideProps() {
  const [tierConfigs, legendSnapshots, legendCurrent] = await Promise.all([
    fetcher(`${API_BASE_URL}/get-tiers`),
    fetcher(`${API_BASE_URL}/staking-pool/legend-snapshots`),
    fetcher(`${API_BASE_URL}/staking-pool/legend-current`)
  ])
  return {
    props: {
      data: {
        tierConfigs: tierConfigs?.data || null,
        legendSnapshots: legendSnapshots?.data || null,
        legendCurrent: legendCurrent?.data || null
      }
    }
  }
}

