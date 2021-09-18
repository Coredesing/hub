import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { useTypedSelector } from '../../../hooks/useTypedSelector';
import Pool_ABI from '../../../abi/Pool.json';
import {getContractInstance, getPoolContract, SmartContractMethod} from '../../../services/web3';
import {NFT_PLUS_AMOUNT_PRODUCTION} from "../../../constants";
import {getProgressWithPools} from "../../../utils/campaign";

const DECIMAL_PLACES = 8;

const useTokenSoldProgress = (poolAddress: string | undefined, totalTokens: number | undefined, networkAvailable: string | undefined, poolDetails: any = {}) => {
  const [soldProgress, setSoldProgress] = useState<string>("0");
  const [tokenSold, setTokenSold] = useState<string>("0");

  const { appChainID }  = useTypedSelector(state  => state.appNetwork).data;
  const connector  = useTypedSelector(state => state.connector).data;
  let soldProgressInterval = undefined as any;

  useEffect(() => {
    const calSoldProgress = async () => {
      if (poolAddress && networkAvailable && totalTokens && ethers.utils.isAddress(poolAddress)) {
        // const poolContract = getContractInstance(
        //   Pool_ABI,
        //   poolAddress,
        //   connector,
        //   appChainID,
        //   SmartContractMethod.Read,
        //   networkAvailable === 'eth'
        // );

        const poolContract = getPoolContract({ networkAvailable, poolHash: poolAddress });

        if (poolContract) {
          const tokensSold = await poolContract.methods.tokenSold().call();
          let decimal = 18
          if (poolDetails && poolDetails.tokenDetails && poolDetails.tokenDetails.decimals) {
            decimal = poolDetails.tokenDetails.decimals
          }

          let tokensSoldCal = new BigNumber(tokensSold).div(new BigNumber(10).pow(decimal)).toFixed();
          if (poolDetails && poolDetails.tokenDetails && poolDetails.tokenDetails.token_type === 'erc721') {
            tokensSoldCal = tokensSold
          }

          let { progress, tokenSold, totalSoldCoin } = getProgressWithPools({
            ...poolDetails,
            token_sold: tokensSoldCal,
            tokenSold: tokensSoldCal,
            total_sold_coin: totalTokens,
            totalSoldCoin: totalTokens,
            finish_time: poolDetails.finish_time || poolDetails.endBuyTime,
          });

          setTokenSold(new BigNumber(tokenSold).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
          setSoldProgress(new BigNumber(progress).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
        }
      }
    };

    if (!poolAddress) {
      let { progress, tokenSold, totalSoldCoin } = getProgressWithPools({
        ...poolDetails,
        token_sold: 0,
        total_sold_coin: totalTokens,
        finish_time: poolDetails.finish_time || poolDetails.endBuyTime,
      });
      setTokenSold(new BigNumber(tokenSold).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
      setSoldProgress(new BigNumber(progress).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
    }

    if (poolAddress && networkAvailable) {
      calSoldProgress();
      soldProgressInterval = setInterval(() => calSoldProgress(), 20000);
    }

    return () => {
      soldProgressInterval && clearInterval(soldProgressInterval);
    }
  }, [poolAddress, appChainID, connector, networkAvailable, totalTokens]);

  return {
    tokenSold,
    soldProgress
  }
}


export default useTokenSoldProgress;
