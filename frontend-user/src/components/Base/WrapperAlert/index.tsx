import React from 'react';
import clsx from 'clsx';
import useStyles from './style';
const iconWarning = "/images/warning-red.svg";

interface Props {
    type?: 'error' | 'info',
    [k: string]: any
}

export const WrapperAlert = ({ type = 'error', ...props }: Props) => {
    const classes = useStyles();
    return (
        <div className={clsx(classes.displayContent, props.className)}>
            <div className={clsx(classes.alert, type)}>
                {
                    type === 'error' && <img src={iconWarning} style={{ marginRight: "12px" }} alt="" />
                }
                {
                    type === 'info' && <img src={'/images/warning-white.svg'} style={{ marginRight: "12px" }} alt="" />
                }
                {
                    props.children
                }

            </div>
        </div>
    )
}
