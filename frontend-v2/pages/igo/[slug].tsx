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
import Modal from '@/components/Base/Modal'
import { API_BASE_URL } from '@/utils/constants'
import { fetcher } from '@/utils'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

const IGODetails = ({ poolData }) => {
  const { provider } = useLibraryDefaultFlexible(poolData?.network_available)
  const { account, library } = useMyWeb3()
  const [showModalWhitelist, setShowModalWhitelist] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [joinCampaignStatus, setJoinCampaignStatus] = useState(null)

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

      if (poolData?.campaign_status?.toLowerCase() === 'upcoming') {
        const response = await fetcher(`${API_BASE_URL}/user/profile?wallet_address=${account}`).catch(() => toast.error('Get User Profile Failed!'))
        setUserProfile(response?.data?.user)
      }

      if (userProfile?.is_kyc) {
        const checkJoinCampaignData = await fetcher(`${API_BASE_URL}/user/check-join-campaign/${poolData?.id}?wallet_address=${account}`).catch(() => toast.error('Check Apply Whitelist Status Failed!'))
        setJoinCampaignStatus(checkJoinCampaignData?.data)
      }

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

  const handleApplyWhitelist = async () => {
    if (!poolData || !account) {
      return
    }

    if (!showModalWhitelist) {
      setShowModalWhitelist(true)
      return
    }

    const signature = await library.getSigner().signMessage(MESSAGE_SIGNATURE).catch(() => toast.error('Sign Message Failed!'))
    console.log(signature)

    const payload = {
      campaign_id: poolData.id,
      signature: signature || '',
      wallet_address: account
    }

    const applyResponse = await fetcher(`${API_BASE_URL}/user/join-campaign`, {
      method: 'POST',
      headers: {
        msgSignature: MESSAGE_SIGNATURE || '',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    }).catch(e => toast.error(e?.message || 'Apply Whitelist Failed!'))
    if (!applyResponse?.data) {
      toast.error(applyResponse?.message || 'Apply Whitelist Failed!')
    }
  }

  return (
    <Layout title="Details">
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
            <div>KYC: {userProfile?.is_kyc}</div>
            {poolData?.campaign_status?.toLowerCase() === 'upcoming' && joinCampaignStatus !== null && <button className="px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium" onClick={() => handleApplyWhitelist()}>Apply Whitelist</button>}
          </div>
          <div className="border-[1px] p-4">
            <div>Phase </div>
          </div>
        </div>
      </div>

      {/* Modal Whitelist */}
      <Modal show={showModalWhitelist && userProfile} toggle={setShowModalWhitelist}>
        <div className="p-9">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="twitter" name="twitter" className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"></input>
            <input type="text" placeholder="telegram" name="telegram" className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"></input>
            <input type="text" placeholder="terra wallet" name="terra" className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"></input>
            <input type="text" placeholder="solana wallet" name="solana" className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"></input>
          </div>
          <div className="mt-4">
            <button className="px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium" onClick={() => handleApplyWhitelist()}>Submit</button>
          </div>
        </div>
      </Modal>
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
