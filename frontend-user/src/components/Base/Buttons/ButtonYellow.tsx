import React, { MouseEventHandler } from 'react'
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core";
import CircularProgress from '@base-components/CircularProgress';
const useStyles = makeStyles((theme: any) => ({
    btnYellow: {
        outline: 'none',
        border: 'none',
        background: '#F3E24B !important',
        borderRadius: '2px',
        color: '#000',
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '28px',
        textAlign: 'center',
        padding: '13px 20px',
        textTransform: 'uppercase',
        minWidth: '200px',
        cursor: 'pointer',
        height: '52px',
        marginTop: '16px',
        '&.disabled': {
            opacity: '.5'
        }
    },
}));
type Props = {
    onClick: MouseEventHandler,
    disabled?: boolean,
    children: any,
    isLoading?: boolean,
    [k: string]: any
}
export const ButtonYellow = ({
    disabled,
    onClick,
    children,
    className,
    isLoading,
    ...props }: Props) => {
    const styles = useStyles();
    return (
        <button
            {...props}
            className={clsx(styles.btnYellow, className, {
                disabled: disabled,
            })}
            onClick={onClick}
            disabled={disabled}
        >
            {isLoading ? <div style={{ display: 'grid', gridTemplateColumns: '28px auto', gap: '5px', placeContent: 'center' }}>
                <CircularProgress />
                {children}
            </div> : children}
        </button>
    )
}
