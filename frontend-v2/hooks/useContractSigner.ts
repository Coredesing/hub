import { useState, useEffect } from 'react';
import { getContract } from "utils/web3";
import { utils } from 'ethers';

type ReturnType = {
    contract: any,
}

const useContractSigner = (abi: any, contractAddress: string, connectedAccount?: string): ReturnType => {
    const [contract, setContract] = useState<any>(null);
    useEffect(() => {
        if (!utils.isAddress(contractAddress) || !connectedAccount) return setContract(null);
        const contract = getContract(contractAddress, abi, {
            accountSigner: connectedAccount
        });
        if (!contract) return;
        setContract(contract);
    }, [contractAddress, connectedAccount]);

    return { contract };
}

export default useContractSigner;