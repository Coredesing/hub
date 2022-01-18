import { WALLET_CONNECT_EXTENSIONS } from "constants/network"

export const getWalletExtension = () => {
    return window.localStorage.getItem('WALLET-ACTIVE') || WALLET_CONNECT_EXTENSIONS.METAMASK
}

export const setWalletExtension = (wallet: WALLET_CONNECT_EXTENSIONS) => {
    window.localStorage.setItem('WALLET-ACTIVE', wallet);
}