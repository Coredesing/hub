import React, { useEffect, useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonBase } from '@base-components/Buttons';
import { FormInputNumber } from '@base-components/FormInputNumber';
import { Box, makeStyles } from '@material-ui/core';
import SelectBox from '@base-components/SelectBox';
import clsx from 'clsx';
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
                marginBottom: '6px',
            },
            '& .form-input': {
                width: '100%',
                display: 'grid',
                // gridTemplateColumns: 'calc(100% - 150px) 120px',
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
            },
            '& .box-types': {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))',
                gridAutoRows: 'minmax(42px, auto)',
                gap: '8px',
                '& .box-type': {
                    '&.type': {
                        placeContent: 'start',
                    },
                    cursor: 'pointer',
                    padding: '5px 4px',
                    display: 'grid',
                    gridTemplateColumns: '40px auto',
                    gap: '5px',
                    alignItems: 'center',
                    placeContent: 'center',
                    border: '2px solid #555',
                    borderRadius: '4px',
                    transition: '0.3s',
                    position: 'relative',
                    '&.active, &:hover': {
                        border: '2px solid #72F34B',

                        '& span': {
                            color: '#fff',
                        }
                    },
                    '& .wrapper-icon': {
                        height: '35px',
                        width: '35px',
                        background: '#000',
                        display: 'grid',
                        alignItems: 'center',
                        placeItems: 'center',
                    },
                    '& .icon': {
                        width: '35px',
                        height: '20px',
                        objectFit: 'contain',
                    },

                    '& span': {
                        fontFamily: 'Firs Neue',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '12px',
                        color: '#AEAEAE',
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

const ListingNFTModal = ({ open,
    isLoadingButton,
    defaultValue,
    onApprove,
    isApproved,
    listAcceptTokens = [],
    onSelectToken,
    tokenSelected = {},
    ...props }: Props) => {
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
    const onChangeCurrency = (tokenSelected: any) => {
        onSelectToken(tokenSelected)
    }
    return (
        <CustomModal open={open} onClose={onClose}
            actions={
                <div className={styles.groupsButton}>
                    <ButtonBase color="grey" onClick={onClose} className="w-full text-transform-unset">
                        Cancel
                    </ButtonBase>
                    {
                        !isApproved ?
                            <ButtonBase color="green" onClick={onApprove} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton}>
                                Approve
                            </ButtonBase> :
                            <ButtonBase color="green" onClick={onConfirm} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton}>
                                List
                            </ButtonBase>
                    }
                </div>
            }
        >
            <div className={styles.wrapperContent}>
                <h3>Listing your NFT</h3>
                <div className="content">
                    <Box marginBottom="20px">
                        <h4>Enter Price</h4>
                        <div className="form-input">
                            <FormInputNumber value={inputPrice} onChange={onChangePrice} isPositive allowZero />
                        </div>
                    </Box>
                    <Box>
                        <h4>Select currency</h4>
                        <Box className="box-types" gridTemplateColumns="repeat(auto-fill, minmax(80px,1fr)) !important">
                            {
                                (listAcceptTokens).map((t: any, idx: number) => <Box
                                    key={t.address}
                                    onClick={() => onChangeCurrency(t)}
                                    gridTemplateColumns="20px auto !important"
                                    className={clsx("box-type", { active: t.address === tokenSelected.address })}>
                                    <div className={`wrapperImg-${idx}`} style={{ position: 'relative' }}>
                                        <img src={t.icon} className="icon" alt="" style={{ width: '20px', height: '20px' }}
                                            onError={(e: any) => {
                                                e.target.style.visibility = 'hidden';
                                            }}
                                        />
                                    </div>
                                    <span>{t.name}</span>
                                </Box>)
                            }
                        </Box>
                    </Box>
                </div>
            </div>
        </CustomModal>
    )
}

export default ListingNFTModal
