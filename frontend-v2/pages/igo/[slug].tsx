import Layout from '@/components/Layout'
import { getNetworkByAlias } from '@/components/web3'
import { getCurrency, useLibraryDefaultFlexible } from '@/components/web3/utils'
import { getTierById } from '@/utils/tiers'
import { ethers } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchOneWithSlug } from '../api/igo'
import PoolABI from '@/components/web3/abis/PreSalePool.json'
import { useMyWeb3 } from '@/components/web3/context'
import toast from 'react-hot-toast'
import { useProfile } from '@/utils'
import ApplyWhitelist from '@/components/Pages/IGO/ApplyWhitelist'

const IGODetails = ({ poolData }) => {
  const { provider } = useLibraryDefaultFlexible(poolData?.network_available)
  const { account } = useMyWeb3()
  const { profile } = useProfile(account)
  const [notification, setNotification] = useState('')

  const [claimInformation, setClaimInformation] = useState({
    userClaimed: '0',
    userPurchased: '0',
    claimConfig: null,
    availableAmount: '0'
  })

  const poolContract = useMemo(() => {
    return poolData?.campaign_hash && new ethers.Contract(poolData.campaign_hash, PoolABI, provider)
  }, [poolData, provider])

  useEffect(() => {
    const getUserContractInfo = async () => {
      if (!poolContract || !account) return
      console.log(poolData)

      if (['ended', 'closed', 'claimable'].includes(poolData?.campaign_status?.toLowerCase())) {
        const userClaimedData = await poolContract.userClaimed(account).catch(() => toast.error('Blockchain Execution Failed!'))
        const userPurchasedData = await poolContract.userPurchased(account).catch(() => toast.error('Blockchain Execution Failed!'))
        setClaimInformation({
          ...claimInformation,
          userClaimed: ethers.utils.formatEther(userClaimedData || '0'),
          userPurchased: ethers.utils.formatEther(userPurchasedData || '0')
        })
      }
    }
    getUserContractInfo()
  }, [account, poolData, provider, poolContract])

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
            <div>Claimed: {prettyNumber(parseFloat(claimInformation?.userClaimed).toFixed(2))}</div>
            <div>Purchased: {prettyNumber(parseFloat(claimInformation?.userPurchased).toFixed(2))}</div>
          </div>
          <div className="border-[1px] p-4">
            <div>KYC: {profile?.is_kyc}</div>
            {poolData && account && <ApplyWhitelist poolData={poolData}></ApplyWhitelist>}
          </div>
          <div className="border-[1px] p-4">
            <div>Phase </div>
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
