import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';
import { getContract } from '../../../utils/contract';

import STAKING_POOL_ABI from '../../../abi/StakingPool.json';
import { handleErrMsg } from '../utils';


const useSwitchPool = (
  poolAddress: string | null | undefined,
) => {
  const [switchPoolLoading, setSwitchPoolLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

  const linearSwitchPool = useCallback(async (fromPoolId: number, toPoolId: number) => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setSwitchPoolLoading(true);
        const contract = getContract(poolAddress, STAKING_POOL_ABI, library, account as string);

        if (contract) {
          const transaction = await contract.linearSwitch(fromPoolId, toPoolId);

          setTransactionHash(transaction.hash);

          const result = await transaction.wait(1);
          setSwitchPoolLoading(false);
          if (+result?.status === 1) {
            dispatch(alertSuccess("Switch Staking Pool Successful!"));
          } else {
            dispatch(alertFailure("Switch Staking Pool Failed"));
          }
        }
      }
    } catch (err: any) {
      console.log('[ERROR] - linearSwitch:', err);
      const msgError = handleErrMsg(err) || TRANSACTION_ERROR_MESSAGE;
      dispatch(alertFailure(msgError));
      setSwitchPoolLoading(false);
      // throw new Error(err.message);
    }
  }, [poolAddress, library, account, dispatch]);

  return {
    switchPoolLoading,
    linearSwitchPool,
    setSwitchPoolLoading,
    transactionHash
  }
}

export default useSwitchPool;
