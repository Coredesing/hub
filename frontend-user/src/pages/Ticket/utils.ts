import { getContractInstance } from '../../services/web3';
import erc721ABI from '../../abi/Erc721.json';
import { getNetworkInfo } from '../../utils/network';

export const getBalance = async (loginUser: string | null | undefined, tokenAddress: string, network: string, currency: string) => {
    if (!loginUser) return 0;
    const contract = getContractInstance(erc721ABI, tokenAddress, undefined, getNetworkInfo(network).id);
    if (contract) {
        const balance = await contract.methods.balanceOf(loginUser).call();
        return balance;
    }
    return 0;
};

interface IError {
    data?: {
        message: string
    }
}
export const handleErrMsg = (err: IError) => {
    const message = err?.data?.message || '';
    if(message.includes('POOL::ENDED')) {
        return 'The sale has ended.';
    }
    if(message.includes('POOL:PURCHASE_AMOUNT_EXCEED_ALLOWANCE')) {
        return 'The number of Tickets you want to buy is greater than the number you can buy. Please try again.';
    }
    if(message.includes('POOL::AMOUNT_MUST_GREATER_THAN_CLAIMED')) {
        return 'You have already claimed.';
    }
    return '';
}

export const isEndPool = (status: string) => {
    return String(status).toLowerCase() === 'ended'
} 