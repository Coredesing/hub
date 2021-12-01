import { useState, useEffect } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useWeb3React } from '@web3-react/core';
import { getContractInstance } from '@services/web3';
import { ChainDefault } from '../constants/network';

type ReturnType = {
  contract: any,
}

const useContract = (abi: any, contractAddress: string, appChainId?: string): ReturnType => {
  const { active, account, chainId } = useWeb3React();
  const [contract, setContract] = useState<any>(null);
  // const walletsInfo = useTypedSelector(state => state.wallet).entities;
  // const connectorName = useTypedSelector(state => state.connector).data;
  const { appChainID } = useTypedSelector((state: any) => state.appNetwork).data;
  appChainId = appChainId || appChainID
  useEffect(() => {
    if (!contractAddress) {
      setContract(null);
      return;
    };
    const contract = getContractInstance(abi, contractAddress, undefined, appChainId || ChainDefault.id);
    if (!contract) return;
    setContract(contract);
  }, [appChainId, contractAddress]);


  return { contract };
}

export default useContract;
