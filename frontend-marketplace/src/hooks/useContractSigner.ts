import { useState, useEffect } from 'react';
// import { useTypedSelector } from '../hooks/useTypedSelector';
import { useWeb3React } from '@web3-react/core';
import { getContract } from "@utils/contract";

type ReturnType = {
  contract: any,
}

const useContractSigner = (abi: any, contractAddress: string, connectedAccount?: string): ReturnType => {
  const [contract, setContract] = useState<any>(null);
  const { library } = useWeb3React();
  // const { appChainID } = useTypedSelector((state: any) => state.appNetwork).data;
  useEffect(() => {
    if (!contractAddress || !connectedAccount) return;
    const contract = getContract(contractAddress, abi, library, connectedAccount as string);
    if (!contract) return;
    setContract(contract);
  }, [contractAddress, connectedAccount]);

  return { contract };
}

export default useContractSigner;
