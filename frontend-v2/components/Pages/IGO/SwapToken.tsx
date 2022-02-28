import React, { useEffect, useRef, useState } from 'react'
import Recaptcha from '@/components/Base/Recaptcha'
import { useFetch } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'

const SwapToken = ({ poolData, userTier, loading }: { poolData: any; userTier: any; loading: boolean }) => {
  const [captchaToken, setCaptchaToken] = useState('')
  const [inputAmount, setInputAmount] = useState('0')
  const [swapable, setSwapable] = useState(false)

  const [currentTime, setCurrentTime] = useState(new Date())

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
    <button className={`px-3 py-2 rounded-sm bg-gamefiGreen-700 text-black font-medium ${!swapable ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'}`}>Swap</button>
  </div>)
}

export default SwapToken
