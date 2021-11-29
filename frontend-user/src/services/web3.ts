import Web3 from 'web3';
import WalletLink from "walletlink";
import { connectorNames, ConnectorNames, connectorsByName } from '../constants/connectors';
import { ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, ChainDefault } from '../constants/network';
import {NETWORK_AVAILABLE} from "../constants";

const POOL_ABI = require('../abi/Pool.json');

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL || "";
const BSC_NETWORK_URL = process.env.REACT_APP_BSC_RPC_URL || "";
const POLYGON_NETWORK_URL = process.env.REACT_APP_POLYGON_RPC_URL || "";
export const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export enum SmartContractMethod {
  Write = "Write",
  Read = "Read"
}

type smartContractMethod = Extract<SmartContractMethod, SmartContractMethod.Write | SmartContractMethod.Read>

export const getWeb3Instance = () => {
  const windowObj = window as any;
  const { ethereum, web3 } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    return new Web3(ethereum);
  }
  if (web3) {
    return new Web3(web3.currentProvider);
  }
  return null;
};

export const isMetaMaskInstalled = () => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  return ethereum && ethereum.isMetaMask;
};

export const appHttpProvider= {
  providers: {
    [ETH_CHAIN_ID]: new Web3.providers.HttpProvider(NETWORK_URL),
  },
  getProvider(chainId: string, url: string) {
    if(!this.providers[chainId]) {
      this.providers[chainId] = new Web3.providers.HttpProvider(url)
    }
    return this.providers[chainId];
  }
}


export const getProviderByNetwork = (
  networkName: connectorNames,
  appChainID: string,
  typeMethod: smartContractMethod,
  forceUsingEther: boolean
) => {
  if (forceUsingEther) {
      return appHttpProvider.getProvider(ETH_CHAIN_ID, NETWORK_URL);
  }

  if (appChainID && typeMethod === SmartContractMethod.Read) {
      switch (appChainID) {
        case BSC_CHAIN_ID: 
          return appHttpProvider.getProvider(BSC_CHAIN_ID, BSC_NETWORK_URL);
        case POLYGON_CHAIN_ID:
          return appHttpProvider.getProvider(POLYGON_CHAIN_ID, POLYGON_NETWORK_URL);
        case ETH_CHAIN_ID:
        default:
          return appHttpProvider.getProvider(ETH_CHAIN_ID, NETWORK_URL);
      }
  }

  const provider = (connectorsByName[networkName as connectorNames] as any);
  return provider;
}

export const getContractInstance =
  (ABIContract: any,
   contractAddress: string,
   networkName: connectorNames = ConnectorNames.MetaMask,
   appChainID: string = ChainDefault.id as string,
   typeMethod: smartContractMethod = SmartContractMethod.Read,
   forceUsingEther: boolean = false
  ) => {
  const provider = getProviderByNetwork(networkName as connectorNames, appChainID, typeMethod, forceUsingEther);

  if (provider) {
    const web3Instance = new Web3(provider);

    return new web3Instance.eth.Contract(
      ABIContract,
      contractAddress,
    );
  }

  return;
};

export const getContractInstanceWeb3 = (networkAvailable : string ) => {
  let provider;
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      provider = appHttpProvider.getProvider(BSC_CHAIN_ID, BSC_NETWORK_URL);
      return new Web3(provider);
    
    case NETWORK_AVAILABLE.POLYGON:
      provider = appHttpProvider.getProvider(POLYGON_CHAIN_ID, POLYGON_NETWORK_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.ETH:
      provider = appHttpProvider.getProvider(ETH_CHAIN_ID, NETWORK_URL);
      return new Web3(provider);

    default:
      return null;
  }
};

export const getPoolContract = ({ networkAvailable, poolHash }: any) => {
  const web3Instance = getContractInstanceWeb3(networkAvailable);
  if (!web3Instance) {
    return null;
  }

  return new web3Instance.eth.Contract(POOL_ABI, poolHash);
};

export const getContractInstanceWithEthereum = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    const web3Instance = new Web3(ethereum);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else if (windowObj.web3) {
    const web3Instance = new Web3(windowObj.web3.currentProvider);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else {
    return null;
  }
};

export const getContractInstanceWithBSC = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  const web3Instance = new Web3(ethereum);
  return new web3Instance.eth.Contract(ABIContract, contractAddress);
};

export const convertFromWei = (value: any, unit = 'ether') => {
  return Web3.utils.fromWei(value);
};

export const convertToWei = (value: any, unit = 'ether') => {
  // const webInstance = getWeb3Instance();
  // // @ts-ignore
  // return webInstance.utils.toWei(value, unit);
  return Web3.utils.toWei(value);
};

export const isValidAddress = (address: string) => {
  return Web3.utils.isAddress(address);
}

export const getETHBalance = async (loginUser: string) => {
  const web3 = getWeb3Instance() as any;
  if (web3) {
    const balance = await web3.eth.getBalance(loginUser);

    return web3.utils.fromWei(balance);
  };

  return 0;
}

export const convertToBN = (number: string) => {
  return Web3.utils.toBN(number)
}
