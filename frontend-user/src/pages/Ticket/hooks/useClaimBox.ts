import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { alertFailure, alertSuccess, alertWarning } from '@store/actions/alert';
import PreSaleBoxAbi from '@abi/PreSaleBox.json';
import { getContract } from '@utils/contract';
import _ from 'lodash';
import useApiBoxSignature from './useApiBoxSignature';
import { utils } from 'ethers'
import BN from 'bignumber.js';
import { handleErrMsg } from '../utils';
import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import { ObjectType } from '@app-types';

type PoolDepositActionParams = {
  subBoxId?: number;
  poolAddress: string;
  eventId?: number;
  poolId?: number;
  priceOfBox?: number;
  tokenAddress?: string;
}

const useClaimBox = ({ subBoxId, poolAddress, eventId, poolId }: PoolDepositActionParams) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React();
  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [isClaimedBoxSuccess, setClaimedSuccess] = useState<boolean>(false);
  const [claimBoxLoading, setClaimBoxLoading] = useState<boolean>(false);
  const { apiSignMessage, signature, setSignature, error } = useApiBoxSignature()
  const [amount, setAmount] = useState(0);
  const [priceOfBox, setPriceOfBox] = useState<string | number>(0);
  const [tokenAddress, setTokenAddress] = useState<string>('');

  const claimBox = useCallback(async (amount: number, captchaToken: string, eventId: number, priceOfBox: string | number, tokenAddress: string) => {
    setClaimedSuccess(false);
    setClaimTransactionHash('');
    if (!amount) return dispatch(alertFailure("Amount must be greater than zero"));
    setAmount(amount);
    setTokenAddress(tokenAddress);
    setPriceOfBox(priceOfBox);
    if (account && _.isNumber(subBoxId) && library) {
      try {
        setClaimBoxLoading(true);

        await apiSignMessage({
          campaignId: poolId as number,
          captchaToken,
          amount,
          subBoxId: subBoxId as number,
          eventId,
          tokenAddress,
        });
      } catch (err) {
        setSignature('');
        setClaimBoxLoading(false);
        dispatch(alertSuccess("Error when signing message"));
      }
    }
  }, [subBoxId, account, library, apiSignMessage]);

  useEffect(() => {
    if (error) {
      setClaimBoxLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (!signature || !claimBoxLoading) return;

    const handleClaimBox = async () => {
      try {
        const contract = getContract(poolAddress, PreSaleBoxAbi, library, account as string);
        const options: ObjectType<any> = {};
        if (new BN(tokenAddress as string).isZero()) {
          options.value = utils.parseEther((new BN(amount).multipliedBy(new BN(priceOfBox))).toString())
        }
        const transaction = await contract.claimBox(eventId, tokenAddress, amount, subBoxId, signature, options);
        setSignature("");
        setClaimTransactionHash(transaction.hash);
        dispatch(alertWarning("Request is processing!"));
        const result = await transaction.wait(1);
        setClaimBoxLoading(false);
        if (+result?.status === 1) {
          dispatch(alertSuccess("Box Claimed Successful"));
          setClaimedSuccess(true);
        } else {
          dispatch(alertFailure("Box Claim Failed"));
          setClaimedSuccess(false);
        }
      } catch (error: any) {
        setSignature('');
        setClaimBoxLoading(false);
        const msgError = handleErrMsg(error) || TRANSACTION_ERROR_MESSAGE
        dispatch(alertFailure(msgError));
      }
    }

    handleClaimBox();
  }, [signature, claimBoxLoading, amount]);

  return {
    claimBox,
    claimBoxLoading,
    isClaimedBoxSuccess,
    claimTransactionHash
  }
}

export default useClaimBox;
