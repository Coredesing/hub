import React, { useEffect, useState } from 'react'
import { caclDiffTime, formatNumber, getDiffTime } from '@utils/index';
import useStyles from './style';
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
    time: CountDownTimeType,
    onFinish?: Function,
}
type PropsV2 = Props & {
    title?: string,
    isDislayTime?: boolean,
    dislayType?: 'vertical' | 'horizontal'
}
const isZero = (num: number) => num === 0;

export const CountDownTimeV1 = (props: Props) => {
    const styles = useStyles();
    const [time, setTime] = useState<DHMSType | { [k: string]: any }>({});
    const [isFinish, setFinish] = useState(false);

    useEffect(() => {
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
    }, [isFinish, props]);

    return (
        <div className={styles.cardBodyClock}>
            <div className="times">
                <span className="time">
                    <span className="number">
                        {formatNumber(time.days)}
                    </span>
                    <span className="text">
                        Day{time.days > 1 ? "s" : ""}
                    </span>
                </span>
                <span className="dot">:</span>
                <span className="time">
                    <span className="number">
                        {formatNumber(time.hours)}
                    </span>
                    <span className="text">
                        Hour{time.hours > 1 ? "s" : ""}
                    </span>
                </span>
                <span className="dot">:</span>
                <span className="time">
                    <span className="number">
                        {formatNumber(time.minutes)}
                    </span>
                    <span className="text">
                        Minute{time.minutes > 1 ? "s" : ""}
                    </span>
                </span>
                <span className="dot">:</span>
                <span className="time">
                    <span className="number">
                        {formatNumber(time.seconds)}
                    </span>
                    <span className="text">
                        Second{time.seconds > 1 ? "s" : ""}
                    </span>
                </span>
            </div>
        </div>
    )
}

export default CountDownTimeV1;

export const CountDownTimeV2 = (props: PropsV2) => {
    const styles = useStyles();

    const [time, setTime] = useState<DHMSType | { [k: string]: any }>({});
    const [isFinish, setFinish] = useState(false);
    useEffect(() => {
        if ('date1' in props.time) {
            setTime(getDiffTime(props.time.date1, props.time.date2))
        } else {
            setTime(props.time);
        }
    }, [props.time]);

    useEffect(() => {
        if (!props.time) return;
        if ('days' in props.time) {
            if (isZero(props.time.days) && isZero(props.time.hours) && isZero(props.time.minutes) && isZero(props.time.seconds)) return;
        }
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
    }, [isFinish]);
    return <div className={clsx(styles.boxTimeV2, props.dislayType || 'vertical')}>
        <div className={styles.boxTitleTimeV2}>
            <img src='/images/icons/bright.svg' alt="" />
            <span className={clsx(styles.text, 'sp1 text-uppercase')}>{props.title}</span>
        </div>
        <span className={styles.timeEnd}>
            {props.isDislayTime && (
                <>
                    <span>&nbsp;</span>
                    {time.days > 1 && <span>{formatNumber(time.days)} days</span>}
                    {time.days === 1 && <span>{formatNumber(time.days)} day</span>}
                    {time.days < 1 && time.hours >= 1 && (
                        <span>
                            <span>{formatNumber(time.hours)}h</span>
                            {time.minutes >= 1 && <span>&nbsp;:&nbsp;</span>}
                        </span>
                    )}
                    {time.days < 1 && time.minutes >= 1 && (
                        <span>
                            {<span>{formatNumber(time.minutes)}m</span>}
                            {time.hours < 1 && <span>&nbsp;:&nbsp;</span>}
                        </span>
                    )}
                    {time.days < 1 && time.hours < 1 && (
                        <span>{formatNumber(time.seconds)}s</span>
                    )}
                </>
            )}        
        </span>
    </div>
}
