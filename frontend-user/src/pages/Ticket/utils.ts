import { getContractInstance } from '../../services/web3';
import erc721ABI from '../../abi/Erc721.json';
import Erc20 from '../../abi/Erc20.json';
import { getContractAddress } from './getContractAddress';
import { POLYGON_CHAIN_ID } from '../../constants/network';
import { getContract } from '../../utils/contract';
import BigNumber from "bignumber.js";

export const getBalance = async (loginUser: string | null | undefined, tokenAddress: string, network: string, currency: string) => {
    if (!loginUser) return 0;
    const contract = getContractInstance(erc721ABI, tokenAddress, undefined, POLYGON_CHAIN_ID);
    if (contract) {
        const balance = await contract.methods.balanceOf(loginUser).call();
        return balance;
    }
    return 0;
};

export const isApproved = async (loginUser: string | null | undefined, tokenAddress: string, library: any, network: string, currency: string) => {
    if (!loginUser) return false;
    const AddressContract = getContractAddress(network, currency)
    const contract = getContract(AddressContract, Erc20, library, loginUser || '');
    if (contract) {
        const result = await contract.allowance(loginUser, tokenAddress);
        const n = result.toBigInt();
        return new BigNumber(n).gt(0);
    }
    return false;
};
