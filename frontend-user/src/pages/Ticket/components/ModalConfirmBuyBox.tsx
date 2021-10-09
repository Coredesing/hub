import React, { useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonBase } from '@base-components/Buttons';
import { Recapcha } from '@base-components/Recapcha';
import { makeStyles, Box } from '@material-ui/core';
import { numberWithCommas } from '@utils/formatNumber';
import BN from 'bignumber.js'
import { getCurrencyByNetwork } from '@utils/index';

const useStyles = makeStyles((theme) => ({
    paper: {
        maxWidth: '400px',
    },
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

const ModalConfirmBuyBox = ({ open, isLoadingButton, amount, infoBox = {}, boxTypeSelected = {}, ...props }: Props) => {
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
        <CustomModal open={open} onClose={onClose} classes={{
            paper: styles.paper
        }}>
            <div className={styles.wrapperContent}>
                <h3>Confirmation</h3>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label>Box Type</label>
                    <span className="text-uppercase">
                        <Box display="flex" alignItems="center" gridGap="4px">
                            <img src={boxTypeSelected.icon} width="40" height="25" />
                            {boxTypeSelected.name}
                        </Box>
                    </span>
                </Box>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label>Amount</label>
                    <span className="text-uppercase">{numberWithCommas(amount)}</span>
                </Box>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label >Total</label>
                    <span className="text-uppercase">{new BN(+amount).multipliedBy(new BN(+infoBox.ether_conversion_rate || 0)).toString()} {getCurrencyByNetwork(infoBox.network_available)}</span>
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
