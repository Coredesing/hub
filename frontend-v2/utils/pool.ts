export const getTimelineOfPool = (pool: { [k: string]: any }) => {
    const startJoinPooltime = +pool.start_join_pool_time * 1000
    const endJoinPoolTime = +pool.end_join_pool_time * 1000;
    const startBuyTime = +pool.start_time * 1000;
    const startPreOrderTime = +pool.start_pre_order_time * 1000 || null;
    const freeBuyTime = +pool.freeBuyTimeSetting?.start_buy_time * 1000 || null;
    const finishTime = +pool.finish_time;
    return { startJoinPooltime, endJoinPoolTime, startBuyTime, freeBuyTime, finishTime, startPreOrderTime }
}