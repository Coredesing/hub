import React, { MouseEventHandler } from 'react';
import clsx from 'clsx';
import useStyles from '../style';

type Props = {
    descMinAmount: MouseEventHandler,
    descAmount: MouseEventHandler,
    ascAmount: MouseEventHandler,
    ascMaxAmount: MouseEventHandler,
    value: number,
    disabledMin?: boolean,
    disabledSub?: boolean,
    disabledAdd?: boolean,
    disabledMax?: boolean,
}

export const AscDescAmountBox = ({
    descMinAmount,
    descAmount,
    ascAmount,
    ascMaxAmount,
    value,
    disabledMin,
    disabledSub,
    disabledAdd,
    disabledMax,
    ...props
}: Props) => {
    const styles = useStyles();
    return (
        <div className={styles.amountBuy}>
        <span>Amount</span>
        <div>
            <span
                onClick={descMinAmount}
                className={clsx(styles.btnMinMax, "min", {
                    disabled: disabledMin,
                })}
            >
                Min
            </span>
            <span
                onClick={descAmount}
                className={clsx({
                    [styles.disabledAct]: disabledSub,
                })}
            >
                <svg
                    width="12"
                    height="3"
                    viewBox="0 0 12 3"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11.1818 0H0.818182C0.366544 0 0 0.366544 0 0.818182V1.3636C0 1.81524 0.366544 2.18178 0.818182 2.18178H11.1818C11.6334 2.18178 12 1.81524 12 1.3636V0.818182C12 0.366544 11.6334 0 11.1818 0Z"
                        fill="white"
                    />
                </svg>
            </span>
            <span>
                {value}
            </span>
            <span
                onClick={ascAmount}
                className={clsx({
                    [styles.disabledAct]: disabledAdd,
                })}
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11.343 5.06254H11.3437H6.93746V0.664585C6.93746 0.302634 6.64439 0 6.28244 0H5.71863C5.35678 0 5.06244 0.302634 5.06244 0.664585V5.06254H0.656293C0.294537 5.06254 0 5.35522 0 5.71727V6.28429C0 6.64605 0.294439 6.93746 0.656293 6.93746H5.06254V11.3513C5.06254 11.7131 5.35678 11.9999 5.71873 11.9999H6.28254C6.64449 11.9999 6.93756 11.713 6.93756 11.3513V6.93746H11.343C11.705 6.93746 12 6.64595 12 6.28429V5.71727C12 5.35522 11.705 5.06254 11.343 5.06254Z"
                        fill="white"
                    />
                </svg>
            </span>
            <span
                onClick={ascMaxAmount}
                className={clsx(styles.btnMinMax, "max", {
                    disabled: disabledMax,
                })}
            >
                Max
            </span>
        </div>
    </div>
    )
}
