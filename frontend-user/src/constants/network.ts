export const ETH_CHAIN_ID = process.env.REACT_APP_ETH_CHAIN_ID as string;
export const BSC_CHAIN_ID = process.env.REACT_APP_BSC_CHAIN_ID as string;
export const POLYGON_CHAIN_ID = process.env.REACT_APP_POLYGON_CHAIN_ID as string;

export const BSC_RPC_URL = process.env.REACT_APP_BSC_RPC_URL || "";
export const POLYGON_RPC_URL = process.env.REACT_APP_POLYGON_RPC_URL || "";

export const USDT_ADDRESS = process.env.REACT_APP_USDT_SMART_CONTRACT;
export const USDC_ADDRESS = process.env.REACT_APP_USDC_SMART_CONTRACT;

export const USDC_POLYGON_ADDRESS = process.env.REACT_APP_USDC_POLYGON_SMART_CONTRACT;
export const USDT_POLYGON_ADDRESS = process.env.REACT_APP_USDT_POLYGON_SMART_CONTRACT;

export const USDC_BSC_ADDRESS = process.env.REACT_APP_USDC_BSC_SMART_CONTRACT;
export const USDT_BSC_ADDRESS = process.env.REACT_APP_USDT_BSC_SMART_CONTRACT;
export const BUSD_BSC_ADDRESS = process.env.REACT_APP_BUSD_BSC_SMART_CONTRACT;

export const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";
export const BCSSCAN_URL = process.env.REACT_APP_BSCSCAN_BASE_URL || "";
export const POLYGONSCAN_URL = process.env.REACT_APP_POLSCAN_BASE_URL || "";

export enum ChainId  {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  BSC_TESTNET = 97,
  BSC_MAINNET = 56,
  POLYGON_MAINNET = 137,
  MUMBAI_POLYGON_TESTNET = 80001,
}

export type chainId =
  Extract< ChainId,
    ChainId.MAINNET |
    ChainId.ROPSTEN |
    ChainId.RINKEBY |
    ChainId.GOERLI |
    ChainId.KOVAN |
    ChainId.BSC_MAINNET |
    ChainId.BSC_TESTNET |
    ChainId.POLYGON_MAINNET |
    ChainId.MUMBAI_POLYGON_TESTNET
  >;

export const ChainIdNameMapping: { [key in ChainId]: string }  = {
  [ChainId.MAINNET]: 'Mainnet',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GOERLI]: 'Goerli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.BSC_MAINNET]: 'BSC Mainnet',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.POLYGON_MAINNET]: 'Polygon Mainnet',
  [ChainId.MUMBAI_POLYGON_TESTNET]: 'Mumbai Testnet',
}

export const NETWORK_NAME_MAPPINGS: any = {
  '1': 'Mainnet',
  '3': 'Ropsten',
  '5': 'Goerli',
  '42': 'Kovan',
  '4': 'Rinkeby',
  '56': 'BSC Mainnet',
  '97': 'BSC Testnet',
  '137': 'Polygon Mainnet',
  '80001': 'Mumbai Testnet',
};

export interface NetworkInfo {
  name: string;
  id?: string | undefined;
  icon: string,
  disableIcon: string,
  currency?: string,
  [k: string]: any,
}

export enum APP_NETWORKS_NAME {
  METAMASK = "METAMASK",
  BSC = "BSC",
  POLYGON = "POLYGON",
}

export type appNetworkType = Extract<APP_NETWORKS_NAME, APP_NETWORKS_NAME.METAMASK | APP_NETWORKS_NAME.BSC | APP_NETWORKS_NAME.POLYGON>

export const APP_NETWORKS: {[key in APP_NETWORKS_NAME]: NetworkInfo } = {
  [APP_NETWORKS_NAME.METAMASK]: {
    name: 'Ethereum',
    id: ETH_CHAIN_ID,
    icon: "/images/ethereum.svg",
    disableIcon: "/images/ethereum-disabled.png"
  },
  [APP_NETWORKS_NAME.BSC]: {
    name: 'BSC',
    id: BSC_CHAIN_ID ,
    icon: "/images/bsc.svg",
    disableIcon: "/images/binance-disabled.png"
  },
  [APP_NETWORKS_NAME.POLYGON]: {
    name: 'Polygon',
    id: POLYGON_CHAIN_ID ,
    icon: "/images/polygon-matic.svg",
    disableIcon: "/images/polygon-matic-disabled.svg"
  },
}

export const APP_NETWORKS_ID: (string | undefined)[] = [ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID];
export const NETWORK_URL = process.env.REACT_APP_NETWORK_URL;
export const NETWORK_BSC_URL = process.env.REACT_APP_BSC_RPC_URL;
export const NETWORK_POLYGON_URL = process.env.REACT_APP_POLYGON_RPC_URL;
export const FORMATIC_KEY = process.env.REACT_APP_FORMATIC_KEY;
export const FORMATIC_KEY_TEST = process.env.REACT_APP_FORMATIC_KEY_TEST;

export const NETWORK_ETH_NAME = process.env.REACT_APP_NETWORK_ETH_NAME;
export const NETWORK_BSC_NAME = process.env.REACT_APP_NETWORK_BSC_NAME;
export const NETWORK_POLYGON_NAME = process.env.REACT_APP_NETWORK_POLYGON_NAME;

export const appNetwork: { [key: string]: string } = {
  [ETH_CHAIN_ID]: NETWORK_ETH_NAME as string,
  [BSC_CHAIN_ID]: NETWORK_BSC_NAME as string,
  [POLYGON_CHAIN_ID]: NETWORK_POLYGON_NAME as string,
}

export const APP_NETWORKS_SUPPORT: {[key: number]: NetworkInfo } = {
  [ETH_CHAIN_ID]: {
    name: 'Ethereum',
    id: ETH_CHAIN_ID,
    icon: "/images/ethereum.svg",
    disableIcon: "/images/ethereum-disabled.png",
    currency: 'ETH',
    networkName: NETWORK_NAME_MAPPINGS[ETH_CHAIN_ID],
    details: {
      chainId: `0x${(+ETH_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[ETH_CHAIN_ID],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [NETWORK_URL],
      blockExplorerUrls: [ETHERSCAN_URL],
      explorerName: 'Etherscan'
    }
  },
  [BSC_CHAIN_ID]: {
    name: 'BSC Mainnet',
    id: BSC_CHAIN_ID ,
    icon: "/images/bsc.svg",
    disableIcon: "/images/binance-disabled.png",
    currency: 'BNB',
    networkName: NETWORK_NAME_MAPPINGS[BSC_CHAIN_ID],
    details: {
      chainId: `0x${(+BSC_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[BSC_CHAIN_ID],
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [BSC_RPC_URL],
      blockExplorerUrls: [BCSSCAN_URL],
      explorerName: 'Bscscan'
    }
  },
  [POLYGON_CHAIN_ID]: {
    name: 'Polygon',
    id: POLYGON_CHAIN_ID ,
    icon: "/images/polygon-matic.svg",
    disableIcon: "/images/polygon-matic-disabled.svg",
    currency: 'MATIC',
    networkName: NETWORK_NAME_MAPPINGS[POLYGON_CHAIN_ID],
    details: {
      chainId: `0x${(+POLYGON_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[POLYGON_CHAIN_ID],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: [POLYGON_RPC_URL],
      blockExplorerUrls: [POLYGONSCAN_URL],
      explorerName: 'Polygonscan'
    }
  },
}