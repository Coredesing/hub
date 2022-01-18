import { useState, useEffect } from 'react';
import { ChainDefault } from 'constants/network';
import { utils } from 'ethers';
import { getContract } from 'utils/web3';

type ReturnType = {
    contract: any,
}

const useContract = (abi: any, contractAddress: string, appChainId?: string): ReturnType => {
    const [contract, setContract] = useState<any>(null);
    useEffect(() => {
        if (!utils.isAddress(contractAddress)) {
            setContract(null);
            return;
        };
        const contract = getContract(contractAddress, abi, { network: { chainId: (ChainDefault.id )as any, name: ChainDefault.name } });
        if (!contract) return;
        setContract(contract);
    }, [appChainId, contractAddress]);


    return { contract };
}

export default useContract;