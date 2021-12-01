import React, { useEffect, useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonBase } from '@base-components/Buttons';
import { FormInputNumber } from '@base-components/FormInputNumber';
import { makeStyles, Box } from '@material-ui/core';
import SelectBox from '@base-components/SelectBox';
import BigNumber from 'bignumber.js';
import useContract from '@hooks/useContract';
import erc20ABI from '@abi/Erc20.json';
import useAuth from '@hooks/useAuth';
import { utils } from 'ethers'
import { numberWithCommas } from '@utils/formatNumber';
import getAccountBalance from '@utils/getAccountBalance';
import { useSelector } from 'react-redux';

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

const OfferNFTModal = ({ open, isLoadingButton, defaultValue, onApprove, isApproved, currencySymbol, addressCurrencyToBuy, reloadedBalance, setReloadBalance, ...props }: Props) => {
    const styles = useStyles();
    const [inputPrice, setInputPrice] = useState(0);
    const { connectedAccount } = useAuth();
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
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

    const [addressBalance, setAddressBalance] = useState('0');
    const { contract: erc20Contract } = useContract(erc20ABI, addressCurrencyToBuy);
    const getBalance = async () => {
        try {
            if (new BigNumber(addressCurrencyToBuy).isZero()) {
                const balance = await getAccountBalance(appChainID, appChainID, connectedAccount as string, 'metamask')
                setAddressBalance(utils.formatEther(balance.toString()));
            } else {
                if (!erc20Contract) return;
                const balance = await erc20Contract.methods.balanceOf(connectedAccount).call();
                setAddressBalance(utils.formatEther(balance.toString()));
            }
            setReloadBalance(false);
            setInputPrice(0);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!addressCurrencyToBuy || !connectedAccount) {
            setAddressBalance('0');
            return;
        }
        getBalance();
    }, [addressCurrencyToBuy, erc20Contract, connectedAccount]);

    useEffect(() => {
        if (reloadedBalance) {
            getBalance();
        }
    }, [reloadedBalance])

    return (
        <CustomModal open={open} onClose={onClose}
            actions={
                <div className={styles.groupsButton}>
                    <ButtonBase color="grey" onClick={onClose} className="w-full text-transform-unset" >
                        Cancel
                    </ButtonBase>
                    <ButtonBase color="green" onClick={onConfirm} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton}>
                        Confirm
                    </ButtonBase>
                </div>
            }
        >
            <div className={styles.wrapperContent}>
                <h3>Make Offer</h3>
                <div className="content">
                    <h4 style={{ display: 'flex', }}>Offer Price (Currency: {currencySymbol && <Box display="grid" marginLeft="4px" gridTemplateColumns="24px auto" gridGap="4px" alignItems="center">
                        <img src={`/images/icons/${currencySymbol.toLowerCase()}.png`} style={{ width: '24px', height: '24px', background: '#000', borderRadius: '50%' }} alt="" />
                        {currencySymbol}
                    </Box>})</h4>
                    <div className="form-input">
                        <FormInputNumber value={inputPrice} onChange={onChangePrice} isPositive allowZero />
                    </div>
                    <Box marginTop="10px">
                        (<span className="text-white firs-neue-font font-14px">Your Wallet Balance:</span> <span className="bold firs-neue-font font-14px text-white">{numberWithCommas(addressBalance, 4)} {currencySymbol}</span>)
                    </Box>
                </div>
            </div>
        </CustomModal>
    )
}

export default OfferNFTModal
