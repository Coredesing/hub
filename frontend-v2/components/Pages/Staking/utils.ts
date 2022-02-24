import { shortenAddress } from '@/utils'
import { ObjectType } from '@/utils/types'

export const handleChangeStaking = (topsStaked: ObjectType[], currentStake: ObjectType, account = '') => {
  const idx = topsStaked.findIndex((e: ObjectType) => e.label === currentStake.label)
  if (idx < 0) return currentStake

  const before = topsStaked[idx + 1]
  if (!before) {
    return currentStake
  }
  currentStake.value.map((n: ObjectType, currRank: number) => {
    let beforeRank = before.value.findIndex((o: ObjectType) => o.wallet_address === n.wallet_address)
    currRank += 1
    beforeRank += 1
    n.isHighlight = n.wallet_address === shortenAddress(account, '*', 14, 13)
    if (beforeRank === 0) {
      n.steps = 0
    } else if (currRank === beforeRank) {
      n.steps = 0
    } else if (currRank < beforeRank) {
      n.steps = beforeRank - currRank
    } else {
      n.steps = -(currRank - beforeRank)
    }
    return n
  })
  return currentStake
}
