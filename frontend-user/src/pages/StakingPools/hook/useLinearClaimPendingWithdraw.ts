import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';
import { getContract } from '../../../utils/contract';

import STAKING_POOL_ABI from '../../../abi/StakingPool.json';


const useLinearClaimPendingWithdraw = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

    const linearClaimPendingWithdraw = useCallback(async () => {
      setTransactionHash("");

      try {
        if (poolAddress && ethers.utils.isAddress(poolAddress)) {
            setLoading(true);

             const contract = getContract(poolAddress, STAKING_POOL_ABI, library, account as string);

             if (contract) {
               const transaction = await contract.linearClaimPendingWithdraw(poolId);
               console.log('linearClaimPendingWithdraw Token', transaction);

              setTransactionHash(transaction.hash);

               await transaction.wait(1);

              dispatch(alertSuccess("Claim Pending Withdraw Successful!"));
              setLoading(false);
             }
           }
      } catch (err: any) {
        console.log('[ERROR] - linearClaimPendingWithdraw:', err);
        dispatch(alertFailure(TRANSACTION_ERROR_MESSAGE));
        setLoading(false);
        throw new Error(err.message);
      }
  }, [poolAddress, poolId, library, account, dispatch]);

  return {
    loading,
    linearClaimPendingWithdraw,
    setLoading,
    transactionHash
  }
}

export default useLinearClaimPendingWithdraw;
