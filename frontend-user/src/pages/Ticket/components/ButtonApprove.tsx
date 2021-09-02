import { CircularProgress } from '@material-ui/core'
import React, { MouseEventHandler } from 'react'
import useStyles from '../style';
type Props = {
    onClick: MouseEventHandler,
    isApproving?: boolean,
}

export const ButtonApprove = ({
    onClick,
    isApproving,
    ...props }: Props) => {
    const styles = useStyles();

    return (
        <button
            className={styles.btnApprove}
            onClick={onClick}
        >
            {isApproving ? <div style={{ display: 'grid', gridTemplateColumns: '28px auto', gap: '5px', placeContent: 'center' }}>
                <CircularProgress style={{ color: '#fff', width: '28px', height: '28px' }} />
                Approving
            </div> : 'Approve'}
        </button>
    )
}
