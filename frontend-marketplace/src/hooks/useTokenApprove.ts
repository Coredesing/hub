import { alertWarning } from './../store/actions/alert';
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { TRANSACTION_ERROR_MESSAGE } from '../constants/alert';
import { MAX_INT } from '../services/web3';
import { alertSuccess, alertFailure } from '../store/actions/alert';
import { getContract } from '../utils/contract';
import { TokenType } from '../hooks/useTokenDetails';

import ERC20_ABI from '../abi/Erc20.json';
import { fixGasLimitWithProvider } from "../utils";

const useTokenAllowance = (
  token: TokenType | undefined,
  owner: string | null | undefined,
  spender: string | null | undefined,
  sotaABI: false
) => {
  const [response, setResponse] = useState<{ txHash?: string, loading?: boolean, error?: string }>({});
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

  const approveToken = useCallback(async () => {

    try {
      if (token && spender && owner
        && ethers.utils.isAddress(owner)
        && ethers.utils.isAddress(spender)
        && ethers.utils.isAddress(token.address)
      ) {
        setResponse({ loading: true });
        // setTokenApproveLoading(true);

        const contract = getContract(token.address, ERC20_ABI, library, account as string);

        if (contract) {
          // let overrides = fixGasLimitWithProvider(library, 'approve');
          // const transaction = await contract.approve(spender, MAX_INT, overrides);
          const transaction = await contract.approve(spender, MAX_INT);
          console.log('Approve Token', transaction);
          dispatch(alertWarning("Approval is processing!"));
          setResponse({ loading: true, txHash: transaction.hash })
          await transaction.wait(1);
          setResponse({ loading: false, txHash: transaction.hash })
          dispatch(alertSuccess("Token Approve Successful!"));
        } else {
          setResponse({ loading: false })
        }
      }
    } catch (err: any) {
      console.log('[ERROR] - useTokenAllowance:', err);
      const msgError = err.data?.message || err.message || TRANSACTION_ERROR_MESSAGE;
      dispatch(alertFailure(msgError));
      setResponse({ loading: false, error: msgError })
    }
  }, [owner, spender, token]);

  return {
    response,
    approveToken,
  }
}

export default useTokenAllowance;
