
import { NETWORK_AVAILABLE } from "constants/index";
import { BaseProvider, JsonRpcSigner, Network } from '@ethersproject/providers';
import { Contract, providers } from 'ethers';
import { WALLET_CONNECT_EXTENSIONS } from "constants/network";
import { getWalletExtension } from "./wallet-extension";
import { Address } from "common/types";

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL || "";
const BSC_NETWORK_URL = process.env.REACT_APP_BSC_RPC_URL || "";
const POLYGON_NETWORK_URL = process.env.REACT_APP_POLYGON_RPC_URL || "";

export enum SmartContractMethod {
    Write = "Write",
    Read = "Read"
}

type GetProviderType = {
    walletExtension?: WALLET_CONNECT_EXTENSIONS;
    network?: Network;
}
const getProvider = (options?: GetProviderType) => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;
    if(options?.network) {
        options.network.chainId = +options.network.chainId || options.network.chainId;
    }
    const _window = window as any;
    const currentWalletExtension = options?.walletExtension || getWalletExtension();
    if (WALLET_CONNECT_EXTENSIONS.BSC === currentWalletExtension) {
        if (!_window.BinanceChain) {
            throw new Error("Please Install Binance Wallet");
        }
        return new providers.Web3Provider((_window as any).BinanceChain as any, options?.network);
    }
    if (!_window.ethereum || !_window.ethereum.isMetaMask) {
        throw new Error("Please Enable Metamask Wallet");
    }
    return new providers.Web3Provider((_window as any).ethereum as any, options?.network);
}

type GetOptionsContractType = {
    accountSigner?: Address;
    network?: Network
}
export const getContract = (contractAddress: Address, ABI: any, options?: GetOptionsContractType) => {
    const provider = getProvider({network: options?.network});
    let contract = new Contract(contractAddress, ABI, provider);
    if (options?.accountSigner) {
        const signer = provider.getSigner(options.accountSigner).connectUnchecked();
        contract = contract.connect(signer);
    }
    return contract;
}