import {ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID} from '../constants/network';
import {NETWORK_AVAILABLE} from "../constants";

const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";
const BSCSCAN_URL = process.env.REACT_APP_BSCSCAN_BASE_URL || "";
const POLSCAN_URL = process.env.REACT_APP_POLSCAN_BASE_URL || "";

export const getEtherscanName = ({networkAvailable}: any) => {
  // console.log('etherscanName', networkAvailable);
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      return 'Bscscan';
    
      case NETWORK_AVAILABLE.POLYGON:
      return 'Polygonscan';
    
      case NETWORK_AVAILABLE.ETH:
    default:
      return 'Etherscan';
  }
};

export const getEtherscanTransactionLink = ({ appChainID, transactionHash }: any) => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return `${BSCSCAN_URL}/tx/${transactionHash}`;
    
    case POLYGON_CHAIN_ID:
      return `${POLSCAN_URL}/tx/${transactionHash}`;
    
    case ETH_CHAIN_ID:
    default:
      return `${ETHERSCAN_URL}/tx/${transactionHash}`;
  }
};

export const getEtherscanTransactionAddress = ({ appChainID, address }: any) => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return `${BSCSCAN_URL}/address/${address}`;
    
    case POLYGON_CHAIN_ID:
      return `${POLSCAN_URL}/address/${address}`;
    
    case ETH_CHAIN_ID:
    default:
      return `${ETHERSCAN_URL}/address/${address}`;
  }
};


