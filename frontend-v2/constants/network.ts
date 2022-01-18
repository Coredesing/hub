export const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID as string;
export const BSC_CHAIN_ID = process.env.NEXT_PUBLIC_BSC_CHAIN_ID as string;
export const POLYGON_CHAIN_ID = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID as string;

export const ETH_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC_URL || "";
export const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL || "";
export const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || ""

export const ETHERSCAN_URL = process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL || "";
export const BCSSCAN_URL = process.env.NEXT_PUBLIC_BSCSCAN_BASE_URL || "";
export const POLYGONSCAN_URL = process.env.NEXT_PUBLIC_POLSCAN_BASE_URL || "";
export const DEFAULT_CHAIN_ID =  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || BSC_CHAIN_ID;

export enum ConnectorNames {
  MetaMask = "MetaMask",
  BSC = "BSC Wallet",
  WalletConnect = "WalletConnect",
  WalletConnectBsc = "WalletConnect",
  WalletLinkConnect = "Coinbase Wallet",
}

export const NETWORK_NAME: any = {
  '1': 'Ethereum Mainnet',
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
  shortName?: string;
  id?: string | undefined;
  icon: string,
  disableIcon: string,
  currency?: string,
  [k: string]: any,
}

export const APP_NETWORKS_SUPPORT: {[key: number]: NetworkInfo } = {
  [ETH_CHAIN_ID]: {
    name: 'Ethereum',
    shortName: 'eth',
    id: ETH_CHAIN_ID,
    icon: "/images/ethereum.svg",
    disableIcon: "/images/ethereum-disabled.png",
    currency: 'ETH',
    networkName: NETWORK_NAME[ETH_CHAIN_ID],
    explorerName: 'Etherscan',
    details: {
      chainId: `0x${(+ETH_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME[ETH_CHAIN_ID],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [ETH_RPC_URL],
      blockExplorerUrls: [ETHERSCAN_URL],
    }
  },
  [BSC_CHAIN_ID]: {
    name: 'BSC',
    shortName: 'bsc',
    id: BSC_CHAIN_ID ,
    icon: "/images/bsc.svg",
    disableIcon: "/images/binance-disabled.png",
    currency: 'BNB',
    networkName: NETWORK_NAME[BSC_CHAIN_ID],
    explorerName: 'Bscscan',
    details: {
      chainId: `0x${(+BSC_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME[BSC_CHAIN_ID],
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [BSC_RPC_URL],
      blockExplorerUrls: [BCSSCAN_URL],
    }
  },
  [POLYGON_CHAIN_ID]: {
    name: 'Polygon',
    shortName: 'polygon',
    id: POLYGON_CHAIN_ID ,
    icon: "/images/polygon-matic.svg",
    disableIcon: "/images/polygon-matic-disabled.svg",
    currency: 'MATIC',
    networkName: NETWORK_NAME[POLYGON_CHAIN_ID],
    explorerName: 'Polygonscan',
    details: {
      chainId: `0x${(+POLYGON_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME[POLYGON_CHAIN_ID],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: [POLYGON_RPC_URL],
      blockExplorerUrls: [POLYGONSCAN_URL],
    }
  },
}

export const ChainDefault = APP_NETWORKS_SUPPORT[+DEFAULT_CHAIN_ID] || APP_NETWORKS_SUPPORT[+ETH_CHAIN_ID];

export enum WALLET_CONNECT_EXTENSIONS {
  METAMASK = 'METAMASK WALLET',
  BSC = 'BSC WALLET',
  WALLET = 'WALLET CONNECT'
}
