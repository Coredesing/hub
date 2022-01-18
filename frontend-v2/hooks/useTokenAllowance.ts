import { useState, useCallback } from 'react';
// import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { getContract } from '@/utils/web3';

import ERC20_ABI from '../abi/Erc20.json';
import { TokenType } from '@/common/types';

const useTokenAllowance = () => {
  const [tokenAllowanceLoading, setTokenAllowanceLoading] = useState<boolean>(false);

  const retrieveTokenAllowance = useCallback(async (token: TokenType | undefined, owner: string, spender: string) => {
    if (token && spender && owner
      && ethers.utils.isAddress(owner)
      && ethers.utils.isAddress(spender)
      && ethers.utils.isAddress(token.address)
    ) {
      setTokenAllowanceLoading(true);
      const contract = getContract(token.address, ERC20_ABI);

      if (contract) {
        let balance = await contract.allowance(owner, spender);
        balance = balance.toString();
        const allowanceReturn = new BigNumber(balance).div(new BigNumber(10).pow(token?.decimals as number || 0)).toNumber();
        setTokenAllowanceLoading(false);
        return allowanceReturn;
      }
      setTokenAllowanceLoading(false);
      return 0;
    }
  }, []);

  return {
    retrieveTokenAllowance,
    tokenAllowanceLoading
  }
}

export default useTokenAllowance;
