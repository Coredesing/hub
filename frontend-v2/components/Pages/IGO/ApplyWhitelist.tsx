/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  const [formValidated, setFormValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previousSubmission, setPreviousSubmission] = useState(null)

  const { profile } = useProfile(account)

  const [formData, setFormData] = useState({
    telegram: '',
    twitter: '',
    solana_wallet: '',
    terra_wallet: ''
  })

  useEffect(() => {
    const checkWhitelistCondition = async () => {
      if (network?.alias !== poolData?.network_available) return setDisableWhitelist(true)

      const startJoinTime = poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined
      const endJoinTime = poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined
      const availableToJoin = poolData?.buy_type.toLowerCase() === 'whitelist' && startJoinTime && endJoinTime
      if (!availableToJoin) return setDisableWhitelist(true)

      // TODO: Check KYC here

      // const previous = await fetcher(`${API_BASE_URL}/user/whitelist-apply/previous?wallet_address=${account}`).catch(() => toast.error('Check Whitelist Application Failed!'))

      let isJoined = false
      await fetcher(`${API_BASE_URL}/user/check-join-campaign/${poolData?.id}?wallet_address=${account}`)
        .then(res => {
          isJoined = res?.data
        })
        .catch(() => toast.error('Check Whitelist Application Failed!'))
      if (isJoined) return setDisableWhitelist(true)

      setDisableWhitelist(false)
    }

    checkWhitelistCondition()
    setFormValidated(formData.telegram.trim() !== '' && formData.twitter.trim() !== '')
  }, [account, formData.telegram, formData.twitter, network, poolData])

  const handleApplyWhitelist = async () => {
    if (!poolData || !account) {
      return
    }

    if (!showModalWhitelist) {
      setShowModalWhitelist(true)
      return
    }

    const signature = await library.getSigner().signMessage(MESSAGE_SIGNATURE).catch(() => toast.error('Sign Message Failed!'))
    if (!signature) return

    const payload = {
      wallet_address: account,
      user_twitter: formData.twitter,
      user_telegram: formData.telegram,
      solana_address: formData.solana_wallet || '',
      signature: signature || ''
    }

    const applyResponse = await fetcher(`${API_BASE_URL}/user/apply-join-campaign/${poolData?.id}`, {
      method: 'POST',
      headers: {
        msgSignature: MESSAGE_SIGNATURE || '',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    })

    if (!applyResponse || applyResponse?.status !== 200) {
      toast.error(applyResponse?.message || 'Apply Whitelist Failed!')
      return
    }

    applyResponse.status === 200 && toast.success('Apply Whitelist Successfully')
  }

  return (
    <>
      <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 hover:opacity-95 text-black font-medium ${disableWhitelist && 'opacity-75 hover:opacity-75 cursor-not-allowed'}`} onClick={() => !disableWhitelist && handleApplyWhitelist()}>Apply Whitelist</button>
      {/* Modal Whitelist */}
      <Modal show={showModalWhitelist && profile} toggle={setShowModalWhitelist}>
        <div className="p-9">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="twitter"
              name="twitter"
              className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"
              onChange={(e) => setFormData({ ...formData, twitter: e?.target?.value })}
            ></input>
            <input
              type="text"
              placeholder="telegram"
              name="telegram"
              className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"
              onChange={(e) => setFormData({ ...formData, telegram: e?.target?.value })}
            ></input>
            <input
              type="text"
              placeholder="terra wallet"
              name="terra"
              className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"
              onChange={(e) => setFormData({ ...formData, terra_wallet: e?.target?.value })}
            ></input>
            <input
              type="text"
              placeholder="solana wallet"
              name="solana"
              className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"
              onChange={(e) => setFormData({ ...formData, solana_wallet: e?.target?.value })}
            ></input>
          </div>
          <div className="mt-4">
            <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium ${!formValidated && 'opacity-75 cursor-not-allowed'}`} onClick={() => formValidated && handleApplyWhitelist()}>Submit</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ApplyWhitelist
