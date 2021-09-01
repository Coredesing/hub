import React, { MouseEventHandler } from 'react'
import clsx from 'clsx';
import useStyles from '../style';

type Props = {
    onClick: MouseEventHandler,
    disabled?: boolean
}
export const ButtonClaim = ({
    disabled,
    onClick,
    ...props }: Props) => {
    const styles = useStyles();
    return (
        <button
            className={clsx(styles.btnClaim, {
                disabled: disabled,
            })}
            onClick={onClick}
            disabled={disabled}
        >
            Claim
        </button>
    )
}
