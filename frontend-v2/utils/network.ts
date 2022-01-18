import { APP_NETWORKS_SUPPORT, BSC_CHAIN_ID, ETH_CHAIN_ID, NetworkInfo, POLYGON_CHAIN_ID, } from "@/constants/network";
import { NETWORK_AVAILABLE } from "@/constants";

export const getNetworkInfo = (network: string | number): NetworkInfo => {
    let appChainID = ETH_CHAIN_ID;
    network = typeof network === 'string' ? String(network).toLowerCase() : network;
    if (network === NETWORK_AVAILABLE.BSC || network === BSC_CHAIN_ID) {
        appChainID = BSC_CHAIN_ID;
    } else if (network === NETWORK_AVAILABLE.POLYGON || network === POLYGON_CHAIN_ID) {
        appChainID = POLYGON_CHAIN_ID;
    }
    return APP_NETWORKS_SUPPORT[appChainID];
}

export const getTXLink = ({ appChainID, transactionHash }: any) => {
    const info = getNetworkInfo(appChainID);
    const explorerUrl = info.details.blockExplorerUrls[0];
    return `${explorerUrl}/tx/${transactionHash}`;
};