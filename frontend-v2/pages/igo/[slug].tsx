import Layout from '@/components/Layout'
import { getNetworkByAlias } from '@/components/web3'
import { getCurrency, useLibraryDefaultFlexible } from '@/components/web3/utils'
import { getTierById } from '@/utils/tiers'
import React, { useState } from 'react'
import { fetchOneWithSlug } from '../api/igo'
import { useMyWeb3 } from '@/components/web3/context'
import { useFetch, useProfile } from '@/utils'
import ApplyWhitelist from '@/components/Pages/IGO/ApplyWhitelist'
import SwapToken from '@/components/Pages/IGO/SwapToken'
import ClaimToken from '@/components/Pages/IGO/ClaimToken'

const IGODetails = ({ poolData }) => {
  const { account } = useMyWeb3()
  const { profile } = useProfile(account)
  const [notification, setNotification] = useState('')

  const { response: userTier, loading: tierLoading } = useFetch(`/pool/${poolData?.id}/user/${account}/current-tier`, account && poolData?.id)

  const prettyNumber = (input: number | string) => {
    return input.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  }

  return (
    <Layout title="Details">
      {notification && <div className="w-full text-center">{notification}</div>}
      <div className="container px-16 mx-auto">
        <div>{poolData?.title}</div>
        <div className="w-full grid grid-cols-2">
          <div className="border-[1px] p-4">
            <div>Pool network: {getNetworkByAlias(poolData?.network_available)?.name}</div>
            <div>Pool min rank: {getTierById(poolData?.min_tier)?.name}</div>
            <div>Pool allowance: {getCurrency(poolData)?.symbol}</div>
            <div>Pool Timeline: {poolData?.campaign_status}</div>
          </div>
          <div className="border-[1px] p-4">
            <div>Total Amount: {prettyNumber(poolData?.total_sold_coin || 0)} {poolData?.symbol}</div>
            <div>1 {poolData?.symbol} = {poolData?.token_conversion_rate} {getCurrency(poolData)?.symbol}</div>
          </div>
          <div className="border-[1px] p-4">
            <div>KYC: {profile?.is_kyc}</div>
            {poolData && account && <ApplyWhitelist poolData={poolData}></ApplyWhitelist>}
          </div>
          <div className="border-[1px] p-4">
            {poolData && userTier && <SwapToken poolData={poolData} userTier={userTier?.data} loading={tierLoading}></SwapToken>}
          </div>
          <div className="border-[1px] p-4">
            {poolData && <ClaimToken poolData={poolData}></ClaimToken>}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ params }) {
  if (!params?.slug) {
    return { props: { poolData: {} } }
  }

  const poolData = await fetchOneWithSlug(params.slug)
  if (!poolData?.data) {
    return { props: { poolData: {} } }
  }

  return { props: { poolData: poolData.data } }
}

export default IGODetails
