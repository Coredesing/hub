import React, { useEffect, useState } from 'react'
import { caclDiffTime, formatNumber, getDiffTime } from '@utils/index';
import useStyles from './style';

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
const isZero = (num: number) => num === 0;

export const CountDownTimeV1 = (props: Props) => {
    const styles = useStyles();
    const [time, setTime] = useState<DHMSType | {[k: string]: any}>({});
    const [isFinish, setFinish] = useState(false);

    useEffect(() => {
        if('date1' in props.time) {
            setTime(getDiffTime(props.time.date1, props.time.date2))
        } else {
            setTime(props.time);
        }
    }, [props.time])

    useEffect(() => {
        if(!props.time) return;
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
