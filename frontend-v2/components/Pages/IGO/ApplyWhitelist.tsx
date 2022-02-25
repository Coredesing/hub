import Modal from '@/components/Base/Modal'
import Layout from '@/components/Layout'
import { getNetworkByAlias } from '@/components/web3'
import { useMyWeb3 } from '@/components/web3/context'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { fetcher, useProfile } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { Web3Provider } from '@ethersproject/providers'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

type Props = {
  poolData: any;
}
const ApplyWhitelist = ({ poolData } : Props) => {
  const { account, library, network } = useMyWeb3()
  const [showModalWhitelist, setShowModalWhitelist] = useState(false)
  const [disableWhitelist, setDisableWhitelist] = useState(true)
  const { profile } = useProfile(account)

  const { provider } = useLibraryDefaultFlexible(poolData?.network_available)

  useEffect(() => {
    const checkWhitelistCondition = async () => {
      if (network?.id !== provider?.network?.chainId) return setDisableWhitelist(true)

      const startJoinTime = poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined
      const endJoinTime = poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined
      const availableToJoin = poolData?.buy_type.toLowerCase() === 'whitelist' && startJoinTime && endJoinTime
      if (!availableToJoin) return setDisableWhitelist(true)

      let isJoined = false
      await fetcher(`${API_BASE_URL}/user/check-join-campaign/${poolData?.id}?wallet_address=${account}`)
        .then(res => {
          isJoined = res?.data
        })
        .catch(() => toast.error('Check Whitelist Application Failed!'))
      if (isJoined) return setDisableWhitelist(true)

      setDisableWhitelist(false)
      // console.log(disableWhitelist)
    }

    checkWhitelistCondition()
  }, [account, network, poolData, provider])

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
    !disableWhitelist &&
    <>
      <button className="px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium" onClick={() => handleApplyWhitelist()}>Apply Whitelist</button>
      {/* Modal Whitelist */}
      <Modal show={showModalWhitelist && profile} toggle={setShowModalWhitelist}>
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
    </>
  )
}

export default ApplyWhitelist
