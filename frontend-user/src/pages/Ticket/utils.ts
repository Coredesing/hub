import { getContractInstance } from '../../services/web3';
import erc721ABI from '../../abi/Erc721.json';
import StakingContest from '../../abi/StakingContest.json';
import { getNetworkInfo } from '../../utils/network';
import { ResultStaked } from './types';
import { calcPercentRate } from '@utils/index';

type Address = string;


export const getBalance = async (loginUser: Address | null | undefined, tokenAddress: Address, network: string, currency: string) => {
    if (!loginUser) return 0;
    const contract = getContractInstance(erc721ABI, tokenAddress, undefined, getNetworkInfo(network).id);
    if (contract) {
        const balance = await contract.methods.balanceOf(loginUser).call();
        return balance;
    }
    return 0;
};

export const getUserStaked = async (loginUser: Address | null | undefined, campaignHash: Address, network: string, currency: string) => {
    const result: ResultStaked = { staked: 0, lastTime: 0 };
    if (!loginUser) return result;
    const contract = getContractInstance(StakingContest, campaignHash, undefined, getNetworkInfo(network).id);
    if (contract) {
        const infoStaked = await contract.methods.getUserStake(loginUser).call();
        result.staked = +infoStaked[0];
        result.lastTime = +infoStaked[1];
    }
    return result;
};

// interface IError extends Error {
//     data?: {
//         message: string
//     },
//     [k: string]: any
// }
export const handleErrMsg = (err: any) => {
    const message = err?.data?.message || '';
    if (message.includes('POOL::ENDED')) {
        return 'The sale has ended.';
    }
    if (message.includes('POOL:PURCHASE_AMOUNT_EXCEED_ALLOWANCE')) {
        return 'The number of Tickets you want to buy is greater than the number you can buy. Please try again.';
    }
    if (message.includes('POOL::AMOUNT_MUST_GREATER_THAN_CLAIMED')) {
        return 'You have already claimed.';
    }
    if (message.includes('transfer amount exceeds balance')) {
        return 'Not enough balance.';
    }
    if (message.includes('User has already claimed')) {
        return 'User has already claimed.';
    }
    if (message.includes('Event::ENDED')) {
        return 'The event has ended.';
    }
    if (message.includes('NFTBox: Rate limit exceeded')) {
        return 'You have reached the limit of buying boxes.';
    }
    return message || err.message;
}

export const isEndPool = (status: string) => {
    return String(status).toLowerCase() === 'ended'
}

export const calcProgress = (sold: number, total: number) => {
    return calcPercentRate(sold, total);
};

export const getRemaining = (totalTicket: number, totalSold: number) => {
    return +totalTicket - +totalSold || 0;
};

export const isBidorStake = (type: string) => {
    return type === 'only-bid' || type === 'only-stake';
}

export const isMysteryBox = (type: string) => {
    return type === 'box';
}

export const isAuctionBox = (type: string) => {
    return type === 'auction-box';
}