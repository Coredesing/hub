import { POOL_STATUS_TEXT, POOL_STATUS } from "@app-constants";
import { ObjectType } from "@app-types";
import { getTimelineOfPool } from "@utils/index";
import BN from 'bignumber.js';

export const getCountdownInfo = (pool: ObjectType<any>, compareTime: number = Date.now()) => {
    const time = getTimelineOfPool(pool);
    // const ended = POOL_STATUS_TEXT[POOL_STATUS.CLOSED] === pool.campaign_status;
    // const isSoldOut = new BN(pool.token_sold).plus(+pool.token_sold_display || 0).gte(pool.total_sold_coin);
    // if (ended || isSoldOut) {
    //     return { date1: 0, date2: 0, title: 'Finished', isFinished: true };
    // }
    if (time.startJoinPooltime > compareTime) {
        return { date1: time.startJoinPooltime, date2: compareTime, title: 'Whitelist starts in', isUpcoming: true }
    }
    if (time.endJoinPoolTime > compareTime) {
        return { date1: time.endJoinPoolTime, date2: compareTime, title: 'Whitelist closes in', isUpcoming: true }
    }
    if (time.startBuyTime > compareTime) {
        return { date1: time.startBuyTime, date2: compareTime, title: 'Sale starts in', isUpcoming: true }
    }
    if (time.finishTime > compareTime) {
        return { date1: time.finishTime, date2: compareTime, title: 'Sale ends in', isOnsale: true }
    }
    return { date1: 0, date2: 0, title: 'Finished', isFinished: true }
}