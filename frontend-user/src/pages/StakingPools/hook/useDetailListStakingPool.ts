import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useTypedSelector } from '../../../hooks/useTypedSelector';


import { getContractInstance, SmartContractMethod } from '../../../services/web3';

import STAKING_POOL_ABI from '../../../abi/StakingPool.json';
const TOKEN_ADDRESS = process.env.REACT_APP_PKF || '';
const useDetailListStakingPool = (
  poolsList: Array<any> | null | undefined,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allocPools, setAllocPools] = useState({});
  const [linearPools, setLinearPools] = useState({});
  const { appChainID }  = useSelector((state: any) => state.appNetwork).data;
  const connector  = useTypedSelector((state: any) => state.connector).data;
  const { account } = useWeb3React();

  const fetchDetailList = useCallback(async() => {
    try {
      if(!poolsList || !poolsList?.length) {
        return;
      }
      
      setLoading(true);

      let allocs = {};
      let linears = {};
      for (const pool of poolsList) {
        if (!pool?.pool_address || !ethers.utils.isAddress(pool?.pool_address)) {
          continue;
        }
        const contract = getContractInstance(STAKING_POOL_ABI, pool.pool_address, connector, appChainID, SmartContractMethod.Read, false);
        if (!contract) {
          continue;
        }

        const [/*allocEndBlockNumber, allocRewardPerBlock, allocRewardToken, totalAllocPoint, */linearAcceptedToken] = [TOKEN_ADDRESS] ||
        
        await Promise.all([
          // contract.methods.allocEndBlockNumber().call(),
          // contract.methods.allocRewardPerBlock().call(),
          // contract.methods.allocRewardToken().call(),
          // contract.methods.totalAllocPoint().call(),
          contract.methods.linearAcceptedToken().call(),
        ]);

        switch (pool.staking_type) {
          // case 'alloc':
          //   const allocData = await contract.methods.allocPoolInfo(BigNumber.from(pool.pool_id)).call();
          //   let allocPendingReward = "0"
          //   let allocPendingWithdrawals, allocUserInfo
          //   if (account) {
          //     [allocUserInfo, allocPendingReward, allocPendingWithdrawals] = await Promise.all([
          //       contract.methods.allocUserInfo(BigNumber.from(pool.pool_id), account).call(),
          //       contract.methods.allocPendingReward(BigNumber.from(pool.pool_id), account).call(),
          //       contract.methods.allocPendingWithdrawals(BigNumber.from(pool.pool_id), account).call()
          //     ])
          //   }

          //   allocs = {
          //     ...allocs,
          //     [pool.id]: {
          //       ...pool,
          //       rewardToken: allocRewardToken,
          //       rewardPerBlock: allocRewardPerBlock,
          //       endBlockNumber: allocEndBlockNumber,
          //       lpToken: allocData.lpToken, 
          //       lpSupply: allocData.lpSupply,
          //       allocPoint: allocData.allocPoint,
          //       totalAllocPoint: totalAllocPoint,
          //       lastRewardBlock: allocData.lastRewardBlock, 
          //       accRewardPerShare: allocData.accRewardPerShare, 
          //       delayDuration: allocData.delayDuration,
          //       stakingAmount: allocUserInfo?.amount || "0",
          //       pendingReward: allocPendingReward,
          //       pendingWithdrawal: {
          //         amount: allocPendingWithdrawals?.amount || "0",
          //         applicableAt: allocPendingWithdrawals?.applicableAt || "0",
          //       }
          //     }
          //   }
          //   break;
          
          case 'linear':
            let linearData: {[k: string]: any} = {};
            if('startJoinTime' in pool && 'endJoinTime' in pool ) {
              linearData = pool;
            } else {
              linearData = await contract.methods.linearPoolInfo(BigNumber.from(pool.pool_id)).call();
            }
            let linearPendingReward = "0"
            let linearPendingWithdrawal, linearUserInfo;
            if (account) {
              [linearUserInfo, linearPendingReward, linearPendingWithdrawal] = await Promise.all([
                contract.methods.linearStakingData(BigNumber.from(pool.pool_id), account).call(),
                '0' ?? contract.methods.linearPendingReward(BigNumber.from(pool.pool_id), account).call(),
                contract.methods.linearPendingWithdrawals(BigNumber.from(pool.pool_id), account).call()
              ])
            }
            linears = {
              ...linears,
              [pool.id]: {
                ...pool,
                acceptedToken: linearAcceptedToken,
                cap: linearData.cap, 
                totalStaked: linearData.totalStaked || '0', 
                minInvestment: linearData.minInvestment, 
                maxInvestment: linearData.maxInvestment, 
                APR: linearData.APR, 
                lockDuration: linearData.lockDuration, 
                delayDuration: linearData.delayDuration, 
                startJoinTime: linearData.startJoinTime, 
                endJoinTime: linearData.endJoinTime,
                stakingAmount: linearUserInfo?.balance || "0",
                stakingJoinedTime: linearUserInfo?.joinTime || "0",
                pendingReward: linearPendingReward,
                pendingWithdrawal: {
                  amount: linearPendingWithdrawal?.amount || "0",
                  applicableAt: linearPendingWithdrawal?.applicableAt || "0",
                }
              }
            }
            break;
        }
      }
      setAllocPools(allocs);
      setLinearPools(linears);
      setLoading(false);
    } catch (err) {
      console.log('[ERROR] - useTokenAllowance:', err);
      setLoading(false);
      // throw new Error(err.message);
    }
  }, [poolsList, account]);

  useEffect(()=>{
    fetchDetailList()
  }, [fetchDetailList])

  return {
    loading,
    fetchDetailList,
    allocPools,
    linearPools,
  }
}

export default useDetailListStakingPool;
