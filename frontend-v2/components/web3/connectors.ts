import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const IS_TESTNET =  false ?? !!process.env.NEXT_PUBLIC_TESTNET
export const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_1,
  5: process.env.NEXT_PUBLIC_RPC_URL_5,
  56: process.env.NEXT_PUBLIC_RPC_URL_56,
  97: process.env.NEXT_PUBLIC_RPC_URL_97,
  137: process.env.NEXT_PUBLIC_RPC_URL_137,
  80001: process.env.NEXT_PUBLIC_RPC_URL_80001,
  43114: process.env.NEXT_PUBLIC_RPC_URL_43114,
  43113: process.env.NEXT_PUBLIC_RPC_URL_43113,
  250: process.env.NEXT_PUBLIC_RPC_URL_250,
  4002: process.env.NEXT_PUBLIC_RPC_URL_4002,
  42161: process.env.NEXT_PUBLIC_RPC_URL_42161,
  421611: process.env.NEXT_PUBLIC_RPC_URL_421611
}

export const injected = new InjectedConnector({
  supportedChainIds: Object.keys(RPC_URLS).map(x => parseInt(x))
})

export const networkConnector = (chainId?: number) => {
  if (!RPC_URLS?.[chainId]) {
    return
  }

  return new NetworkConnector({
    urls: RPC_URLS,
    defaultChainId: chainId
  })
}

export const network = IS_TESTNET ? networkConnector(97) : networkConnector(56)

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  qrcode: true
})

export const POLLING_INTERVAL = 12000
