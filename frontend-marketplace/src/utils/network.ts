import {ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, APP_NETWORKS_SUPPORT, NetworkInfo} from '../constants/network';
import {NETWORK_AVAILABLE} from "../constants";

// const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";
// const BSCSCAN_URL = process.env.REACT_APP_BSCSCAN_BASE_URL || "";
// const POLSCAN_URL = process.env.REACT_APP_POLSCAN_BASE_URL || "";

export const getEtherscanName = ({networkAvailable}: any) => {
  const info = getNetworkInfo(networkAvailable);
  return info.explorerName;
};

export const getEtherscanTransactionLink = ({ appChainID, transactionHash }: any) => {
  const info = getNetworkInfo(appChainID);
  const explorerUrl = info.details.blockExplorerUrls[0];
  return `${explorerUrl}/tx/${transactionHash}`;
  // switch (appChainID) {
  //   case BSC_CHAIN_ID:
  //     return `${BSCSCAN_URL}/tx/${transactionHash}`;
    
  //   case POLYGON_CHAIN_ID:
  //     return `${POLSCAN_URL}/tx/${transactionHash}`;
    
  //   case ETH_CHAIN_ID:
  //   default:
  //     return `${ETHERSCAN_URL}/tx/${transactionHash}`;
  // }
};

export const getExplorerTransactionAddress = ({ appChainID, address }: any) => {
  const info = getNetworkInfo(appChainID);
  const explorerUrl = info.details.blockExplorerUrls[0];
  return `${explorerUrl}/address/${address}`;
  // switch (appChainID) {
  //   case BSC_CHAIN_ID:
  //     return `${BSCSCAN_URL}/address/${address}`;
    
  //   case POLYGON_CHAIN_ID:
  //     return `${POLSCAN_URL}/address/${address}`;
    
  //   case ETH_CHAIN_ID:
  //   default:
  //     return `${ETHERSCAN_URL}/address/${address}`;
  // }
};

export const getAppNetWork = (appChainID: any) => {
  // With appChainID: Can use code belows:
  // const { appChainID } = useTypedSelector(state  => state.appNetwork).data;

  switch (appChainID) {
    case BSC_CHAIN_ID:
      return 'bsc';

    case POLYGON_CHAIN_ID:
      return 'polygon';

    case ETH_CHAIN_ID:
      return 'eth';
  }
};



export const getNetworkInfo = (network: string | number): NetworkInfo => {
  let appChainID = ETH_CHAIN_ID;
  network = typeof network === 'string' ? String(network).toLowerCase() : network;
  if(network === NETWORK_AVAILABLE.BSC || network === BSC_CHAIN_ID) {
    appChainID = BSC_CHAIN_ID;
  } else if(network === NETWORK_AVAILABLE.POLYGON || network === POLYGON_CHAIN_ID) {
    appChainID = POLYGON_CHAIN_ID;
  }
  return APP_NETWORKS_SUPPORT[+appChainID];
  // networkName = String(networkName).toUpperCase();
}
