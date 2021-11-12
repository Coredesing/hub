import React, { useContext, useEffect, useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonBase } from '@base-components/Buttons';
import { Recapcha } from '@base-components/Recapcha';
import { makeStyles, Box, debounce } from '@material-ui/core';
import { numberWithCommas } from '@utils/formatNumber';
import BN from 'bignumber.js'
import { getCurrencyByNetwork } from '@utils/index';
import { AppContext } from '../../../AppContext';
import Erc20Abi from '@abi/Erc20.json';
import { getContractInstance } from '@services/web3';
import { useTypedSelector } from '@hooks/useTypedSelector';
import { useSelector } from 'react-redux';

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

const ModalConfirmBuyBox = ({ open, isLoadingButton, amount, infoBox = {}, boxTypeSelected = {}, tokenSeletected = {}, isClaimedBoxSuccess, ...props }: Props) => {
    const styles = useStyles();
    const connectorName = useTypedSelector(state => state.connector).data;
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const {
        currentConnectedWallet,
    } = useContext(AppContext);
    const currentAccount =
        currentConnectedWallet && currentConnectedWallet.addresses[0];

    const [balance, setBalance] = useState(0);
    // const balance = currentConnectedWallet
    //     ? currentConnectedWallet.balances[currentAccount]
    //     : 0;

    const totalBuy = new BN(+amount).multipliedBy(new BN(+tokenSeletected.price || 0)).toString()

    const [isVerified, setVerify] = useState<string | null>('');

    const onClose = () => {
        props.onClose && props.onClose();
    }

    const recaptchaRef: any = React.useRef();
    const onRefreshRecaptcha = debounce(() => {
        if (!isVerified) return;
        if (typeof recaptchaRef?.current?.reset === 'function') {
            recaptchaRef.current.reset();
        }
    }, 5000);

    const onConfirm = () => {
        if (new BN(balance).lt(totalBuy)) return;
        onRefreshRecaptcha();
        props.onConfirm && props.onConfirm(isVerified);
    }

    const onChangeRecapcha = (value: string | null) => {
        setVerify(value);
    }

    useEffect(() => {
        if (currentConnectedWallet?.balances?.[currentAccount])
            setBalance(currentConnectedWallet.balances[currentAccount])
    }, [currentConnectedWallet?.balances?.[currentAccount]]);

    const [reloadBalance, setReloadBalance] = useState(true);
    useEffect(() => {
        if (isClaimedBoxSuccess || tokenSeletected?.id) {
            setReloadBalance(true);
        }
    }, [isClaimedBoxSuccess, tokenSeletected?.id]);

    useEffect(() => {
        if (!currentAccount) return;
        if (tokenSeletected.neededApprove && reloadBalance) {
            const contract = getContractInstance(Erc20Abi, tokenSeletected.address, connectorName, appChainID);
            if (contract) {
                contract.methods.balanceOf(currentAccount).call().then((balance: string) => {
                    const _bl = new BN(balance).dividedBy(new BN(10 ** +tokenSeletected.decimals)).toFixed(4);
                    setBalance(+_bl);
                    setReloadBalance(false);
                })
            }
            return;
        }
        if (reloadBalance) {
            setBalance(currentConnectedWallet?.balances?.[currentAccount] || 0);
            setReloadBalance(false);
        }
    }, [tokenSeletected, appChainID, connectorName, currentAccount, reloadBalance]);

    useEffect(() => {
        if (!currentAccount) {
            setBalance(0);
        }
    }, [currentAccount])
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
                            <img src={boxTypeSelected.icon} width="40" height="25" style={{objectFit: 'contain'}} />
                            {boxTypeSelected.name}
                        </Box>
                    </span>
                </Box>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label>Amount</label>
                    <span className="text-uppercase">{numberWithCommas(amount)}</span>
                </Box>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label >Your Balance</label>
                    <span className="text-uppercase">{numberWithCommas(new BN(+balance).toString(), 4)} {tokenSeletected.neededApprove ? tokenSeletected.name : getCurrencyByNetwork(infoBox.network_available)}</span>
                </Box>
                <Box display="flex" justifyContent="space-between" className="item">
                    <label >Total</label>
                    <span className="text-uppercase">
                        {totalBuy} {tokenSeletected.neededApprove ? tokenSeletected.name : getCurrencyByNetwork(infoBox.network_available)}
                        {/* {getCurrencyByNetwork(infoBox.network_available)} */}
                    </span>
                </Box>
                <Box>
                    <Recapcha onChange={onChangeRecapcha} ref={recaptchaRef} />
                </Box>
                <ButtonBase color="green" onClick={onConfirm} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton || !isVerified || new BN(balance).lt(totalBuy)}>
                    Confirm
                </ButtonBase>
            </div>
        </CustomModal>
    )
}

export default React.memo(ModalConfirmBuyBox)
