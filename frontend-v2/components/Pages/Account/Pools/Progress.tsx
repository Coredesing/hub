
import { useMemo } from 'react'
import { roundNumber } from '@/utils/pool'

const Progress = ({ claimed, total }: { claimed: number; total: number }) => {
  const progress = useMemo(() => {
    if (total <= 0) {
      return 0
    }

    return roundNumber(claimed / total * 100, 2) < 100 ? roundNumber(claimed / total * 100, 2) : 100
  }, [total, claimed])

  return <div className="w-full">
    <div className="bg-gamefiDark-600 rounded mt-1">
      <div className={`h-1.5 rounded ${progress === 100 ? 'bg-gamefiDark-400' : 'bg-gradient-to-r from-yellow-300 to-gamefiGreen-500'}`} style={{ width: `${progress.toLocaleString('en-US')}%` }}></div>
    </div>
    <div className="flex w-full justify-between font-casual text-[10px] text-white/50 mt-1">
      <span>{progress.toLocaleString('en-US')}%</span>
      <span>{roundNumber(claimed || 0, 2)} / {roundNumber(total || 0, 2)}</span>
    </div>
  </div>
}

export default Progress
