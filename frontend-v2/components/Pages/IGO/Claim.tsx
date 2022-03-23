import { useMyWeb3 } from '@/components/web3/context'
import { fetcher, formatPrice, formatterUSD, printNumber } from '@/utils'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import PresalePoolABI from '@/components/web3/abis/PreSalePool.json'
import { API_BASE_URL, CLAIM_TYPE } from '@/utils/constants'
import { getContract } from '@/components/web3/contract'
import { useUserPurchased } from '@/hooks/useUserPurchased'
import { useUserClaimed } from '@/hooks/useUserClaimed'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { format } from 'date-fns'
import Pagination from './Pagination'
import { ethers } from 'ethers'
import { IGOContext } from '@/pages/igo/[slug]'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''
const PER_PAGE = 5

const Claim = () => {
  const { poolData, usd } = useContext(IGOContext)
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const { account, library } = useMyWeb3()
  const [page, setPage] = useState(1)

  const lastPage = useMemo(() => {
    return Math.ceil((poolData?.campaignClaimConfig?.length || 0) / PER_PAGE) || 1
  }, [poolData?.campaignClaimConfig?.length])

  // Claim Info
  const { userPurchasedTokens: purchasedTokens } = useUserPurchased(poolData?.campaign_hash, poolData?.network_available)
  const { userClaimedTokens: claimedTokens, updateClaimedTokens } = useUserClaimed(poolData?.campaign_hash, poolData?.network_available)
  const { network: poolNetwork } = useLibraryDefaultFlexible(poolData?.network_available)

  const usdPurchased = useMemo(() => {
    const rate = poolData?.token_conversion_rate || 1
    return Number(purchasedTokens) * rate || 0
  }, [poolData, purchasedTokens])

  const currentPhase = useMemo(() => {
    let data = null
    poolData?.campaignClaimConfig && poolData.campaignClaimConfig.forEach(config => {
      if (new Date().getTime() < new Date(Number(config.start_time) * 1000).getTime()) {
        data = config
      }
    })

    return data
  }, [poolData.campaignClaimConfig])

  const configs = useMemo(() => {
    const claimedPercentage = Number(claimedTokens || 0) / Number(purchasedTokens || 1) * 100
    const items = poolData?.campaignClaimConfig && poolData.campaignClaimConfig.map((config) => {
      let status = 'Unknown'

      if (purchasedTokens && claimedTokens) {
        status = claimedPercentage < Number(config.max_percent_claim) ? 'Claimable' : 'Claimed'
      }

      if (new Date().getTime() < new Date(Number(config.start_time) * 1000).getTime()) {
        status = 'Waiting'
      }
      return {
        ...config,
        status
      }
    })

    return items
  }, [claimedTokens, poolData.campaignClaimConfig, purchasedTokens])

  const data = useMemo(() => {
    return {
      page: page,
      lastPage: lastPage,
      items: configs.filter((item, i) => (i >= (page - 1) * PER_PAGE && i < page * PER_PAGE))
    }
  }, [configs, lastPage, page])

  const claimable = useMemo(() => {
    return Number(purchasedTokens || 0) > 0 &&
      new Date(Number(poolData?.release_time) * 1000).getTime() <= now.getTime() &&
      Number(currentPhase?.max_percent_claim || 0) * Number(purchasedTokens) > Number(claimedTokens || 0)
    // TODO: check correct network
  }, [claimedTokens, currentPhase?.max_percent_claim, now, poolData?.release_time, purchasedTokens])

  const claimTypes = useMemo(() => {
    if (!configs?.length) {
      return []
    }

    const types = []
    configs?.forEach(config => {
      const claimType = CLAIM_TYPE[Number(config?.claim_type)]

      const index = types.findIndex(type => type.name === claimType)
      if (index === -1) types.push({ id: config?.claim_type, name: claimType, value: 0 })
    })

    const keys = configs?.map(item => item.claim_type)
    const results = []
    let previousValue = 0
    types.forEach(type => {
      const lastIndex = keys.lastIndexOf(type.id)
      const value = Number(configs[lastIndex]?.max_percent_claim) - previousValue
      results.push({
        ...type,
        value: value > 0 ? value : 0
      })
      previousValue += value
    })
    return results
  }, [configs])

  // Actions
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

  const handleClaim = async () => {
    const { signature, amount } = await getUserSignature()
    if (!signature || !amount) return

    if (amount && ethers.utils.parseEther(amount).lte(0)) return toast.error('Please wait until the next milestone to claim the tokens.')

    const loading = toast.loading('start claim token')
    try {
      const poolContract = getContract(poolData?.campaign_hash, PresalePoolABI, library, account)
      if (!poolContract) return

      const transaction = await poolContract.claimTokens(account, amount, signature)
      const result = await transaction.wait(1)
      if (+result?.status === 1) {
        toast.success('Token Claim Successfully!')
      } else {
        toast.error('Token Claim Failed')
      }
      toast.dismiss(loading)
      updateClaimedTokens()
    } catch (e) {
      toast.error(e?.data?.message || 'Token Claim Failed')
    } finally {
      toast.dismiss(loading)
    }
  }

  return <div className="w-full my-4 flex flex-col xl:flex-row gap-6">
    <div className="w-full xl:w-1/3 bg-gamefiDark-630/30 p-7 rounded clipped-t-r">
      <p className="uppercase font-mechanic font-bold text-lg mb-6">Your Allocation</p>
      <div className="flex justify-between mb-4 items-center">
        <strong className="font-semibold">Network</strong>
        <span className="inline-flex items-center"><img src={poolNetwork?.image?.default?.src} className="w-5 h-5 mr-2" alt={poolNetwork?.name} />{poolNetwork?.name}</span>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <strong className="font-semibold">Symbol</strong>
        <span>{poolData?.symbol}</span>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <strong className="font-semibold">Token Price</strong>
        <span>{formatPrice(poolData?.token_conversion_rate)} {usd?.symbol}</span>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <strong className="font-semibold">Have Bought</strong>
        <span>{formatterUSD.format(usdPurchased)} {usd?.symbol}</span>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <strong className="font-semibold">Equivalent</strong>
        <span>{printNumber(purchasedTokens)} {poolData?.symbol}</span>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <strong className="font-semibold">Claimed On GameFi</strong>
        <span className="">{printNumber(claimedTokens)} {poolData?.symbol}</span>
      </div>
      <div className="mb-4">
        <strong className="font-semibold block">Vesting</strong>
        <span className="text-gamefiDark-100 text-[13px]">{poolData?.claim_policy}</span>
      </div>
      <div className="mb-4">
        <strong className="font-semibold block">Claim Type</strong>
        <span className="text-gamefiDark-100 text-[13px]">
          {claimTypes.map((item, index) => `${item.value}% on ${item.name}${index < claimTypes.length - 1 ? ', ' : '.'}`)}
        </span>
      </div>
    </div>
    <div className="flex-1 bg-gamefiDark-630/30 p-7 rounded clipped-t-r">
      <p className="uppercase font-mechanic font-bold text-lg mb-6">Claim Details</p>
      {
        data.items?.length
          ? <>
            <div className="table w-full font-casual text-sm mt-2 font-medium border-separate [border-spacing:0_0.4rem]">
              <div className="table-row">
                <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
            No.
                </div>
                <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
            Open ({format(new Date(), 'z')})
                </div>
                <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
            Percentage
                </div>
                <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
            Amount
                </div>
                <div className="table-cell align-middle font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
            Status
                </div>
                <div className="table-cell align-middle text-right font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
            Claim Type
                </div>
              </div>

              {data && data.items?.map((item, i) => {
                const index = (page - 1) * PER_PAGE + Number(i)
                return (
                  <div key={`claim-${item.id}`} className="table-row">
                    <div className="table-cell align-middle py-2 rounded font-light">
                      {Number(index) + 1}
                    </div>
                    <div className="table-cell align-middle py-2 rounded font-light">
                      {format(new Date(Number(item.start_time) * 1000), 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                    <div className="table-cell align-middle py-2 rounded font-light">
                      {Number(item.max_percent_claim) - Number(configs[index - 1]?.max_percent_claim || 0)}%
                    </div>
                    <div className="table-cell align-middle py-2 rounded font-light">
                      {(Number(purchasedTokens) * Number(item.max_percent_claim) / 100).toFixed(2)} {poolData?.symbol}
                    </div>
                    <div className="table-cell align-middle py-2 rounded font-light">
                      {item.status === 'Claimable'
                        ? <div style={{
                          background: 'linear-gradient(270deg, #7EFF00 2.11%, #BCDB00 98.59%), #FFFFFF',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>{item.status}</div>
                        : <div className={`${item.status === 'Waiting' && 'text-gamefiYellow-500'} ${item.status === 'Claimed' && 'text-gamefiDark-200'}`}>{item.status}</div>}
                    </div>
                    <div className="table-cell align-middle py-2 rounded font-light text-right">
                      <span
                        className={`${
                          Number(item.claim_type) === 0 && 'text-gamefiGreen-600'
                        } ${
                          Number(item.claim_type) === 1 && 'text-blue-400'
                        } ${
                          Number(item.claim_type) === 2 && 'text-gamefiRed flex items-center gap-1 justify-end'
                        }`}
                      >
                        {CLAIM_TYPE[Number(item.claim_type)]}
                        {Number(item.claim_type) === 2
                          ? <a href={item.claim_url} className="cursor-pointer">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_52_5097)">
                                <path d="M13.5625 0.4375L6.5625 7.4375" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7.4375 0.4375H13.5625V6.5625" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3.9375 0.4375H1.3125C0.8295 0.4375 0.4375 0.8295 0.4375 1.3125V12.6875C0.4375 13.1705 0.8295 13.5625 1.3125 13.5625H12.6875C13.1705 13.5625 13.5625 13.1705 13.5625 12.6875V10.0625" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_52_5097">
                                  <rect width="14" height="14" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                          </a>
                          : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="w-full mt-6 flex justify-between items-center">
              <button
                className={`px-8 py-3 bg-gamefiGreen-600 hover:opacity-95 rounded-sm clipped-t-r text-gamefiDark text-sm font-bold uppercase whitespace-nowrap ${!claimable && 'opacity-75 cursor-not-allowed hover:opacity-75'}`}
                onClick={() => claimable && handleClaim()}
              >
          Claim On GameFi.org
              </button>
              <Pagination page={data.page} pageLast={data.lastPage} setPage={setPage} />
            </div></>
          : <div className="w-full text-center text-2xl font-bold">TBA</div>
      }
    </div>
  </div>
}

export default Claim