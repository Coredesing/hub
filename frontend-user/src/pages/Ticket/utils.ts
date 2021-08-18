import { getContractInstance } from '../../services/web3';
import erc721ABI from '../../abi/Erc721.json';
import { POLYGON_CHAIN_ID } from '../../constants/network';

export const getBalance = async (loginUser: string | null | undefined, tokenAddress: string, network: string, currency: string) => {
    if (!loginUser) return 0;
    const contract = getContractInstance(erc721ABI, tokenAddress, undefined, POLYGON_CHAIN_ID);
    if (contract) {
        const balance = await contract.methods.balanceOf(loginUser).call();
        return balance;
    }
    return 0;
};
