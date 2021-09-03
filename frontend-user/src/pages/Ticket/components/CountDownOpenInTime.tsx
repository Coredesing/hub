import React from 'react'
import { formatNumber } from '../../../utils';
import useStyles from '../style';
import { CountDownTimeType } from '../types';
const brightIcon = "/images/icons/bright.svg";
type Props = {
    time: CountDownTimeType
}
export const CountDownOpenInTime = ({ time, ...props }: Props) => {
    const styles = useStyles();
    return (
        <div className={styles.cardBodyClock}>
            <h5>
                Open in
                <span className="open">
                    <img src={brightIcon} alt="" />
                </span>
            </h5>
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
