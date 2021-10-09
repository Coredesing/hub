import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { alertFailure, alertSuccess, alertWarning } from '@store/actions/alert';
import PreSaleBoxAbi from '@abi/PreSaleBox.json';
import { getContract } from '@utils/contract';
import _ from 'lodash';
import useApiBoxSignature from './useApiBoxSignature';
import {utils} from 'ethers'
import BN from 'bignumber.js';
import {handleErrMsg} from '../utils';
import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';

type PoolDepositActionParams = {
  subBoxId?: number;
  poolAddress: string;
  eventId?: number;
  poolId?: number;
  priceOfBox: number;
}

const useClaimBox = ({ subBoxId, poolAddress, eventId, poolId, priceOfBox }: PoolDepositActionParams) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React();
  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [isClaimedBoxSuccess, setClaimedSuccess] = useState<boolean>(false);
  const [claimBoxLoading, setClaimBoxLoading] = useState<boolean>(false);
  const { apiSignMessage, signature, setSignature, error } = useApiBoxSignature()
  const [amount, setAmount] = useState(0);

  const claimBox = useCallback(async (amount: number, captchaToken: string, eventId: number) => {
    setClaimedSuccess(false);
    setClaimTransactionHash('');
    if (!amount) return dispatch(alertFailure("Amount must be greater than zero"));
    setAmount(amount);
    if (account && _.isNumber(subBoxId) && library) {
      try {
        setClaimBoxLoading(true);

        await apiSignMessage({
          campaignId: poolId as number, captchaToken, amount, subBoxId: subBoxId as number, eventId
        });
      } catch (err) {
        setClaimBoxLoading(false);
        dispatch(alertSuccess("Error when signing message"));
      }
    }
  }, [subBoxId, account, library, apiSignMessage]);

  useEffect(() => {
    if (error && claimBoxLoading) {
      setClaimBoxLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (!signature || !claimBoxLoading) return;

    const handleClaimBox = async () => {
      try {
        const contract = getContract(poolAddress, PreSaleBoxAbi, library, account as string);
        const options = {
          value: utils.parseEther((new BN(amount).multipliedBy(new BN(priceOfBox))).toString())
        }
        const transaction = await contract.claimBox(eventId, amount, subBoxId, signature, options);
        setSignature("");
        setClaimTransactionHash(transaction.hash);
        dispatch(alertWarning("Request is processing!"));
        await transaction.wait(1);

        setClaimedSuccess(true);
        dispatch(alertSuccess("Box Claimed Successful"));

        setClaimBoxLoading(false);
      } catch (error: any) {
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
