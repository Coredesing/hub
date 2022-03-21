import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Recaptcha from '@/components/Base/Recaptcha'
import { debounce, fetcher, useFetch } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import { useBalanceToken, useTokenAllowance, useTokenApproval } from '@/components/web3/utils'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/utils/constants'
import PRESALE_POOL_ABI from '@/components/web3/abis/PreSalePool.json'
import POOL_ABI from '@/components/web3/abis/Pool.json'

import useWalletSignature from '@/hooks/useWalletSignature'
import { useUserPurchased } from '@/hooks/useUserPurchased'
import { IGOContext } from '@/pages/igo/[slug]'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

const Swap = () => {
  const { poolData, usd } = useContext(IGOContext)
  const { library, account, network, balanceShort } = useMyWeb3()
  const [txHash, setTxHash] = useState('')
  const [allocation, setAllocation] = useState(null)

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Round Info
  const { response: allocationResponse, errorMessage: allocationError } = useFetch(`/pool/${poolData.id}/user/${account}/current-tier`, !poolData)
  useEffect(() => {
    setAllocation(allocationResponse?.data)
  }, [allocationResponse])

  useEffect(() => {
    if (allocationError) toast.error('Failed to fetch allocation, reload the page to try again!')
  }, [allocationError])

  const { userPurchasedTokens: purchasedTokens, updatePurchasedTokens } = useUserPurchased(poolData?.campaign_hash, poolData?.network_available)

  const usdPurchased = useMemo(() => {
    const rate = poolData?.token_conversion_rate || 1
    return Number(purchasedTokens) * rate || 0
  }, [poolData, purchasedTokens])

  const [rounds, setRounds] = useState([
    {
      phase: 1,
      name: 'Buy Phase 1 - Guarantee',
      token: usd,
      allocation: allocation?.max_buy || '0',
      purchased: '0'
    },
    {
      phase: 2,
      name: 'Buy Phase 2 - FCFS',
      token: usd,
      allocation: poolData?.freeBuyTimeSetting?.max_bonus || '0',
      purchased: '0'
    }
  ])

  const [phase, setPhase] = useState<number | null>(null)

  const remainingToken = useMemo(() => {
    let amount = 0
    rounds.forEach(round => {
      if (round.phase <= phase) amount += Number(round.allocation || 0) - Number(round.purchased || 0)
    })

    return amount > 0 ? amount.toString() : '0'
  }, [phase, rounds])

  useEffect(() => {
    setInputAmount(remainingToken || '0')
  }, [allocation, remainingToken])

  useEffect(() => {
    const allocations = {
      1: allocation?.max_buy || '0',
      2: poolData?.freeBuyTimeSetting?.max_bonus || '0'
    }

    const items = rounds.map(round => {
      return { ...round, allocation: allocations[round.phase] || '0' }
    })
    setRounds(items)
  }, [allocation, poolData])

  useEffect(() => {
    let previousRoundsPurchased = '0'

    rounds.forEach(round => {
      if (round.phase < phase) {
        previousRoundsPurchased = (Number(previousRoundsPurchased) + Number(round.purchased)).toString()
      }
    })

    const currentPurchased = (Number(usdPurchased) - Number(previousRoundsPurchased)).toFixed(1)
    setRounds(rounds.map(round => round.phase === phase ? { ...round, purchased: currentPurchased } : round))
  }, [phase, usdPurchased])

  useEffect(() => {
    if (poolData?.start_time) {
      const startTime = new Date(Number(poolData?.start_time) * 1000).getTime()
      const endTime = new Date(Number(poolData?.finish_time) * 1000).getTime()
      const freeBuyTime = poolData?.freeBuyTimeSetting?.start_buy_time ? new Date(Number(poolData?.freeBuyTimeSetting?.start_buy_time) * 1000).getTime() : null

      if (freeBuyTime && now.getTime() >= startTime && now.getTime() < freeBuyTime) {
        return setPhase(1)
      }

      if (freeBuyTime && now.getTime() >= freeBuyTime && now.getTime() <= endTime) {
        return setPhase(2)
      }

      if (!freeBuyTime && now.getTime() >= startTime && now.getTime() <= endTime) {
        return setPhase(1)
      }

      setPhase(null)
    }
  }, [now, poolData])

  // Approve Token
  const { allowance, load: loadAllowance, loading: loadingAllowance, error } = useTokenAllowance(usd, account, poolData?.campaign_hash, poolData?.network_available)
  const { approve, loading: loadingApproval, error: errorApproval } = useTokenApproval(usd, poolData?.campaign_hash)

  const { signMessage } = useWalletSignature()

  useEffect(() => {
    loadAllowance().catch(e => console.debug(e))
  }, [account, loadAllowance, poolData, usd])

  useEffect(() => {
    if (errorApproval) {
      toast.error(errorApproval?.message || 'Approve Token Failed!')
    }
  }, [errorApproval])

  const approvable = useMemo(() => {
    return usd?.address && !loadingApproval && !loadingAllowance && !allowance?.gt(0)
  }, [allowance, loadingAllowance, loadingApproval, usd])

  const handleApprove = useCallback(async (amount) => {
    const loading = toast.loading('Start Approve Token...')
    const ok = await approve(amount)

    if (ok) toast.success('Approve Token Successfully!')
    await loadAllowance().catch(e => console.debug(e))
    toast.dismiss(loading)
  }, [approve, loadAllowance])

  // Swap Token
  const [captchaToken, setCaptchaToken] = useState('')
  const recaptchaRef: any = useRef()
  const [inputAmount, setInputAmount] = useState('0')

  const { balanceShort: usdBalance, updateBalance: updateUsdBalance } = useBalanceToken(usd, poolData?.network_available)

  const onVerifyCapcha = (token: string | null) => {
    setCaptchaToken(token || '')
  }

  const onRefreshRecaptcha = debounce(() => {
    if (!captchaToken) return
    if (typeof recaptchaRef?.current?.resetCaptcha === 'function') {
      recaptchaRef.current.resetCaptcha()
    }
  }, 5000)

  const swappable = useMemo(() => {
    // console.log(poolData?.campaign_status, poolData?.is_deploy, allocation, allowance)
    return poolData?.campaign_status?.toLowerCase() === 'swap' &&
        poolData?.is_deploy &&
        allocation &&
        !loadingApproval &&
        !loadingAllowance &&
        (allowance?.gt(0) || !usd.address) &&
        allocation?.max_buy > 0 &&
        poolData?.network_available?.toLowerCase() === network?.alias &&
        phase !== null &&
        Number(remainingToken) > 0
  }, [allocation, allowance, loadingAllowance, loadingApproval, poolData, network, usd, phase, remainingToken])

  const getUserSignature = async () => {
    let payload = {
      signature: '',
      minBuy: '0',
      maxBuy: '0'
    }
    const authSignature = await signMessage().catch(() => toast.error('Sign Message Failed!'))
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
        signature: authSignature || '',
        captcha_token: captchaToken || ''
      })
    }
    const response = await fetcher(`${API_BASE_URL}/user/deposit`, config).catch(e => {
      toast.error(e?.message || 'Swap Token Failed')
      return payload
    })

    const { data, message, status } = response
    if (data && status === 200) {
      payload = {
        signature: data.signature,
        minBuy: data.min_buy,
        maxBuy: data.max_buy
      }

      return payload
    }

    if (message && status !== 200) {
      toast.error(message)
      return payload
    }

    return payload
  }

  const handleSwap = async () => {
    if (!swappable) {
      return
    }
    onRefreshRecaptcha()
    const abi = poolData?.buy_type?.toLowerCase() === 'claimable' ? PRESALE_POOL_ABI : POOL_ABI // ????
    const poolContract = new ethers.Contract(poolData?.campaign_hash, abi, library.getSigner())

    const { signature, minBuy, maxBuy } = await getUserSignature()
    if (!signature) {
      return
    }

    if (!maxBuy) {
      toast.error('You have reached the buy limit!')
      return
    }

    const method = poolData?.accept_currency?.toUpperCase() === 'ETH' ? 'buyTokenByEtherWithPermission' : 'buyTokenByTokenWithPermission'
    const params = poolData?.accept_currency?.toUpperCase() === 'ETH'
      ? [
        account,
        account,
        maxBuy,
        minBuy,
        signature,
        {
          value: ethers.utils.parseUnits(inputAmount, usd.decimals)
        }
      ]
      : [
        account,
        usd.address,
        ethers.utils.parseUnits(inputAmount, usd.decimals),
        account,
        maxBuy,
        minBuy,
        signature
      ]

    const loading = toast.loading('start swap token')
    try {
      const transaction = await poolContract[method](...params)
      const result = await transaction.wait(1)

      if (+result?.status === 1) {
        toast.success('Token Deposit Successfully!')
        setTxHash(transaction?.hash || '')
      } else {
        toast.error('Token Deposit Failed')
      }
      updateUsdBalance()
      updatePurchasedTokens()
    } catch (e) {
      toast.error(e?.data?.message || 'Token Deposit Failed')
      console.debug(e)
    } finally {
      toast.dismiss(loading)
    }
  }

  return (
    <>
      {
        now.getTime() >= new Date(Number(poolData?.start_time || '0') * 1000).getTime() && now.getTime() <= new Date(Number(poolData?.finish_time || '0') * 1000).getTime() &&
          <div className="my-4 w-full bg-gamefiDark-630/30 p-7 rounded clipped-t-r">
            <div className="flex flex-col lg:flex-row gap-14 lg:gap-4 w-full">
              <div className="w-full lg:w-1/2">
                <div className="uppercase font-bold w-full mb-5 px-2 tracking-wide leading-7">Rounds Info</div>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 uppercase font-medium text-gamefiDark-100 text-sm text-left">Round</th>
                      <th className="px-2 py-2 uppercase font-medium text-gamefiDark-100 text-sm text-right">Max Allocation</th>
                      <th className="px-2 py-2 uppercase font-medium text-gamefiDark-100 text-sm text-right">Have Bought</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      rounds.map(round => (
                        <tr key={round.phase}>
                          <td className="px-2 py-2 font-medium text-left">{round.name}</td>
                          <td className="px-2 py-2 uppercase font-medium text-right">{`${Number(round.allocation || 0).toFixed(1)} ${round.token?.symbol}`}</td>
                          <td className="px-2 py-2 uppercase font-medium text-right">{`${Number(round.purchased || 0).toFixed(1)} ${round.token?.symbol}`}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <div className="mt-4 px-2 py-4 flex w-full justify-between items-center bg-gamefiDark rounded-sm">
                  <div className="font-medium">Total</div>
                  <div className="font-medium uppercase">{`${Number(usdPurchased || '0').toFixed(1)} ${usd?.symbol}`}</div>
                </div>
              </div>
              <div className="flex-1 bg-gamefiDark rounded px-3 py-4">
                <div className="uppercase font-semibold tracking-wide leading-7 text-lg">
                  {rounds.find(round => round.phase === phase)?.name}
                </div>
                <div className="w-full flex items-center gap-2 mt-4">
                  <div className="flex flex-col gap-1 items-center justify-center w-1/2">
                    <div className={`w-full text-sm font-semibold tracking-wide text-center ${!allowance?.gt(0) ? 'text-gamefiGreen' : ''}`}>Step 1: Approve</div>
                    <div className={`w-full h-1 rounded-sm ${!allowance?.gt(0) ? 'bg-gamefiGreen' : 'bg-gamefiDark-650'}`}></div>
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center w-1/2">
                    <div className={`w-full text-sm font-semibold tracking-wide text-center ${allowance?.gt(0) ? 'text-gamefiGreen' : ''}`}>Step 2: Swap</div>
                    <div className={`w-full h-1 rounded-sm ${allowance?.gt(0) ? 'bg-gamefiGreen' : 'bg-gamefiDark-650'}`}></div>
                  </div>
                </div>
                <div className="mt-10 flex flex-col w-full">
                  <div className="w-full flex items-center justify-between text-sm">
                    <div>Amount</div>
                    <div>Current Balance: <span className="font-bold">{usd?.address ? usdBalance : balanceShort}</span></div>
                  </div>
                  <div className="w-full relative flex mt-2">
                    <input
                      type="number"
                      min={0}
                      value={inputAmount}
                      onChange={e => setInputAmount(e?.target?.value)}
                      className="appearance-none bg-gamefiDark-650 border border-gamefiDark-600 rounded-sm w-full px-4 py-3 focus:outline-none focus:border-gamefiDark-600 focus:ring-0"
                      placeholder="0.00"
                    />
                    <div className="absolute top-0 bottom-0 left-0 flex items-center">
                      <div className="rounded-r bg-gamefiDark-400" style={{ width: '2px', height: '18px' }}></div>
                    </div>
                    <div className="absolute top-0 bottom-0 right-0 flex items-center px-2 text-sm gap-4 bg-gamefiDark-650 m-[1px]">
                      <div className="uppercase text-gamefiDark-300 font-bold">{usd.symbol}</div>
                      <button className="text-gamefiGreen font-medium tracking-wide" onClick={() => setInputAmount(remainingToken || '0')}>Max</button>
                    </div>
                  </div>
                  <div className="w-full mt-4 text-sm">
                    {
                      Number(remainingToken) > 0 ? 'You need to Approve once and only once before start swapping' : 'You have reached your order limit !'
                    }
                  </div>
                  {swappable
                    ? <div className="w-full mt-5">
                      <Recaptcha onChange={onVerifyCapcha} ref={recaptchaRef}></Recaptcha>
                    </div>
                    : null}
                  <div className="mt-5 w-full flex gap-2 items-center justify-end">
                    <button
                      className={
                        `h-[36px] px-3 w-1/2 xl:w-1/3 text-center font-bold uppercase text-sm rounded-sm clipped-b-l ${
                          swappable
                            ? 'hover:opacity-95 cursor-pointer bg-gamefiGreen-600 text-gamefiDark'
                            : 'cursor-not-allowed bg-gamefiDark-400 text-gamefiDark'
                        }`
                      }
                      onClick={() => swappable && handleSwap()}
                    >Swap</button>
                    <button
                      className={
                        `h-[36px] px-3 w-1/2 xl:w-1/3 text-center font-bold uppercase text-sm rounded-sm clipped-t-r ${
                          approvable
                            ? 'hover:opacity-95 cursor-pointer bg-gamefiGreen-600 text-gamefiDark'
                            : 'cursor-not-allowed bg-gamefiDark-400 text-gamefiDark'
                        } ${loadingApproval && 'cursor-not-allowed hover:opacity-100'}`
                      }
                      onClick={() => approvable && handleApprove(ethers.constants.MaxUint256)}
                    >{!loadingApproval && ((allowance?.gt(0) || !usd?.address) ? 'Approved' : 'Approve')} {loadingApproval && <div className="dot-flashing mx-auto"></div>}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
      {
        now.getTime() < new Date(Number(poolData?.start_time || '0') * 1000).getTime() && <div className="my-4 w-full flex flex-col bg-gamefiDark-650 p-7 rounded">
          Not Swap Time Yet!
        </div>
      }
      {
        now.getTime() > new Date(Number(poolData?.finish_time || '0') * 1000).getTime() && <div className="my-4 w-full flex flex-col bg-gamefiDark-650 p-7 rounded">
          Pool Swap Time Is Over!
        </div>
      }
    </>
  )
}

export default Swap
