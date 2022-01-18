import React, { useEffect, useState } from 'react'
import { caclDiffTime, formatNumber, getDiffTime } from '@/utils/index';
import styles from './countdown.module.scss';
import clsx from 'clsx';

type TimeStamp = number;

export type CountDonwRanges = {
    date1: TimeStamp,
    date2: TimeStamp,
}

export type DHMSType = {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}

export type CountDownTimeType = DHMSType | CountDonwRanges


type Props = {
    time: CountDownTimeType;
    onFinish?: Function;
    title?: string;
    [k: string]: any;
}

const isZero = (num: number) => num === 0;

export const CountDownTimeV1 = (props: Props) => {
    const [time, setTime] = useState<DHMSType | { [k: string]: any }>({});
    const [isFinish, setFinish] = useState(false);

    useEffect(() => {
        if (!props.time) return;
        if ('date1' in props.time) {
            setTime(getDiffTime(props.time.date1, props.time.date2))
        } else {
            setTime(props.time);
        }
    }, [props.time])

    useEffect(() => {
        if (!props.time) return;
        const interval = setInterval(() => {
            setTime((time: any) => {
                if (!time) return time;
                const newOpenTime = { ...time };
                if (isZero(newOpenTime.days) && isZero(newOpenTime.hours) && isZero(newOpenTime.minutes) && isZero(newOpenTime.seconds)) {
                    clearInterval(interval);
                    setFinish(true);
                    return newOpenTime;
                }
                return caclDiffTime(newOpenTime);
            })
        }, 1000);
        return () => {
            clearInterval(interval)
        };
    }, [props.time]);

    useEffect(() => {
        if (isFinish) {
            props.onFinish && props.onFinish();
        }
    }, [isFinish, props.onFinish]);

    return (
        <div className='w-full bg-black rounded'>
            {
                props.title && <div className='font-bold text-sm text-white pt-1 text-center'>
                    {props.title}
                </div>
            }
            <div className="times flex gap-2 items-center justify-center">

                <span className="time grid place-items-center sm:px-4 px-1 py-2">
                    <span className="number text-white sm:text-3xl text-2xl font-bold">
                        {formatNumber(time.days)}
                    </span>
                    <span className="text font-semibold sm:text-xs text-xs text-white uppercase">
                        Day{time.days > 1 ? "s" : ""}
                    </span>
                </span>
                <span className="dot sm:text-3xl text-2xl font-bold">:</span>
                <span className="time grid place-items-center sm:px-4 px-1 py-2">
                    <span className="number text-white sm:text-3xl text-2xl font-bold">
                        {formatNumber(time.hours)}
                    </span>
                    <span className="text font-semibold sm:text-xs text-xs text-white uppercase">
                        Hour{time.hours > 1 ? "s" : ""}
                    </span>
                </span>
                <span className="dot sm:text-3xl text-2xl font-bold">:</span>
                <span className="time grid place-items-center sm:px-4 px-1 py-2">
                    <span className="number text-white sm:text-3xl text-2xl font-bold">
                        {formatNumber(time.minutes)}
                    </span>
                    <span className="text font-semibold sm:text-xs text-xs text-white uppercase">
                        Minute{time.minutes > 1 ? "s" : ""}
                    </span>
                </span>
                <span className="dot sm:text-3xl text-2xl font-bold">:</span>
                <span className="time grid place-items-center sm:px-4 px-1 py-2">
                    <span className="number text-white sm:text-3xl text-2xl font-bold">
                        {formatNumber(time.seconds)}
                    </span>
                    <span className="text font-semibold sm:text-xs text-xs text-white uppercase">
                        Second{time.seconds > 1 ? "s" : ""}
                    </span>
                </span>
            </div>
        </div>
    )
}

export default CountDownTimeV1;
