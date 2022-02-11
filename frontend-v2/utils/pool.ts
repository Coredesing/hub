export const getTimelineOfPool = (pool: { [k: string]: any }) => {
  const startJoinPooltime = +pool.start_join_pool_time * 1000
  const endJoinPoolTime = +pool.end_join_pool_time * 1000
  const startBuyTime = +pool.start_time * 1000
  const startPreOrderTime = +pool.start_pre_order_time * 1000 || null
  const freeBuyTime = +pool.freeBuyTimeSetting?.start_buy_time * 1000 || null
  const finishTime = +pool.finish_time * 1000 || null
  return { startJoinPooltime, endJoinPoolTime, startBuyTime, freeBuyTime, finishTime, startPreOrderTime }
}

export const formatPoolType = (key: 0 | 1 | 2 | number) => {
  if (key === 0) return 'Public'
  if (key === 1) return 'Private'
  if (key === 2) return 'Seed'
  if (key === 3) return 'Community'
  return ''
}

export const formatPoolStatus = (status: string) => {
  const stt = String(status).toLowerCase()
  if (stt === 'filled' || stt === 'swap') return 'Opening'
  if (stt === 'ended') return 'Ended'
  if (stt === 'upcoming') return 'Upcoming'
  return status
}
