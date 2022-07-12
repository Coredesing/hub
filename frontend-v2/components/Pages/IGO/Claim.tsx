import { useMyWeb3 } from '@/components/web3/context'
import { fetcher, printNumber } from '@/utils'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import PresalePoolABI from '@/components/web3/abis/PreSalePool.json'
import { API_BASE_URL, CLAIM_TYPE } from '@/utils/constants'
import { useUserPurchased } from '@/hooks/useUserPurchased'
import { useUserClaimed } from '@/hooks/useUserClaimed'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { format } from 'date-fns'
import Pagination from './Pagination'
import { BigNumber, ethers } from 'ethers'
import { IGOContext } from '@/pages/igo/[slug]'
import Image from 'next/image'
import { DECIMAL_PLACES, TIMELINE } from './constants'
import { airdropNetworks, getNetworkByAlias, switchNetwork } from '@/components/web3'
import Tippy from '@tippyjs/react'
import ERC20_ABI from '@/components/web3/abis/ERC20.json'
import { roundNumber } from '@/utils/pool'
import Link from 'next/link'
import Modal from '@/components/Base/Modal'
import Input from '@/components/Base/Input'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''
const PER_PAGE = 5

type REFUND_DEADLINE = {
  from: Date | null;
  to: Date | null;
}

const Claim = () => {
  const { poolData, usd, timeline, now } = useContext(IGOContext)

  const { account, library, network } = useMyWeb3()
  const [page, setPage] = useState(1)
  // Refund info
  const [isRefund, setIsRefund] = useState(false)
  const [refundDeadline, setRefundDeadline] = useState<REFUND_DEADLINE>({ from: new Date(), to: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) })
  const [showModalRefund, setShowModalRefund] = useState(false)

  const lastPage = useMemo(() => {
    return Math.ceil((poolData?.campaignClaimConfig?.length || 0) / PER_PAGE) || 1
  }, [poolData?.campaignClaimConfig?.length])

  const [refundSteps, setRefundSteps] = useState([
    {
      step: 1,
      title: 'Refund Request',
      value: ''
    },
    {
      step: 2,
      title: 'Confirm Refund Request',
      value: ''
    }
  ])
  const [currentStep, setCurrentStep] = useState(1)

  // Claim Info
  const { userPurchasedTokens: purchasedTokens } = useUserPurchased(poolData?.campaign_hash, poolData?.network_available, [99, 100].includes(poolData?.id) ? 18 : poolData?.decimals)
  const { userClaimedTokens: claimedTokens, updateClaimedTokens } = useUserClaimed(poolData?.campaign_hash, poolData?.network_available, poolData?.decimals)
  const { network: poolNetwork } = useLibraryDefaultFlexible(poolData?.network_available)

  const usdPurchased = useMemo(() => {
    const rate = poolData?.token_conversion_rate || 1
    return roundNumber(Number(purchasedTokens) * rate, DECIMAL_PLACES) || 0
  }, [poolData, purchasedTokens])

  const currentPhase = useMemo(() => {
    let data = null
    const available = poolData?.campaignClaimConfig?.filter(config => now?.getTime() >= new Date(Number(config.start_time) * 1000).getTime())
    if (!available.length) {
      data = null
    } else {
      data = available[available.length - 1]
    }

    return data
  }, [now, poolData?.campaignClaimConfig])

  useEffect(() => {
    const a = poolData?.campaignClaimConfig?.findIndex(config => config.id === currentPhase?.id)
    setPage(Math.ceil((Number(a) + 1) / PER_PAGE) > 0 ? Math.ceil((Number(a) + 1) / PER_PAGE) : 1)
  }, [currentPhase?.id, poolData?.campaignClaimConfig])

  const configs = useMemo(() => {
    const claimedPercentage = roundNumber((Number(claimedTokens || 0) / Number(purchasedTokens || 1) * 100), 2)
    const items = poolData?.campaignClaimConfig && poolData.campaignClaimConfig.map((config) => {
      let status = 'Unknown'

      if (purchasedTokens && claimedTokens) {
        status = roundNumber(claimedPercentage, 2) < roundNumber(config.max_percent_claim, 2) ? 'Claimable' : 'Claimed'
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

  const claimable = useMemo(() => {
    return Number(purchasedTokens || 0) > 0 &&
      new Date(Number(poolData?.release_time) * 1000).getTime() <= now?.getTime() &&
      roundNumber(Number(currentPhase?.max_percent_claim) * Number(purchasedTokens) / 100, DECIMAL_PLACES) > roundNumber(claimedTokens, DECIMAL_PLACES) &&
      roundNumber(claimedTokens, DECIMAL_PLACES) < roundNumber(purchasedTokens, DECIMAL_PLACES) &&
      claimTypes.find(type => type.name === CLAIM_TYPE[0])?.value > 0
  }, [claimTypes, purchasedTokens, poolData?.release_time, now, currentPhase?.max_percent_claim, claimedTokens])

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
    if (!account || !network) {
      return
    }

    if (network?.alias !== poolData?.network_available) {
      switchNetwork(library?.provider, getNetworkByAlias(poolData?.network_available).id)
      return
    }
    const { signature, amount } = await getUserSignature()
    if (!signature || !amount) return

    if (amount && BigNumber.from(amount).lte(0)) return toast.error('Please wait until the next milestone to claim the tokens.')

    const loading = toast.loading('Processing...')
    try {
      const poolContract = new ethers.Contract(poolData?.campaign_hash, PresalePoolABI, library.getSigner())
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

  const addToWallet = async (item: any) => {
    if (!library?.provider?.isMetaMask) {
      toast.error('MetaMask wallet is not found!')
      return
    }

    if (!item.token) {
      return
    }

    if (network?.alias !== poolNetwork?.alias) {
      return switchNetwork(library?.provider, poolNetwork.id)
    }

    const tokenContract = new ethers.Contract(item.token, ERC20_ABI, library.getSigner())
    if (!tokenContract) {
      return
    }
    const symbol = await tokenContract.symbol()
    const decimals = await tokenContract.decimals()
    const name = await tokenContract.name()

    await library?.provider?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenContract.address,
          symbol,
          decimals,
          name
        }
      }
    })
  }

  return (
    <>
      { now?.getTime() > timeline[TIMELINE.BUYING_PHASE].end?.getTime() &&
      <div className="w-full my-4 flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-1/3 h-full bg-gamefiDark-630/30 p-7 rounded clipped-t-r">
          <p className="uppercase font-mechanic font-bold text-lg mb-6">Your Allocation</p>
          <div className="flex justify-between mb-4 items-center">
            <strong className="font-semibold">Network</strong>
            {
              poolData.airdrop_network && poolData.airdrop_network !== 'none'
                ? <span className="inline-flex items-center"><img src={airdropNetworks[poolData.airdrop_network]?.image?.default?.src} className="w-5 h-5 mr-2" alt={airdropNetworks[poolData.airdrop_network]?.name} />{airdropNetworks[poolData.airdrop_network]?.name}</span>
                : <span className="inline-flex items-center"><img src={poolNetwork?.image?.default?.src} className="w-5 h-5 mr-2" alt={poolNetwork?.name} />{poolNetwork?.name}</span>
            }
          </div>
          <div className="flex justify-between mb-4 items-center">
            <strong className="font-semibold">Symbol</strong>
            <span className="flex gap-2 items-center">
              {poolData?.symbol}
              {poolData.token &&
                timeline[TIMELINE.BUYING_PHASE]?.end &&
                now?.getTime() >= timeline[TIMELINE.BUYING_PHASE].end.getTime() &&
                poolData.token_type === 'erc20' &&
                poolData.token?.toLowerCase() !== '0xe23c8837560360ff0d49ed005c5e3ad747f50b3d' &&
              <>
                <Tippy content="Add to Metamask">
                  <button
                    className="w-6 h-6 hover:opacity-90"
                    onClick={() => {
                      addToWallet(poolData)
                    }}
                  >
                    <Image src={require('@/assets/images/wallets/metamask.svg')} alt=""></Image>
                  </button>
                </Tippy>
              </>}
            </span>
          </div>
          <div className="flex justify-between mb-4 items-center">
            <strong className="font-semibold">Token Price</strong>
            <span>{poolData?.token_conversion_rate} {usd?.symbol}</span>
          </div>
          <div className="flex justify-between mb-4 items-center">
            <strong className="font-semibold">Have Bought</strong>
            <span>{usdPurchased} {usd?.symbol}</span>
          </div>
          <div className="flex justify-between mb-4 items-center">
            <strong className="font-semibold">Equivalent</strong>
            <span>{roundNumber(purchasedTokens, 2)} {poolData?.symbol}</span>
          </div>
          <div className="flex justify-between mb-4 items-center">
            <strong className="font-semibold">Claimed On GameFi</strong>
            <span className="">{roundNumber(claimedTokens, 2)} {poolData?.symbol}</span>
          </div>
          <div className="mb-4">
            <strong className="font-semibold block">Vesting</strong>
            <span className="text-gamefiDark-100 text-[13px]">{poolData?.claim_policy}</span>
          </div>
          <div className="mb-4">
            <strong className="font-semibold block">Claim Type</strong>
            <span className="text-gamefiDark-100 text-[13px]">
              {claimTypes.map((item, index) => `${item.value}% ${item.name}${index < claimTypes.length - 1 ? ', ' : '.'}`)}
            </span>
          </div>
        </div>
        <div>
          <div className="flex-1 bg-gamefiDark-630/30 p-7 rounded-t clipped-t-r overflow-x-auto">
            <p className="uppercase font-mechanic font-bold text-lg mb-6">Claim Details</p>
            {
              <div>
                <div className="table w-full min-w-[600px] font-casual text-sm mt-2 font-medium border-separate [border-spacing:0_0.4rem]">
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
                          {printNumber(Number(item.max_percent_claim) - (Number(configs[index - 1]?.max_percent_claim) || 0))}%
                        </div>
                        <div className="table-cell align-middle py-2 rounded font-light">
                          {printNumber(((Number(purchasedTokens) * Number(item.max_percent_claim) / 100) - (Number(purchasedTokens) * Number(configs[index - 1]?.max_percent_claim) / 100 || 0)))} {poolData?.symbol}
                        </div>
                        {
                          Number(purchasedTokens || 0) > 0
                            ? <div className="table-cell align-middle py-2 rounded font-light">
                              {Number(item.claim_type) === 0
                                ? item.status === 'Claimable'
                                  ? <div style={{
                                    background: 'linear-gradient(270deg, #7EFF00 2.11%, #BCDB00 98.59%), #FFFFFF',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  }}>{item.status}</div>
                                  : <div className={`${item.status === 'Waiting' && 'text-gamefiYellow-500'} ${item.status === 'Claimed' && 'text-gamefiDark-200'}`}>{item.status}</div>
                                : <></>}
                            </div>
                            : <div className="table-cell align-middle py-2 rounded font-light">
                              <div className="text-gamefiDark-200"></div>
                            </div>
                        }
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
                            {/* {CLAIM_TYPE[Number(item.claim_type)]} */}
                            {CLAIM_TYPE[Number(item.claim_type)] || `Unknown: ${JSON.stringify(item.claim_type)}`}
                            {Number(item.claim_type) === 2
                              ? <a href={item.claim_url} target="_blank" rel="noreferrer" className="cursor-pointer">
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
                <div className="w-full mt-6 flex flex-col-reverse xl:flex-row justify-between xl:items-center gap-4">
                  <button
                    className={`px-8 py-3 rounded-sm clipped-t-r text-gamefiDark text-sm font-bold uppercase whitespace-nowrap ${claimable ? 'hover:opacity-95 bg-gamefiGreen-600 ' : 'bg-gamefiDark-300 cursor-not-allowed'}`}
                    onClick={() => {
                      if (!claimable) {
                        return
                      }
                      handleClaim()
                    }}
                  >
                  Claim On GameFi.org
                  </button>
                  <Pagination page={data.page} pageLast={data.lastPage} setPage={setPage} />
                </div>
              </div>
            }
          </div>
          {(!!refundDeadline.from && !!refundDeadline.to) && <div className="w-full bg-gamefiDark-630/40 p-7 rounded-b overflow-x-auto">
            <div className="w-full flex justify-between items-center mb-6">
              <p className="uppercase font-mechanic font-bold text-lg">Refund</p>
              <div className="text-gamefiDark-200 text-xs font-medium font-casual">Learn more about our <Link href="/insight" passHref><a className="underline">Refund Policies</a></Link></div>
            </div>
            <div className="w-full flex gap-2 items-center font-casual text-sm">
              <div>
                <div className="font-medium mb-2">You can request a refund for ${poolData?.symbol} purchased if you have not yet claimed ${poolData?.symbol}.</div>
                <div className="text-xs">Deadline to request a refund: <span className="text-gamefiGreen-700">{format(refundDeadline.from, 'HH:mm, dd MMM yyyy')} - {format(refundDeadline.to, 'HH:mm, dd MMM yyyy')}</span></div>
              </div>
              <div>
                {
                  now.getTime() >= refundDeadline.from.getTime() && now.getTime() <= refundDeadline.to.getTime()
                    ? <button onClick={() => { setShowModalRefund(true) }} className="p-[1px] rounded-sm clipped-t-r bg-gamefiGreen-700">
                      <div className="bg-gamefiDark-900 rounded-sm clipped-t-r">
                        <div className="px-5 py-2 rounded-sm clipped-t-r text-gamefiGreen-700 text-xs font-bold font-mechanic uppercase whitespace-nowrap hover:opacity-95 bg-gamefiDark-630/40">Request Refund</div>
                      </div>
                    </button>
                    : <button disabled className="p-[1px] rounded-sm clipped-t-r bg-gamefiDark-200">
                      <div className="bg-gamefiDark-900 rounded-sm clipped-t-r">
                        <div className="px-5 py-2 rounded-sm clipped-t-r text-gamefiDark-200 text-xs font-bold font-mechanic uppercase whitespace-nowrap hover:opacity-95 bg-gamefiDark-630/40">Request Refund</div>
                      </div>
                    </button>
                }
              </div>
            </div>
          </div>}
        </div>
      </div>}
      {
        now?.getTime() <= timeline[TIMELINE.BUYING_PHASE].end?.getTime() && <div className="w-full mt-6 p-12 text-gamefiDark-200 flex flex-col items-center justify-center gap-4">
          <Image src={require('@/assets/images/icons/calendar.png')} alt=""></Image>
          <div>This pool has not completed yet. Please wait until Claim Phase.</div>
        </div>
      }

      <Modal show={showModalRefund} toggle={setShowModalRefund} onClose={() => { setCurrentStep(1) }}>
        <div className="p-9 bg-[#28282E]">
          <div className="flex gap-2 items-center mb-4">
            <div>
              <Image src={require('assets/images/icons/request-refund.png')} alt="refund"></Image>
            </div>
            <div className="text-[24px] font-bold text-gamefiDark-300">{currentStep}/2</div>
            <h3 className="text-[24px] font-bold uppercase">Refund Request</h3>
          </div>
          <div className="font-casual text-sm mb-4">Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit “Refund” minim tempor enim. Elit aute irure tempor cupidatat incididunt sint</div>
          <Input value={refundSteps[0].value} onChange={e => {
            const newValue = refundSteps.map(item => {
              if (item.step === 1) {
                console.log(e.target.value, { value: e.target.value, ...item })
                return { value: e.target.value, ...item }
              }
              return item
            })
            console.log(newValue)
            setRefundSteps(newValue)
          }} classes={ { input: 'bg-[#3C3C42] !important' } }></Input>
          <div className="flex justify-end">
            {
              refundSteps[0].value
                ? <button className="p-[1px] rounded-sm clipped-t-r bg-gamefiGreen-700 mt-6">
                  <div className="bg-[#28282E] rounded-sm clipped-t-r">
                    <div className="px-5 py-2 rounded-sm clip ped-t-r text-gamefiDark-200 text-xs font-bold font-mechanic uppercase whitespace-nowrap bg-gamefiGreen-700">Next Step</div>
                  </div>
                </button>
                : <button disabled className="p-[1px] rounded-sm clipped-t-r bg-gamefiDark-200 mt-6">
                  <div className="bg-[#28282E] rounded-sm clipped-t-r">
                    <div className="px-5 py-2 rounded-sm clip ped-t-r text-gamefiDark-200 text-xs font-bold font-mechanic uppercase whitespace-nowrap bg-[#28282E]">Next Step</div>
                  </div>
                </button>
            }
          </div>
        </div>
      </Modal>
      {/* {
        current?.key === 'claim' && !usdPurchased && <div className="w-full mt-6 p-12 text-gamefiDark-200 flex flex-col items-center justify-center gap-4">
          <Image src={require('@/assets/images/icons/calendar.png')} alt=""></Image>
          <div>You do not have enough tokens to claim.</div>
        </div>
      } */}
    </>
  )
}

export default Claim
