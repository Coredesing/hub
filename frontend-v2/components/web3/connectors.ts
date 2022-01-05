import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_1,
  5: process.env.NEXT_PUBLIC_RPC_URL_5,
  56: process.env.NEXT_PUBLIC_RPC_URL_56,
  97: process.env.NEXT_PUBLIC_RPC_URL_97,
  137: process.env.NEXT_PUBLIC_RPC_URL_137,
  80001: process.env.NEXT_PUBLIC_RPC_URL_80001,
}
// ETH Mainnet, ETH Goerli, BSC Mainnet, BSC Testnet, Polygon Mainnet, Polygon Mumbai
export const injected = new InjectedConnector({ supportedChainIds: [1, 5, 56, 97, 137, 80001] })

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: 56
})

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  qrcode: true
})

enum ConnectorNames {
  Injected = 'Injected',
  Network = 'Network',
  WalletConnect = 'WalletConnect',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletconnect,
}

export const POLLING_INTERVAL = 12000
export default connectorsByName
