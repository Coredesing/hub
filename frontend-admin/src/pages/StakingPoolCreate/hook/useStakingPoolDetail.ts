
import { useState, useEffect, useCallback } from 'react';
import { utils, BigNumber } from 'ethers';

import { alertActions } from '../../../store/constants/alert';

import stakingPoolABI from '../../../abi/Staking/StakingPool.json';
import { getContractInstance, getWeb3Instance } from '../../../services/web3';


const useStakingPoolDetail = (
  networkAvailable: string | null | undefined,
  contractAddress: string | null | undefined,
  poolType: string | null | undefined,
  poolId: string | null | undefined,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [poolDetail, setPoolDetail] = useState({});

  const fetchStakingPoolDetail = useCallback(async() => {
    try {
      if (!contractAddress || !utils.isAddress(contractAddress) || !networkAvailable) {
        return;
      }

      const contract = getContractInstance(stakingPoolABI,  contractAddress || '', networkAvailable === 'eth');
      if (!contract) {
        throw new Error('Invalid contract');
      }

      setLoading(true);
      const linearAcceptedToken = await contract.methods.linearAcceptedToken().call();

      switch (poolType) {
        case 'alloc':
          const [allocEndBlockNumber, allocRewardPerBlock, allocRewardToken, totalAllocPoint] = await Promise.all([
            contract.methods.allocEndBlockNumber().call(),
            contract.methods.allocRewardPerBlock().call(),
            contract.methods.allocRewardToken().call(),
            contract.methods.totalAllocPoint().call(),
          ]);

          const allocData = await contract.methods.allocPoolInfo(BigNumber.from(poolId)).call();
          setPoolDetail({
            rewardToken: allocRewardToken,
            rewardPerBlock: allocRewardPerBlock,
            endBlockNumber: allocEndBlockNumber,
            lpToken: allocData.lpToken, 
            lpSupply: allocData.lpSupply,
            allocPoint: allocData.allocPoint,
            totalAllocPoint: totalAllocPoint,
            lastRewardBlock: allocData.lastRewardBlock, 
            accRewardPerShare: allocData.accRewardPerShare, 
            delayDuration: allocData.delayDuration,
          });
          break;
        
        case 'linear':
          const linearData = await contract.methods.linearPoolInfo(BigNumber.from(poolId)).call();
          setPoolDetail({
              acceptedToken: linearAcceptedToken,
              cap: linearData.cap, 
              totalStaked: linearData.totalStaked, 
              minInvestment: linearData.minInvestment, 
              maxInvestment: linearData.maxInvestment, 
              APR: linearData.APR, 
              lockDuration: linearData.lockDuration, 
              delayDuration: linearData.delayDuration, 
              startJoinTime: linearData.startJoinTime, 
              endJoinTime: linearData.endJoinTime,
          })
          break;
      }

      setLoading(false);
    } catch (err: any) {
      console.log('[ERROR] - useContractDetail:', err);
      setLoading(false);
      // throw new Error(err.message);
    }
  }, [networkAvailable, contractAddress, poolType, poolId]);

  useEffect(()=>{
    fetchStakingPoolDetail()
  }, [fetchStakingPoolDetail])

  return {
    loading,
    fetchStakingPoolDetail,
    poolDetail
  }
}

export default useStakingPoolDetail;