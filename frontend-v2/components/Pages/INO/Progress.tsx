import { FixedNumber } from 'ethers'
import { useMemo } from 'react'
import { printNumber } from '@/utils'

type Props = {
  sold: number;
  total: number;
}

const Progress = ({ sold, total }: Props) => {
  const progress = useMemo(() => {
    if (FixedNumber.from(total).isZero()) {
      return 0
    }

    return FixedNumber.from(sold).divUnsafe(FixedNumber.from(total)).mulUnsafe(FixedNumber.from(100)).toUnsafeFloat()
  }, [total, sold])

  return <div className="w-full">
    <h4 className="font-semibold uppercase text-sm text-white/50">Progress</h4>
    <div className="bg-gamefiDark-600 rounded mt-1">
      <div className="h-1.5 rounded bg-gradient-to-r from-yellow-300 to-gamefiGreen-500" style={{ width: `${progress.toLocaleString('en-US')}%` }}></div>
    </div>
    <div className="flex w-full justify-between font-casual text-[10px] text-white/50 mt-1">
      <span>{progress.toLocaleString('en-US')}%</span>
      <span>{printNumber(sold || 0)} / {printNumber(total || 0)}</span>
    </div>
  </div>
}

export default Progress
