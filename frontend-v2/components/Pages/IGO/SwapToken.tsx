import React, { useEffect, useMemo, useRef, useState } from 'react'
import Recaptcha from '@/components/Base/Recaptcha'
import { useFetch } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import { getCurrency } from '@/components/web3/utils'
import { ethers } from 'ethers'
import { getContract } from '@/components/web3/contract'
import ERC20_ABI from '@/components/web3/abis/ERC20.json'
import toast from 'react-hot-toast'

const SwapToken = ({ poolData, userTier, loading }: { poolData: any; userTier: any; loading: boolean }) => {
  const [captchaToken, setCaptchaToken] = useState('')
  const [inputAmount, setInputAmount] = useState('0')
  const [swapable, setSwapable] = useState(false)

  const [currentTime, setCurrentTime] = useState(new Date())
  const { account, library } = useMyWeb3()

  const recaptchaRef: any = useRef()

  const onVerifyCapcha = (token: string | null) => {
    setCaptchaToken(token || '')
  }

  useEffect(() => {
    const checkSwapable = () => {
      if (poolData?.campaign_status?.toLowerCase() !== 'swap' || !poolData?.is_deploy || !userTier || loading || userTier?.max_buy === 0) return setSwapable(false)

      // const startBuyTime = poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined
      // const endBuyTime = poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined
      // console.log(startBuyTime, endBuyTime)
      // if (currentTime > endBuyTime || currentTime < startBuyTime) return setSwapable(false)

      setSwapable(true)
    }

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

  const handleSwap = () => {}

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
    <div className="flex w-full">
      <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium ${!swapable ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'}`} onClick={handleApprove}>Approve</button>
      <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium ${!swapable ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'}`} onClick={handleSwap}>Swap</button>
    </div>
  </div>)
}

export default SwapToken
