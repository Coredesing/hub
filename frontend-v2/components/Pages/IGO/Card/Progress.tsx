import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { Contract, utils, constants, FixedNumber } from 'ethers'
import ABIPool from '@/components/web3/abis/Pool.json'
import { useEffect, useMemo, useState } from 'react'
import { printNumber } from '@/utils'
import { Item } from '../type'

const Progress = ({ poolData, isClaimTime }: { poolData: Item; isClaimTime: any }) => {
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
    if (isClaimTime) {
      return 100
    }

    if (FixedNumber.from(total).isZero()) {
      return 0
    }

    return FixedNumber.from(sold).divUnsafe(FixedNumber.from(total)).mulUnsafe(FixedNumber.from(100)).toUnsafeFloat() + parseFloat(poolData?.progress_display?.toString() || '0')
  }, [total, sold, poolData, isClaimTime])
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
  }, [poolContractReadonly])

  return <div className="">
    <h4 className="font-semibold uppercase text-sm text-white/50">Swap Progress</h4>
    <div className="bg-gamefiDark-600 rounded mt-1">
      <div className="h-1.5 rounded bg-gradient-to-r from-yellow-300 to-gamefiGreen-500" style={{ width: `${progress.toLocaleString('en-US')}%` }}></div>
    </div>
    <div className="flex w-full justify-between font-casual text-[10px] text-white/50 mt-1">
      <span>{progress.toLocaleString('en-US')}%</span>
      <span>{soldActual.toLocaleString('en-US')} / {printNumber(poolData?.total_sold_coin || 0)}</span>
    </div>
  </div>
}

export default Progress
