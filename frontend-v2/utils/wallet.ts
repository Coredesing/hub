import { ethers } from 'ethers';
import { ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, ChainDefault, APP_NETWORKS_SUPPORT } from 'constants/network';
import BigNumber from 'bignumber.js';
import erc20ABI from 'abi/Erc20.json';
import { getContract } from './web3';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY || "";
const ETH_NETWORK_NAME = process.env.REACT_APP_ETH_NETWORK_NAME || "";
const BSC_RPC_URL = process.env.REACT_APP_BSC_RPC_URL || "";
const POLYGON_RPC_URL = process.env.REACT_APP_POLYGON_RPC_URL || "";

const getProvider = (chainId: string) => {
    switch (chainId) {
        case BSC_CHAIN_ID:
            return new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
        case POLYGON_CHAIN_ID:
            return new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
        case ETH_CHAIN_ID:
        default:
            return new ethers.providers.InfuraProvider(ETH_NETWORK_NAME, INFURA_KEY);
    }
};

type OptionsType = {
    appChainId?: string | number;
    connectorName?: string;
}

export const getAccountBalance = async (tokenAddress: string, accountAddress: string, options: OptionsType = { appChainId: ChainDefault.id, connectorName: 'MetaMask' }): Promise<string> => {
    try {
        const provider = getProvider(options.appChainId as string);
        if (new BigNumber(tokenAddress).isZero()) {
            const balance = await provider.getBalance(accountAddress);
            return balance.toString();
        } else {
            const contract = getContract(
                tokenAddress,
                erc20ABI,
                { network: { chainId: options.appChainId as any, name: options.connectorName } }
            );
            if (!contract) return '0';
            const balance = await contract.balanceOf(accountAddress);
            return balance.toString();
        }
    } catch (error) {
        console.log('error when get balance', error);
        return '0';
    }
}

export const getSymbolCurrency = async (tokenAddress: string, options: OptionsType = { appChainId: ChainDefault.id, connectorName: 'MetaMask' }): Promise<string> => {
    try {
        if (new BigNumber(tokenAddress).isZero()) {
            const currency = APP_NETWORKS_SUPPORT[options.appChainId as any]?.currency || ChainDefault.currency;
            return currency as string;
        } else {
            const contract = getContract(
                tokenAddress,
                erc20ABI,
                { network: { chainId: options.appChainId as any, name: options.connectorName } }
            );
            if (!contract) return '';
            const symbol = await contract.symbol();
            return symbol;
        }
    } catch (error) {
        console.log('error when get symbol', error);
        return '';
    }
}