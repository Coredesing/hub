import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { alertSuccess, alertWarning, alertFailure } from '../../../store/actions/alert';
import StakingContest from '../../../abi/StakingContest.json';
import { getContract } from '../../../utils/contract';
import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import { handleErrMsg } from '../utils';
import BigNumber from 'bignumber.js';
type PoolDepositActionParams = {
  poolAddress?: string;
  token?: {[k: string]: any}
}

const useTicketBid = ({ poolAddress, token }: PoolDepositActionParams) => {
  const dispatch = useDispatch();
  const [resultBid, setResultBid] = useState<{ [k: string]: any }>({});
  const { library, account } = useWeb3React();

  const stake = useCallback(async (amount: number) => {
    try {
      if (!poolAddress || !account || !token) return;
      const contract = getContract(poolAddress, StakingContest, library, account);
      if (!contract) return;
      if (amount > 0) {
        setResultBid({ loading: true });
        const _amount = new BigNumber(amount).multipliedBy(10 ** token.decimals).toFixed();
        const transaction = await contract.stake(_amount);
        dispatch(alertWarning("Request is processing!"));
        setResultBid({ loading: true, transaction: transaction.hash });
        await transaction.wait(1);
        setResultBid(data => ({...data, loading: false, success: true }));
        dispatch(alertSuccess("Request is completed!"));
        return {success: true};
      }
      return {success: false, error: "The amount must be greater than zero"};
    } catch (error: any) {
      setResultBid({ loading: false, success: false });
      const message = handleErrMsg(error) || TRANSACTION_ERROR_MESSAGE;
      return {success: false, error: message};
    }

  }, [dispatch, poolAddress, account, library, token]);

  const claim = useCallback(async () => {
    try {
      if (!poolAddress || !account || !token) return;
      const contract = getContract(poolAddress, StakingContest, library, account);
      if (!contract) return;
      setResultBid({ loading: true });
      const transaction = await contract.claim();
      dispatch(alertWarning("Request is processing!"));
      setResultBid({ loading: true, transaction: transaction.hash });
      await transaction.wait(1);
      dispatch(alertSuccess("Request is completed!"));
      setResultBid(data => ({...data, loading: false, success: true }));
      return {success: true};
    } catch (error: any) {
      setResultBid({ loading: false, success: false });
      const message = handleErrMsg(error) || TRANSACTION_ERROR_MESSAGE;
      dispatch(alertFailure(message))
      return {success: false, error: message};
    }

  }, [dispatch, poolAddress, account, library, token])
  return {
    stake,
    claim,
    resultBid,
  };
}

export default useTicketBid;
