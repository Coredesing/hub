import { 
  USDT_ADDRESS, USDT_BSC_ADDRESS, USDT_POLYGON_ADDRESS,
  USDC_ADDRESS, USDC_BSC_ADDRESS, USDC_POLYGON_ADDRESS,
  BUSD_BSC_ADDRESS, 
  ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID 
} from '../../constants/network';

export const getUSDTAddress = (appChainID: string): string => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return USDT_BSC_ADDRESS as string;

    case POLYGON_CHAIN_ID:
      return USDT_POLYGON_ADDRESS as string;

    case ETH_CHAIN_ID:
    default:
      return USDT_ADDRESS as string;
  }
  // return (appChainID === ETH_CHAIN_ID ? USDT_ADDRESS: USDT_BSC_ADDRESS) as string;
}

export const getBUSDAddress = (appChainID: string): string => {
  return BUSD_BSC_ADDRESS as string;
}

export const getUSDCAddress = (appChainID: string) => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return USDC_BSC_ADDRESS as string;
      
    case POLYGON_CHAIN_ID:
      return USDC_POLYGON_ADDRESS as string;

    case ETH_CHAIN_ID:
    default:
      return USDC_ADDRESS as string;
  }
  // return (appChainID === ETH_CHAIN_ID ? USDC_ADDRESS: USDC_BSC_ADDRESS) as string;
}


