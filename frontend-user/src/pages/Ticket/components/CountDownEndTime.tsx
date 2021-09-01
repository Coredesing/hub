import React from 'react'
import { formatNumber } from '../../../utils';
import useStyles from '../style';
import { CountDownTimeType } from '../types';
type Props = {
    time: CountDownTimeType
}
export const CountDownEndTime = ({ time, ...props }: Props) => {
    const styles = useStyles();
    return (
        <span className={styles.timeEnd}>
        {formatNumber(time.days)}d :{" "}
        {formatNumber(time.hours)}h :{" "}
        {formatNumber(time.minutes)}m :{" "}
        {formatNumber(time.seconds)}s
      </span>
    )
}
