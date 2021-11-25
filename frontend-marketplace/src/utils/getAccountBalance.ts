import { ethers } from 'ethers';
import { ConnectorNames } from '../constants/connector';
import { ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, ChainDefault, APP_NETWORKS, APP_NETWORKS_SUPPORT } from '../constants/network';
import BigNumber from 'bignumber.js';
import erc20ABI from '@abi/Erc20.json';
import { getContractInstance } from '@services/web3';

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

const getAccountBalance = async (appChainID: string, walletChainID: string, connectedAccount: string, connector: string) => {
  if (appChainID && connectedAccount && connector) {
    const exactNetwork = appChainID === walletChainID;

    // const provider = 
    //  appChainID === ETH_CHAIN_ID 
    //    ? new ethers.providers.InfuraProvider(ETH_NETWORK_NAME, INFURA_KEY)
    //    : new ethers.providers.JsonRpcProvider(BSC_RPC_URL);

    const provider = getProvider(appChainID);

    const accountBalance = exactNetwork
      ? await provider.getBalance(connectedAccount)
      : { _hex: '0x00' }

    return accountBalance;
  }

  return { _hex: '0x00' };
}

export default getAccountBalance;

export const getAccountBalanceV1 = async (tokenAddress: string, accountAddress: string, options = { appChainId: ChainDefault.id, connectorName: ConnectorNames.MetaMask }): Promise<string> => {
  try {
    const provider = getProvider(options.appChainId as string);
    if (new BigNumber(tokenAddress).isZero()) {
      const balance = await provider.getBalance(accountAddress);
      return balance.toString();
    } else {
      const contract = getContractInstance(erc20ABI, tokenAddress, options.connectorName, options.appChainId);
      if (!contract) return '0';
      const balance = await contract.methods.balanceOf(accountAddress).call();
      return balance.toString();
    }
  } catch (error) {
    console.log('error when get balance', error);
    return '0';
  }
}

export const getSymbolCurrency = async (tokenAddress: string, options = { appChainId: ChainDefault.id, connectorName: ConnectorNames.MetaMask }): Promise<string> => {
  try {
    if (new BigNumber(tokenAddress).isZero()) {
      const currency = APP_NETWORKS_SUPPORT[options.appChainId as any]?.currency || ChainDefault.currency;
      return currency as string;
    } else {
      const contract = getContractInstance(erc20ABI, tokenAddress, options.connectorName, options.appChainId);
      if (!contract) return '';
      const symbol = await contract.methods.symbol().call();
      return symbol;
    }
  } catch (error) {
    console.log('error when get balance', error);
    return '';
  }
}
