import React, { MouseEventHandler } from 'react'
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core";
import CircularProgress from '@base-components/CircularProgress';
const useStyles = makeStyles((theme: any) => ({
    btn: {
        outline: 'none',
        border: 'none',
        borderRadius: '2px',
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
            opacity: '.5',
            background: '#5d5d5d !important',
            color: '#dfdfdf'
        },
        '&.grey': {
            background: '#727272 !important',
            color: '#fff',
        },
        '&.green': {
            background: '#72F34B !important',
            color: '#000',
        },
        '&.yellow': {
            background: '#F3E24B !important',
            color: '#000',
        },
        '&.blue': {
            background: '#00E0FF !important',
            color: '#000',
        },
        '&.red': {
            background: '#F24B4B !important',
            color: '#fff',
        },
    },
}));
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
    const styles = useStyles();
    return (
        <button
            {...props}
            className={clsx(styles.btn, (!disabled ? color : '') , className, {
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

export default React.memo(ButtonBase);
