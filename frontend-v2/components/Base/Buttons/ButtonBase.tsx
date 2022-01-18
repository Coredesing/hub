import React, { MouseEventHandler } from 'react'
import clsx from 'clsx';
import styles from './button.module.scss';
import {ClipLoader} from 'react-spinners';

type Props = {
    onClick?: MouseEventHandler,
    disabled?: boolean,
    children: any,
    isLoading?: boolean,
    color?: 'grey' | 'green' | 'yellow' | 'disabled' | 'blue' | 'red',
    [k: string]: any
}
export const ButtonBase = ({
    disabled,
    onClick,
    children,
    className,
    isLoading,
    color = 'grey',
    ...props }: Props) => {
    return (
        <button
            {...props}
            className={clsx(styles.base, (!disabled ? styles[color] : '') , className, {
                [styles.disabled]: disabled,
            })}
            onClick={onClick}
            disabled={disabled}
        >
            {isLoading ? <div style={{ display: 'grid', gridTemplateColumns: '28px auto', gap: '5px', placeContent: 'center' }}>
                <ClipLoader size={28} color='#fff' />
                {children}
            </div> : children}
        </button>
    )
}

export default React.memo(ButtonBase);
