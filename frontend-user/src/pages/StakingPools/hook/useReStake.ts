import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';
import { getContract } from '../../../utils/contract';
import STAKING_POOL_ABI from '../../../abi/StakingPool.json';

const useReStake = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined,
) => {
  const [tokenReStakeLoading, setReStakeLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

  const reStakeToken = useCallback(async () => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setReStakeLoading(true);

        const contract = getContract(poolAddress, STAKING_POOL_ABI, library, account as string);

        if (contract) {
          const transaction = await contract.linearReStake(poolId);
          setTransactionHash(transaction.hash);
          const result = await transaction.wait(1);
          setReStakeLoading(false);
          if (+result?.status === 1) {
            dispatch(alertSuccess("Restake Successful!"));
          } else {
            dispatch(alertFailure("Restake Failed"));
          }
        }
      }
    } catch (err: any) {
      console.log('[ERROR] - Restake:', err);
      dispatch(alertFailure(TRANSACTION_ERROR_MESSAGE));
      setReStakeLoading(false);
      throw new Error(err.message);
    }
  }, [poolAddress, poolId, library, account, dispatch]);

  return {
    tokenReStakeLoading,
    reStakeToken,
    setReStakeLoading,
    transactionHash
  }
}

export default useReStake;
