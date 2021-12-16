import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';
import { getContract } from '../../../utils/contract';

import STAKING_POOL_ABI from '../../../abi/StakingPool.json';


const useLinearClaim = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined,
) => {
  const [tokenClaimLoading, setTokenClaimLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

    const linearClaimToken = useCallback(async () => {
      setTransactionHash("");

      try {
        if (poolAddress && ethers.utils.isAddress(poolAddress)) {
            setTokenClaimLoading(true);

             const contract = getContract(poolAddress, STAKING_POOL_ABI, library, account as string);

             if (contract) {
               const transaction = await contract.linearClaimReward(poolId);
               console.log('Claim Token', transaction);

              setTransactionHash(transaction.hash);

               await transaction.wait(1);

              dispatch(alertSuccess("Token Claimed Successful!"));
              setTokenClaimLoading(false);
             }
           }
      } catch (err: any) {
        console.log('[ERROR] - useLinearClaim:', err);
        dispatch(alertFailure(TRANSACTION_ERROR_MESSAGE));
        setTokenClaimLoading(false);
        throw new Error(err.message);
      }
  }, [poolAddress, poolId, library, account, dispatch]);

  return {
    tokenClaimLoading,
    linearClaimToken,
    setTokenClaimLoading,
    transactionHash
  }
}

export default useLinearClaim;
