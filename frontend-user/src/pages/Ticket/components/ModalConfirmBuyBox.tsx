import React, { useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonBase } from '@base-components/Buttons';
import { Recapcha } from '@base-components/Recapcha';
import { makeStyles, Box } from '@material-ui/core';
import { formatRoundDown, numberWithCommas } from '@utils/formatNumber';
const useStyles = makeStyles((theme) => ({
    wrapperContent: {
        width: '100%',
        '& h3': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: '36px',
            color: '#FFFFFF',
            marginBottom: '16px',
        },
        '& .item': {
            '& label': {
                fontFamily: 'Firs Neue',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                color: '#FFFFFF',
                marginBottom: '12px',
            },
            '& span': {
                fontFamily: 'Firs Neue',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                color: '#FFFFFF',
                marginBottom: '12px',
            }
        }
    }
}));
type Props = {
    open: boolean;
    onClose?: Function,
    onConfirm?: Function,
    isLoadingButton?: boolean,
    [k: string]: any,
}

const ModalConfirmBuyBox = ({ open, isLoadingButton, amount, infoBox = {}, ...props }: Props) => {
    const styles = useStyles();
    const [isVerified, setVerify] = useState<string | null>('');

    const onClose = () => {
        props.onClose && props.onClose();
    }

    const onConfirm = () => {
        props.onConfirm && props.onConfirm(isVerified);
    }

    const onChangeRecapcha = (value: string | null) => {
        setVerify(value);
    }
    return (
        <CustomModal open={open} onClose={onClose}>
            <div className={styles.wrapperContent}>
                <h3>Confirmation</h3>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label>Amount</label>
                    <span className="text-uppercase">{numberWithCommas(amount)}</span>
                </Box>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label >Total</label>
                    <span className="text-uppercase">{+formatRoundDown(+amount * +infoBox.ether_conversion_rate || 0, 8)} {infoBox.accept_currency}</span>
                </Box>
                <Box>
                    <Recapcha onChange={onChangeRecapcha} />
                </Box>
                <ButtonBase color="green" onClick={onConfirm} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton || !isVerified}>
                    Confirm
                </ButtonBase>
            </div>
        </CustomModal>
    )
}

export default React.memo(ModalConfirmBuyBox)
