import React, { MouseEventHandler } from 'react'
import clsx from 'clsx';
import useStyles from '../style';

type Props = {
    onClick: MouseEventHandler,
    disabled?: boolean
}
export const ButtonBuy = ({
    disabled,
    onClick,
    ...props }: Props) => {
    const styles = useStyles();
    return (
        <button
            className={clsx(styles.buynow, {
                [styles.buyDisabled]: disabled,
            })}
            onClick={onClick}
            disabled={disabled}
        >
            buy now
        </button>
    )
}
