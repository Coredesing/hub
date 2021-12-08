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
import { debounce } from '@utils/';

const useStyles = makeStyles((theme) => ({
    paper: {
        maxWidth: '440px !important',
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
            marginBottom: '24px',
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

const OfferNFTModal = ({ open,
    isLoadingButton,
    defaultValue,
    onApprove,
    currencySymbol,
    addressCurrencyToBuy,
    reloadedBalance,
    setReloadBalance,
    validChain,
    isApprovedToken,
    onApproveToken,
    lockingAction,
    checkFnIsLoading,
    lastOffer,
    ...props }: Props) => {
    const styles = useStyles();
    const [inputPrice, setInputPrice] = useState(0);
    const { connectedAccount } = useAuth();
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [notiMsg, setNotiMsg] = useState<{ type: 'info' | 'error', msg: string }>({ type: 'info', msg: '' });

    useEffect(() => {
        if (lastOffer) {
            setNotiMsg({ type: 'info', msg: `You already placed an offer for this hero with ${+lastOffer.amount} ${currencySymbol}.` })
        }
    }, [lastOffer])

    const onChangePrice = (event: any) => {
        const { value } = event.target;
        if (new BigNumber(addressBalance).lt(value)) {
            setNotiMsg({ type: 'error', msg: 'Insufficient balance' })
        } else if (lastOffer) {
            if (+value > +lastOffer.amount) {
                const numExceed = +value - +lastOffer.amount;
                setNotiMsg({ type: 'info', msg: `You already placed an offer for this hero with ${+lastOffer.amount} ${currencySymbol}. This offer will need ${numExceed} ${currencySymbol} more.` })
            } else {
                const numReturned = +lastOffer.amount - +value;
                if (+value && numReturned) {
                    setNotiMsg({ type: 'info', msg: `You had an offer at higher price of ${+lastOffer.amount} ${currencySymbol}. By placing this new offer, ${numReturned} ${currencySymbol} will be returned to your address.` });
                } else {
                    setNotiMsg({ type: 'info', msg: `You already placed an offer for this hero with ${+lastOffer.amount} ${currencySymbol}.` })
                }
            }
        }
        setInputPrice(value);
    };
    const onClose = () => {
        props.onClose && props.onClose();
    }
    const onConfirm = () => {
        let valueOffer = new BigNumber(inputPrice);
        let currentOffer = new BigNumber(inputPrice);
        if (lastOffer) {
            const lastPriceOffer = new BigNumber(+lastOffer.amount);
            if (lastPriceOffer.lt(currentOffer)) {
                valueOffer = currentOffer.minus(lastPriceOffer);
            } else {
                valueOffer = new BigNumber(0);
            }
        }
        if (new BigNumber(addressBalance).lt(inputPrice)) return;
        props.onConfirm && props.onConfirm(inputPrice, valueOffer.toString());
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
        if (!addressCurrencyToBuy || !connectedAccount || !validChain) {
            setAddressBalance('0');
            return;
        }
        getBalance();
    }, [addressCurrencyToBuy, validChain, connectedAccount, erc20Contract]);

    useEffect(() => {
        if (reloadedBalance) {
            getBalance();
        }
    }, [reloadedBalance])

    return (
        <CustomModal
            classes={{ paper: styles.paper }}
            open={open}
            onClose={onClose}
            actions={
                <div className={styles.groupsButton}>
                    <ButtonBase color="grey" onClick={onClose} className="w-full text-transform-unset mt-0-important" >
                        Cancel
                    </ButtonBase>
                    {
                        !isApprovedToken.ok ?
                            <ButtonBase
                                isLoading={checkFnIsLoading(onApproveToken.name)}
                                disabled={lockingAction.lock} color="green"
                                className="w-full text-transform-unset mt-0-important"
                                onClick={onApproveToken}>
                                Approve
                            </ButtonBase> :
                            <ButtonBase color="green" onClick={onConfirm}
                                className="w-full text-transform-unset mt-0-important"
                                isLoading={isLoadingButton} disabled={isLoadingButton || !(+inputPrice) || (new BigNumber(addressBalance).lt(inputPrice))}>
                                Confirm
                            </ButtonBase>
                    }
                </div>
            }
        >
            <div className={styles.wrapperContent}>
                <h3>Make Offer</h3>
                <div className="content">
                    <h4 style={{ display: 'flex', }}>You will offer (Currency: {currencySymbol && <Box display="grid" marginLeft="4px" gridTemplateColumns="24px auto" gridGap="4px" alignItems="center">
                        <img src={`/images/icons/${currencySymbol.toLowerCase()}.png`} style={{ width: '24px', height: '24px', background: '#000', borderRadius: '50%' }} alt="" />
                        {currencySymbol}
                    </Box>})</h4>
                    <div className="form-input">
                        <FormInputNumber value={inputPrice} onChange={onChangePrice} isPositive allowZero />
                    </div>
                    <Box marginTop="10px">
                        <span className="text-grey firs-neue-font font-12px">Your Wallet Balance:</span> <span className="bold firs-neue-font font-12px text-white">{numberWithCommas(addressBalance, 4)} {currencySymbol}</span>
                    </Box>
                    <Box marginTop="12px" minHeight="40px">
                        {!lastOffer ?
                            <p className="font-14px helvetica-font text-white">Once the offer becomes successful, you will own this product directly.</p> :
                            (
                                notiMsg.type === 'error' ?
                                    <p className="font-14px helvetica-font text-danger"> {notiMsg.msg} </p> :
                                    <p className="font-14px helvetica-font text-green-imp"> {notiMsg.msg} </p>
                            )

                        }
                    </Box>
                </div>
            </div>
        </CustomModal>
    )
}

export default OfferNFTModal
