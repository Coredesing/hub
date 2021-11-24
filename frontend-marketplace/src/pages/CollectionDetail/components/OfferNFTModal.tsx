import React, { useEffect, useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonBase } from '@base-components/Buttons';
import { FormInputNumber } from '@base-components/FormInputNumber';
import { makeStyles, Box } from '@material-ui/core';
import SelectBox from '@base-components/SelectBox';
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
                marginBottom: '8px',
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

const OfferNFTModal = ({ open, isLoadingButton, defaultValue, onApprove, isApproved, currencySymbol, ...props }: Props) => {
    const styles = useStyles();
    const [inputPrice, setInputPrice] = useState(0);
    const onChangePrice = (event: any) => {
        const { value } = event.target;
        setInputPrice(value);
    }
    const onClose = () => {
        props.onClose && props.onClose();
    }
    const onConfirm = () => {
        props.onConfirm && props.onConfirm(inputPrice);
    }

    return (
        <CustomModal open={open} onClose={onClose}
            actions={
                <div className={styles.groupsButton}>
                    <ButtonBase color="grey" onClick={onClose} className="w-full text-transform-unset" >
                        Cancel
                    </ButtonBase>
                    <ButtonBase color="green" onClick={onConfirm} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton}>
                        Offer
                    </ButtonBase>
                </div>
            }
        >
            <div className={styles.wrapperContent}>
                <h3>Offer NFT</h3>
                <div className="content">
                    <h4 style={{display: 'flex',}}>Offer Price (Currency: {currencySymbol && <Box display="grid" marginLeft="4px" gridTemplateColumns="24px auto" gridGap="4px" alignItems="center">
                        <img src={`/images/icons/${currencySymbol.toLowerCase()}.png`} style={{ width: '24px', height: '24px', background: '#000', borderRadius: '50%' }} alt="" />
                        {currencySymbol}
                    </Box>})</h4>
                    <div className="form-input">
                        <FormInputNumber value={inputPrice} onChange={onChangePrice} isPositive allowZero />
                    </div>
                </div>
            </div>
        </CustomModal>
    )
}

export default OfferNFTModal
