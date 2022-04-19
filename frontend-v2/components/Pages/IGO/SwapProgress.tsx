import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { IGOContext } from '@/pages/igo/[slug]'
import { Contract, utils, constants, FixedNumber } from 'ethers'
import ABIPool from '@/components/web3/abis/Pool.json'
import { useContext, useEffect, useMemo, useState } from 'react'
import { printNumber } from '@/utils'
import { TIMELINE } from './constants'

const SwapProgress = () => {
  const { poolData, current, timeline } = useContext(IGOContext)
  const { provider } = useLibraryDefaultFlexible(poolData?.network_available)

  const poolContractReadonly = useMemo(() => {
    if (!poolData?.campaign_hash || !provider) {
      return null
    }

    return new Contract(poolData?.campaign_hash, ABIPool, provider)
  }, [provider, poolData])
  const [soldWithContract, setSoldWithContract] = useState(null)
  const total = useMemo(() => {
    if (!poolData?.total_sold_coin || !poolData?.decimals) {
      return constants.Zero
    }

    return utils.parseUnits(poolData.total_sold_coin, poolData.decimals)
  }, [poolData])
  const sold = useMemo(() => {
    return soldWithContract || constants.Zero
  }, [soldWithContract])
  const progress = useMemo(() => {
    if (timeline.findIndex(item => item.key === current?.key) > TIMELINE.BUYING_PHASE) {
      return 100
    }

    if (FixedNumber.from(total).isZero()) {
      return 0
    }

    const result = FixedNumber.from(sold).divUnsafe(FixedNumber.from(total)).mulUnsafe(FixedNumber.from(100)).toUnsafeFloat() + parseFloat(poolData?.progress_display || 0)

    if (result > 100) {
      return 100
    }

    return result
  }, [timeline, total, sold, poolData?.progress_display, current])

  const soldActual = useMemo(() => {
    return Math.ceil(progress / 100 * parseFloat(poolData.total_sold_coin) || 0)
  }, [progress, poolData])

  useEffect(() => {
    if (!poolContractReadonly) {
      return
    }

    poolContractReadonly.tokenSold().then(x => {
      setSoldWithContract(x)
    })

    const interval = setInterval(() => poolContractReadonly.tokenSold().then(x => {
      setSoldWithContract(x)
    }), 3000)

    return () => clearInterval(interval)
  }, [poolContractReadonly])

  return <div className="bg-gradient-to-b from-gamefiDark-630/30 via-gamefiDark-630/30 p-4 xl:p-6 2xl:p-7 rounded">
    <h4 className="font-bold uppercase text-lg">Swap Progress </h4>
    <div className="bg-gamefiDark-600 rounded mt-6">
      <div className="h-1.5 rounded bg-gradient-to-r from-yellow-300 to-gamefiGreen-500" style={{ width: `${progress.toLocaleString('en-US')}%` }}></div>
    </div>
    <div className="flex w-full justify-between font-casual text-[10px] text-white/50 mt-1">
      <span>{progress.toLocaleString('en-US')}%</span>
      <span>{soldActual.toLocaleString('en-US')} / {printNumber(poolData?.total_sold_coin || 0)}</span>
    </div>
  </div>
}

export default SwapProgress
