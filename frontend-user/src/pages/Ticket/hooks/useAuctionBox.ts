import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import axios, { HeadersSignature } from '../../../services/axios';
import { alertFailure, alertSuccess, alertWarning } from '@store/actions/alert';
import useWalletSignature from '../../../hooks/useWalletSignature';
import AuctionPoolAbi from '@abi/AuctionPool.json';
import { getContract } from '@utils/contract';
import BN from 'bignumber.js';
import { ObjectType } from '@app-types';
import { utils } from 'ethers';
import { handleErrMsg } from '../utils';
import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import useApiBoxSignature from './useApiBoxSignature';

type PoolDepositActionParams = {
    poolId?: number;
    connectedAccount?: string;
    poolDetails?: any;
    currencyInfo?: any;
    poolAddress?: string;
    subBoxId?: number;
}

const useAuctionBox = ({ poolId, currencyInfo, poolAddress, subBoxId }: PoolDepositActionParams) => {
    const dispatch = useDispatch();
    const { account, library } = useWeb3React();
    const { walletSignMessage, signature, setSignature, error } = useApiBoxSignature('/user/auction-box')
    const [amount, setAmount] = useState(0);
    const [auctionTxHash, setAuctionTxHash] = useState("");
    const [auctionSuccess, setAuctionSuccess] = useState<boolean>(false);
    const [auctionLoading, setAuctionLoading] = useState<boolean>(false);

    const auctionBox = useCallback(async (amount: number, captchaToken: string) => {
        setAuctionLoading(false);
        if (!amount) return dispatch(alertFailure("Amount must be greater than zero"));
        setAmount(amount);
        if (account && poolId && library) {
            try {
                setAuctionLoading(true);

                await walletSignMessage({
                    campaign_id: poolId,
                    captcha_token: captchaToken,
                    sub_box_id: subBoxId,
                    amount: utils.parseEther(new BN(amount).toString()).toString(),
                    token: currencyInfo?.address,
                });
            } catch (err) {
                setAuctionLoading(false);
                dispatch(alertSuccess("Error when signing message"));
            }
        }
    }, [poolId, account, library, walletSignMessage, currencyInfo, poolAddress, subBoxId]);

    useEffect(() => {
        if (error && auctionLoading) {
            setAuctionLoading(false);
        }
    }, [error]);

    useEffect(() => {
        if (!signature || !auctionLoading || !currencyInfo) return;
        const handleClaimBox = async () => {
            try {
                const contract = getContract(poolAddress as string, AuctionPoolAbi, library, account as string);
                const options: ObjectType<any> = {};
                if (new BN(currencyInfo.address as string).isZero()) {
                    options.value = utils.parseEther((new BN(amount)).toString())
                }
                const tx = await contract.bid(currencyInfo.address, utils.parseEther(amount + '').toString(), subBoxId, signature, options);
                setSignature("");
                setAuctionTxHash(tx.hash);
                dispatch(alertWarning("Request is processing!"));
                const result = await tx.wait(1);
                setAuctionLoading(false);
                if (+result?.status === 1) {
                    dispatch(alertSuccess("Box Auction Successful"));
                    setAuctionSuccess(true);
                } else {
                    dispatch(alertFailure("Box Auction Failed"));
                    setAuctionSuccess(false);
                }
            } catch (error: any) {
                console.log(';error', error)
                setSignature('');
                setAuctionLoading(false);
                const msgError = handleErrMsg(error) || TRANSACTION_ERROR_MESSAGE
                dispatch(alertFailure(msgError));
            }
        }

        handleClaimBox();
    }, [signature, auctionLoading, amount]);

    return {
        auctionBox,
        auctionTxHash,
        auctionSuccess,
        auctionLoading
    }
}

export default useAuctionBox;
