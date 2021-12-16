import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { TRANSACTION_ERROR_MESSAGE } from '../../../constants/alert';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';
import { getContract } from '../../../utils/contract';

import STAKING_POOL_ABI from '../../../abi/StakingPool.json';


const useLinearStake = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined,
  amount: string | null | undefined,
) => {
  const [tokenStakeLoading, setTokenStakeLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

    const linearStakeToken = useCallback(async () => {
      setTransactionHash("");

      try {
        if (poolAddress && ethers.utils.isAddress(poolAddress)) {
            setTokenStakeLoading(true);

             const contract = getContract(poolAddress, STAKING_POOL_ABI, library, account as string);

             if (contract && amount) {
               const transaction = await contract.linearDeposit(poolId, ethers.utils.parseEther(amount));
               console.log('Stake Token', transaction);

              setTransactionHash(transaction.hash);

               await transaction.wait(1);

              dispatch(alertSuccess("Token Staked Successful!"));
              setTokenStakeLoading(false);
             }
           }
      } catch (err: any) {
        console.log('[ERROR] - useLinearStake:', err);
        dispatch(alertFailure(TRANSACTION_ERROR_MESSAGE));
        setTokenStakeLoading(false);
        throw new Error(err.message);
      }
  }, [poolAddress, poolId, amount, library, account, dispatch]);

  return {
    tokenStakeLoading,
    linearStakeToken,
    setTokenStakeLoading,
    transactionHash
  }
}

export default useLinearStake;
