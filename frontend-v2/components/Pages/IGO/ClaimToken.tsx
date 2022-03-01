import { useMyWeb3 } from '@/components/web3/context'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { fetcher, useProfile } from '@/utils'
import { ethers, BigNumber } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { dispatch } from 'react-hot-toast/dist/core/store'
import PresalePoolABI from '@/components/web3/abis/PreSalePool.json'
import { API_BASE_URL } from '@/utils/constants'
import { getContract } from '@/components/web3/contract'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

const ClaimToken = ({ poolData }: { poolData: any }) => {
  const { provider } = useLibraryDefaultFlexible(poolData?.network_available)
  const { account, library } = useMyWeb3()
  const { profile } = useProfile(account)
  const [claimable, setClaimable] = useState(false)

  const poolContract = useMemo(() => {
    return poolData?.campaign_hash && new ethers.Contract(poolData.campaign_hash, PresalePoolABI, provider)
  }, [poolData, provider])

  const [claimInformation, setClaimInformation] = useState({
    userClaimed: '0',
    userPurchased: '0',
    claimConfig: null,
    availableAmount: '0'
  })

  const validateClaimable = () => {
    // TODO: user purchased greater than 0

    // TODO: verify claim time

    // TODO: nextClaim && maximumTokenClaimUntilNow less than 0 - wait until next claim milestone

    // TODO: !nextClaim && maximumTokenClaimUntilNow less than 0 - not have enough token to claim

    // TODO: check correct network

    setClaimable(true)
  }

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
    validateClaimable()
  }, [account, poolData, provider, poolContract])

  const getUserSignature = async () => {
    let payload = {
      signature: '',
      amount: ''
    }
    const authSignature = await library.getSigner().signMessage(MESSAGE_SIGNATURE).catch(() => toast.error('Sign Message Failed!'))
    if (!authSignature) return payload
    const config = {
      headers: {
        msgSignature: MESSAGE_SIGNATURE,
        'Content-Type': 'application/json; charset=utf-8'
      },
      method: 'POST',
      body: JSON.stringify({
        campaign_id: poolData?.id,
        wallet_address: account,
        signature: authSignature
      })
    }
    const response = await fetcher(`${API_BASE_URL}/user/claim`, config).catch(e => {
      toast.error(e?.message || 'Swap Token Failed')
      return payload
    })

    console.log(response)

    const { data, message, status } = response
    if (data && status === 200) {
      payload = {
        signature: data.signature,
        amount: data.amount
      }

      return payload
    }

    if (message && status !== 200) {
      toast.error(message)
      return payload
    }

    return payload
  }

  const handleClaimToken = async () => {
    const { signature, amount } = await getUserSignature()
    if (!signature || !amount) return

    const poolContract = getContract(poolData?.campaign_hash, PresalePoolABI, library, account)
    if (!poolContract) return

    const loading = toast.loading('start claim token')

    const transaction = await poolContract.claimTokens(account, amount, signature)
    const result = await transaction.wait(1)
    console.log(result)
    if (+result?.status === 1) {
      toast.success('Token Claim Successfully!')
    } else {
      toast.error('Token Claim Failed')
    }
    toast.dismiss(loading)
  }

  const prettyNumber = (input: number | string) => {
    return input.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  }

  return <div>
    <div>Claimed: {prettyNumber(parseFloat(claimInformation?.userClaimed).toFixed(2))}</div>
    <div>Purchased: {prettyNumber(parseFloat(claimInformation?.userPurchased).toFixed(2))}</div>
    <div className="grid gap-2 grid-cols-2 mt-8 w-full">
      <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium ${!claimable ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'}`} onClick={handleClaimToken}>Claim</button>
    </div>
  </div>
}

export default ClaimToken
