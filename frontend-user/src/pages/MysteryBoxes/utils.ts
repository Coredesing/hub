import { POOL_STATUS_TEXT, POOL_STATUS } from "@app-constants";
import { ObjectType } from "@app-types";
import { getTimelineOfPool } from "@utils/index";
import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import { API_BASE_URL } from '../../services/axios'

export const getCountdownInfo = (pool: ObjectType<any>, compareTime: number = Date.now()) => {
    const time = getTimelineOfPool(pool);
    const ended = POOL_STATUS_TEXT[POOL_STATUS.CLOSED] === pool.campaign_status;
    // const isSoldOut = new BN(pool.token_sold).plus(+pool.token_sold_display || 0).gte(pool.total_sold_coin);
    const isSoldOut = false
    if (ended || isSoldOut) {
        return { date1: 0, date2: 0, title: 'Finished', isFinished: true };
    }
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

type PaginatorInput = {
    current: number;
    last: number;
    betweenFirstAndLast?: number;
};

type Paginator = {
    first: number;
    current: number;
    last: number;
    pages: Array<number>;
    leftCluster: boolean;
    rightCluster: boolean;
};

export const paginator = (options: PaginatorInput): Paginator | null => {
    const current = options.current
    const total = options.last
    const center = [current - 2, current - 1, current, current + 1, current + 2]
    const filteredCenter: number[] = center.filter((p) => p > 1 && p < total)
    const includeThreeLeft = current === 5,
        includeThreeRight = current === total - 4,
        includeLeftDots = current > 5,
        includeRightDots = current < total - 4;

    if (includeThreeLeft) filteredCenter.unshift(2)
    if (includeThreeRight) filteredCenter.push(total - 1)

    let leftCluster = false, rightCluster = false
    if (includeLeftDots) {
        leftCluster = true
    }

    if (includeRightDots) {
        rightCluster = true
    }

    return {
        current,
        first: 1,
        pages: filteredCenter,
        last: total,
        leftCluster,
        rightCluster
    }
};


export const useAxiosFetch = (url: string, timeout?: number) => {
    const [data, setData] = useState<AxiosResponse | null>(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unmounted = false;
        let source = axios.CancelToken.source();
        setLoading(true)
        axios.get(url, {
            baseURL: API_BASE_URL,
            cancelToken: source.token,
            timeout: timeout
        })
            .then(a => {
                if (!unmounted) {
                    // @ts-ignore
                    setData(a.data);
                    setLoading(false);
                }
            }).catch(function (e) {
            if (!unmounted) {
                setError(true);
                setErrorMessage(e.message);
                setLoading(false);
                if (axios.isCancel(e)) {
                    console.log(`request cancelled:${e.message}`);
                } else {
                    console.log("another error happened:" + e.message);
                }
            }
        });
        return function () {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, [url, timeout]);

    return {data, loading, error, errorMessage};
};
