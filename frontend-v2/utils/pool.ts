import { CLAIM_TYPE } from './constants'

export const getTimelineOfPool = (pool: { [k: string]: any }) => {
  const startJoinPooltime = +pool.start_join_pool_time * 1000
  const endJoinPoolTime = +pool.end_join_pool_time * 1000
  const startBuyTime = +pool.start_time * 1000
  const startPreOrderTime = +pool.start_pre_order_time * 1000 || null
  const freeBuyTime = +pool.freeBuyTimeSetting?.start_buy_time * 1000 || null
  const finishTime = +pool.finish_time * 1000 || null
  return { startJoinPooltime, endJoinPoolTime, startBuyTime, freeBuyTime, finishTime, startPreOrderTime }
}

export const getClaimTypes = (pool: any) => {
  if (!pool?.campaignClaimConfig?.length) {
    return []
  }

  const types = []
  pool?.campaignClaimConfig?.forEach(config => {
    const claimType = CLAIM_TYPE[Number(config?.claim_type)]

    const index = types.findIndex(type => type.name === claimType)
    if (index === -1) types.push({ id: config?.claim_type, name: claimType, value: 0 })
  })

  const keys = pool?.campaignClaimConfig?.map(item => item.claim_type)
  const results = []
  let previousValue = 0
  types.forEach(type => {
    const lastIndex = keys.lastIndexOf(type.id)
    const value = Number(pool?.campaignClaimConfig[lastIndex]?.max_percent_claim) - previousValue
    results.push({
      ...type,
      value: value > 0 ? value : 0
    })
    previousValue += value
  })
  return results
}
