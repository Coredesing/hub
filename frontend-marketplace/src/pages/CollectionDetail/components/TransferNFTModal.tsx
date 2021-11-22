import React, { useEffect, useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonBase } from '@base-components/Buttons';
import { FormInputNumber } from '@base-components/FormInputNumber';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    wrapperContent: {
        width: '100%',
        '& h3': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '24px',
            color: '#FFFFFF',
            marginBottom: '12px',
        },
        '& .input': {
            background: '#171717',
            color: '#FFFFFF',
            border: '1px solid #44454B',
        },
        '& .content': {
            '& h4': {
                fontFamily: 'Firs Neue',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                color: '#FFFFFF',
                marginBottom: '12px',
            },
            '& .form-input': {
                width: '100%',
                '& input': {
                    width: '100%',
                    padding: '8px 30px 8px 12px',
                    fontFamily: 'Firs Neue',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '14px',
                    lineHeight: '22px',
                    color: '#FFFFFF',
                    margin: 0,
                    position: 'relative',
                    background: '#171717',
                    borderRadius: '4px',
                    border: '1px solid #44454B',
                    boxSizing: 'border-box',
                    outline: 'none',
                    '&::-webkit-input-placeholder': { /* Edge */
                        color: '#AEAEAE',
                    },

                    '&:-ms-input-placeholder': {
                        color: '#AEAEAE',
                    },

                    '&::placeholder': {
                        color: '#AEAEAE'
                    }
                }
            }
        }
    },
    groupsButton: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
    }

}));
type Props = {
    open: boolean;
    onClose?: Function,
    onConfirm?: Function,
    isLoadingButton?: boolean,
    [k: string]: any,
}

const TransferNFTModal = ({ open, isLoadingButton, defaultValue, ...props }: Props) => {
    const styles = useStyles();
    const [receiverAddress, setReceiverAddress] = useState('');
    const onChangeReceiverAddress = (event: any) => {
        const { value } = event.target;
        setReceiverAddress(value);
    }
    const isApproved = false;
    const onClose = () => {
        props.onClose && props.onClose();
    }
    const onConfirm = () => {
        props.onConfirm && props.onConfirm(receiverAddress);
    }

    return (
        <CustomModal open={open} onClose={onClose}
            actions={
                <div className={styles.groupsButton}>
                    <ButtonBase color="grey" onClick={onClose} className="w-full text-transform-unset" >
                        Cancel
                    </ButtonBase>
                    <ButtonBase color="green" onClick={onConfirm} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton}>
                        OK
                    </ButtonBase>
                </div>
            }
        >
            <div className={styles.wrapperContent}>
                <h3>Transfer your NFT</h3>
                <div className="content">
                    <h4>Receiver Address</h4>
                    <div className="form-input">
                        <input type="text" onChange={onChangeReceiverAddress} value={receiverAddress} placeholder="Enter Receiver Address" />
                    </div>
                </div>
            </div>
        </CustomModal>
    )
}

export default TransferNFTModal
