
import { useState, useEffect, useCallback } from 'react';
import { utils, BigNumber } from 'ethers';

import { alertActions } from '../../../store/constants/alert';

import stakingPoolABI from '../../../abi/Staking/StakingPool.json';
import { getContractInstance, getWeb3Instance } from '../../../services/web3';


const useContractDetail = (
  networkAvailable: string | null | undefined,
  contractAddress: string | null | undefined,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [contractDetail, setContractDetail] = useState({});
  // const { appChainID }  = useSelector((state: any) => state.appNetwork).data;

  const fetchContractDetail = useCallback(async() => {
    setContractDetail({});
    try {
      if (!contractAddress || !utils.isAddress(contractAddress) || !networkAvailable) {
        return;
      }

      const contract = getContractInstance(stakingPoolABI,  contractAddress || '', networkAvailable === 'eth');
      if (!contract) {
        throw new Error('Invalid contract');
      }

      setLoading(true);

      const [allocEndBlockNumber, allocRewardPerBlock, allocRewardToken, totalAllocPoint, linearAcceptedToken] = await Promise.all([
        contract.methods.allocEndBlockNumber().call(),
        contract.methods.allocRewardPerBlock().call(),
        contract.methods.allocRewardToken().call(),
        contract.methods.totalAllocPoint().call(),
        contract.methods.linearAcceptedToken().call(),
      ]);
      setContractDetail({allocEndBlockNumber, allocRewardPerBlock, allocRewardToken, totalAllocPoint, linearAcceptedToken})
      
      setLoading(false);
    } catch (err) {
      console.log('[ERROR] - useContractDetail:', err);
      setLoading(false);
      // throw new Error(err.message);
    }
  }, [networkAvailable, contractAddress]);

  useEffect(()=>{
    fetchContractDetail()
  }, [fetchContractDetail])

  return {
    loading,
    fetchContractDetail,
    contractDetail
  }
}

export default useContractDetail;