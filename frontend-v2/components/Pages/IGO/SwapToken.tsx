import React, { useEffect, useMemo, useRef, useState } from 'react'
import Recaptcha from '@/components/Base/Recaptcha'
import { debounce, fetcher, useFetch } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import { getCurrency } from '@/components/web3/utils'
import { BigNumber, ethers } from 'ethers'
import { getContract } from '@/components/web3/contract'
import ERC20_ABI from '@/components/web3/abis/ERC20.json'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/utils/constants'
import PRESALE_POOL_ABI from '@/components/web3/abis/PreSalePool.json'
import POOL_ABI from '@/components/web3/abis/Pool.json'

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || ''

const SwapToken = ({ poolData, userTier, loading }: { poolData: any; userTier: any; loading: boolean }) => {
  const [captchaToken, setCaptchaToken] = useState('')
  const [inputAmount, setInputAmount] = useState('0')
  const [swapable, setSwapable] = useState(false)
  const [approved, setApproved] = useState(false)

  const [currentTime, setCurrentTime] = useState(new Date())
  const { account, library } = useMyWeb3()

  const recaptchaRef: any = useRef()

  const onVerifyCapcha = (token: string | null) => {
    // TODO: show button swap here

    setCaptchaToken(token || '')
  }

  const onRefreshRecaptcha = debounce(() => {
    if (!captchaToken) return
    if (typeof recaptchaRef?.current?.resetCaptcha === 'function') {
      recaptchaRef.current.resetCaptcha()
    }
  }, 5000)

  useEffect(() => {
    const checkSwapable = () => {
      if (poolData?.campaign_status?.toLowerCase() !== 'swap' || !poolData?.is_deploy || !userTier || loading || userTier?.max_buy === 0) return setSwapable(false)

      // const startBuyTime = poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined
      // const endBuyTime = poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined
      // console.log(startBuyTime, endBuyTime)
      // if (currentTime > endBuyTime || currentTime < startBuyTime) return setSwapable(false)

      setSwapable(true)
    }

    // TODO: check approved token

    const clock = setInterval(() => setCurrentTime(new Date()), 1000)
    checkSwapable()
    console.log(userTier)
    setInputAmount(userTier?.max_buy || 0)

    return clearInterval(clock)
  }, [currentTime, loading, poolData, userTier])

  const handleApprove = async () => {
    const token = getCurrency(poolData)
    if (token && !token.address) {
      token.address = ethers.constants.AddressZero
    }
    const spender = poolData?.campaign_hash
    const owner = account
    try {
      console.log(token, spender, owner)
      if (token && spender && owner &&
        ethers.utils.isAddress(owner) &&
        ethers.utils.isAddress(spender) &&
        ethers.utils.isAddress(token.address)
      ) {
        // TODO: Loading here

        const contract = getContract(token.address, ERC20_ABI, library, account)
        console.log(contract)

        if (contract) {
          const transaction = await contract.approve(spender, ethers.constants.MaxInt256)
          const loading = toast.loading('Aproval is processing')

          const result = await transaction.wait(1)
          if (+result?.status === 1) {
            toast.success('Token Approve Successful!')
            toast.dismiss(loading)
          } else {
            toast.error('Token Approve Failed')
            toast.dismiss(loading)
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Token Approve Failed')
    }
  }

  const getUserSignature = async () => {
    let payload = {
      signature: '',
      minBuy: '0',
      maxBuy: '0'
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
        signature: authSignature,
        captcha_token: captchaToken
      })
    }
    const response = await fetcher(`${API_BASE_URL}/user/deposit`, config).catch(e => {
      toast.error(e?.message || 'Swap Token Failed')
      return payload
    })

    console.log(response)

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
    onRefreshRecaptcha()
    const abi = poolData?.buy_type?.toLowerCase() === 'claimable' ? PRESALE_POOL_ABI : POOL_ABI
    const poolContract = getContract(poolData?.campaign_hash, abi, library, account)
    const tokenIn = getCurrency(poolData)
    console.log(tokenIn.decimals)

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
          value: ethers.utils.parseUnits(inputAmount, tokenIn.decimals)
        }
      ]
      : [
        account,
        tokenIn.address,
        ethers.utils.parseUnits(inputAmount, tokenIn.decimals),
        account,
        maxBuy,
        minBuy,
        signature
      ]

    const loading = toast.loading('start swap token')
    console.log(method, params)
    const transaction = await poolContract[method](...params)
    const result = await transaction.wait(1)
    console.log(result)
    if (+result?.status === 1) {
      toast.success('Token Deposit Successful!')
    } else {
      toast.error('Token Deposit Failed')
    }
    toast.dismiss(loading)
  }

  return (<div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="0"
        name="amount"
        value={inputAmount}
        className="rounded-sm bg-gamefiDark-900 outline-none focus:outline-none border-gamefiDark-400"
        onChange={(e) => setInputAmount(e?.target?.value)}
      ></input>
    </div>
    {swapable && <Recaptcha onChange={onVerifyCapcha} ref={recaptchaRef}></Recaptcha>}
    <div className="grid gap-2 grid-cols-2 mt-8 w-full">
      <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium ${!swapable ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'}`} onClick={handleApprove}>Approve</button>
      <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium ${!swapable ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'}`} onClick={handleSwap}>Swap</button>
    </div>
  </div>)
}

export default SwapToken
