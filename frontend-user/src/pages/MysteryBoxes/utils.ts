import { getTimelineOfPool } from "@utils/index";

export const getCountdownInfo = (pool: { [k: string]: any }, compareTime: number = Date.now()) => {
    const time = getTimelineOfPool(pool);
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