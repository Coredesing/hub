import { useWeb3React, createWeb3ReactRoot } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3Provider } from '@ethersproject/providers'
import React, { ReactNode, useEffect, useState } from 'react'
import { network, injected, walletconnect, POLLING_INTERVAL, RPC_URLS, IS_TESTNET } from './connectors'
import type { AddEthereumChainParameter } from '@web3-react/metamask'
import { BigNumber, ethers } from 'ethers'

export { NoEthereumProviderError } from '@web3-react/injected-connector'
export function getLibrary (provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}
export const DEFAULT_WEB3 = 'NETWORK'
export const DEFAULT_CONNECTOR = network
export const TOKEN_CONTRACT = IS_TESTNET ? process.env.NEXT_PUBLIC_TOKEN_CONTRACT_97 : process.env.NEXT_PUBLIC_TOKEN_CONTRACT_56
export const STAKING_CONTRACT = IS_TESTNET ? process.env.NEXT_PUBLIC_STAKING_CONTRACT_97 : process.env.NEXT_PUBLIC_STAKING_CONTRACT_56

export function useWeb3Default () {
  return useWeb3React<Web3Provider>(DEFAULT_WEB3)
}
export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

const DEACTIVATION_PERSISTENCE_KEY = 'WEB3_DEACTIVATION'

function parseChainId (chainId: string) {
  return Number.parseInt(chainId, 16)
}
export function switchNetwork (provider: any, chainId: number) {
  if (!chainId) {
    return
  }

  return provider.request({ method: 'eth_chainId' })
    .then((_chainId) => {
      const receivedChainId = parseChainId(_chainId)
      if (receivedChainId === chainId) {
        return
      }

      const desiredChainIdHex = `0x${chainId.toString(16)}`

      return provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: desiredChainIdHex }]
      }).catch((error: ProviderRpcError) => {
        if (error.code !== 4902 && error.code !== -32603) {
          return
        }

        const chain = getAddChainParameters(chainId)
        if (!chain) {
          return
        }

        return provider.request({
          method: 'wallet_addEthereumChain',
          params: [{ ...chain, chainId: desiredChainIdHex }]
        })
      })
    })
}

export function useEagerConnect () {
  const { activate, active } = useWeb3React<Web3Provider>()
  const [tried, setTried] = useState<boolean>(false)

  useEffect(() => {
    if (tried) {
      return
    }

    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        injected.getAccount()
          .then(acc => {
            if (isSignedOut(acc)) {
              return
            }

            activate(injected, undefined, true).catch(() => {
              setTried(true)
            })
          })
          .catch(() => {
            setTried(true)
          })
        return
      }

      setTried(true)
    }).catch(err => {
      console.debug(err)
      setTried(true)
    })
  }, [activate, tried])

  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function activated (account) {
  account = account.toLowerCase()
  console.debug('activated', account)

  if (typeof window === 'undefined') {
    return
  }

  const deactivationRaw = localStorage.getItem(DEACTIVATION_PERSISTENCE_KEY)
  if (!deactivationRaw) {
    return
  }

  const deactivation = JSON.parse(deactivationRaw)
  if (deactivation?.[account]) {
    delete deactivation[account]
    localStorage.setItem(DEACTIVATION_PERSISTENCE_KEY, JSON.stringify(deactivation))
  }
}
export function deactivated (account) {
  account = account.toLowerCase()
  console.debug('deactivated', account)
  if (typeof window === 'undefined') {
    return
  }

  const deactivationRaw = localStorage.getItem(DEACTIVATION_PERSISTENCE_KEY)
  if (!deactivationRaw) {
    localStorage.setItem(DEACTIVATION_PERSISTENCE_KEY, JSON.stringify({ [account]: true }))
  }

  let deactivation = JSON.parse(deactivationRaw)
  if (!deactivation) {
    deactivation = {}
  }

  deactivation[account] = true
  localStorage.setItem(DEACTIVATION_PERSISTENCE_KEY, JSON.stringify(deactivation))
}

function isSignedOut (account) {
  account = account.toLowerCase()
  if (typeof window === 'undefined') {
    return true
  }

  const deactivationRaw = localStorage.getItem(DEACTIVATION_PERSISTENCE_KEY)
  if (!deactivationRaw) {
    return false
  }

  const deactivation = JSON.parse(deactivationRaw)
  if (deactivation?.[account]) {
    return true
  }

  return false
}

export const DefaultConnector = ({ children }) => {
  const contextDefault = useWeb3Default()
  const { active: activeDefault, activate: activateDefault } = contextDefault
  useEffect(() => {
    if (activeDefault) {
      return
    }

    activateDefault(DEFAULT_CONNECTOR).finally(() => {})
    console.debug('activate default connector')
  }, [activeDefault, activateDefault])
  return <>{children}</>
}

interface PropsType {
  children?: ReactNode;
  getLibrary (provider: any): Web3Provider;
}

let Web3ReactProviderDefault

export class Web3ProviderNetwork extends React.Component<PropsType> {
  render () {
    try {
      if (!Web3ReactProviderDefault) {
        Web3ReactProviderDefault = createWeb3ReactRoot(DEFAULT_WEB3)
      }

      return <Web3ReactProviderDefault getLibrary={this.props.getLibrary}>
        <DefaultConnector>
          {this.props.children}
        </DefaultConnector>
      </Web3ReactProviderDefault>
    } catch (e) {
      return this.props.children
    }
  }
}

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address?: string;
}

export const ETH: Token = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18
}

export const MATIC: Token = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18
}

export const BNB: Token = {
  name: 'Binance Coin',
  symbol: 'BNB',
  decimals: 18
}

export const GAFI: Token = {
  name: 'GameFi',
  symbol: 'GAFI',
  decimals: 18,
  address: TOKEN_CONTRACT
}

export const BUSD_BSC: Token = {
  name: 'BUSD',
  symbol: 'BUSD',
  decimals: 18,
  address: IS_TESTNET ? process.env.NEXT_PUBLIC_BUSD_56 : process.env.NEXT_PUBLIC_BUSD_97
}

export const USDT_ERC: Token = {
  name: 'USDT',
  symbol: 'USDT',
  decimals: 6,
  address: IS_TESTNET ? process.env.NEXT_PUBLIC_USDT_5 : process.env.NEXT_PUBLIC_USDT_1
}

export const USDT_POLYGON: Token = {
  name: 'USDT',
  symbol: 'USDT',
  decimals: 6,
  address: IS_TESTNET ? process.env.NEXT_PUBLIC_USDT_80001 : process.env.NEXT_PUBLIC_USDT_137
}

export const MARKETPLACE_CONTRACT = IS_TESTNET ? process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_97 : process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_56

const currencies = [ETH, MATIC, BNB, USDT_ERC, USDT_POLYGON, BUSD_BSC, GAFI]

export type Network = {
  id: number;
  name: string;
  alias: string;
  currency: string;
  blockExplorerUrls: string[];
  image: any;
  image2: any;
  color: string;
  colorAlt?: string;
  colorText: string;
}

export const networks = [{
  id: 1,
  name: 'Ethereum',
  alias: 'eth',
  currency: ETH.symbol,
  blockExplorerUrls: ['https://etherscan.io'],
  image: require('@/assets/images/networks/eth.svg'),
  image2: require('@/assets/images/icons/ethereum.svg'),
  color: '#546BC7',
  colorText: '#fff'
}, {
  id: 5,
  name: 'Goerli',
  alias: 'eth',
  currency: ETH.symbol,
  blockExplorerUrls: ['https://goerli.etherscan.io'],
  image: require('@/assets/images/networks/eth.svg'),
  image2: require('@/assets/images/icons/ethereum.svg'),
  color: '#546BC7',
  colorText: '#fff',
  testnet: true
}, {
  id: 56,
  name: 'BSC',
  alias: 'bsc',
  currency: BNB.symbol,
  blockExplorerUrls: ['https://bscscan.com'],
  image: require('@/assets/images/networks/bsc.svg'),
  image2: require('@/assets/images/icons/bsc.svg'),
  color: '#FFC700',
  colorAlt: '#e6b300',
  colorText: '#28282E'
}, {
  id: 97,
  name: 'BSC Testnet',
  alias: 'bsc',
  currency: BNB.symbol,
  blockExplorerUrls: ['https://testnet.bscscan.com'],
  image: require('@/assets/images/networks/bsc.svg'),
  image2: require('@/assets/images/icons/bsc.svg'),
  color: '#FFC700',
  colorAlt: '#e6b300',
  colorText: '#28282E',
  testnet: true
}, {
  id: 137,
  name: 'Polygon',
  alias: 'polygon',
  currency: MATIC.symbol,
  blockExplorerUrls: ['https://polygonscan.com'],
  image: require('@/assets/images/networks/polygon.svg'),
  image2: require('@/assets/images/icons/polygon.svg'),
  color: '#A06EF4',
  colorText: '#fff'
}, {
  id: 80001,
  name: 'Polygon Testnet',
  alias: 'polygon',
  currency: MATIC.symbol,
  blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  image: require('@/assets/images/networks/polygon.svg'),
  image2: require('@/assets/images/icons/polygon.svg'),
  color: '#A06EF4',
  colorText: '#fff',
  testnet: true
}]

interface Wallet {
  id: string;
  name: string;
  networks: number[];
  image: any;
}

export const wallets: Wallet[] = [{
  id: 'metamask',
  name: 'MetaMask',
  networks: [1, 56, 137, 5, 97, 80001],
  image: require('@/assets/images/icons/metamask.svg')
}, {
  id: 'bsc-wallet',
  name: 'BSC Wallet',
  networks: [1, 56, 5, 97],
  image: require('@/assets/images/icons/bsc.svg')
}, {
  id: 'walletconnect',
  name: 'WalletConnect',
  networks: [1, 56, 137, 5, 97, 80001],
  image: require('@/assets/images/icons/walletconnect.svg')
}]

export function connectorFromWallet (wallet: Wallet): AbstractConnector {
  if (!wallet) {
    return
  }

  if (wallet.id === 'metamask' || wallet.id === 'bsc-wallet') {
    return injected
  }

  if (wallet.id === 'walletconnect') {
    return walletconnect
  }

  return network
}

export function getAddChainParameters (chainId: number): AddEthereumChainParameter | null {
  const chain = networks.find(x => x.id === chainId)
  if (!chain) {
    return null
  }

  const nativeCurrency = currencies.find(x => x.symbol === chain.currency)
  if (!nativeCurrency) {
    return null
  }

  return {
    chainId,
    chainName: chain.name,
    nativeCurrency: (nativeCurrency as AddEthereumChainParameter['nativeCurrency']),
    rpcUrls: [RPC_URLS[chainId]],
    blockExplorerUrls: chain.blockExplorerUrls
  }
}

export function getNetworkAvailable (mainnet?: boolean): Network[] {
  return networks.filter(x => (IS_TESTNET && !mainnet) ? x.testnet : !x.testnet)
}

export function getNetworkByAlias (alias: string, mainnet?: boolean): Network | null {
  if (!alias) {
    return null
  }

  return getNetworkAvailable(mainnet).find(x => {
    return x.alias.toLowerCase() === alias.toLowerCase()
  })
}

export const getTXLink = (networkName: string, txHash: string) => {
  const info = getNetworkByAlias(networkName)
  if (!info) return ''
  const explorerUrl = info.blockExplorerUrls[0]
  return `${explorerUrl}/tx/${txHash}`
}

export function getCurrencyByTokenAddress (tokenAddress: string, networkAlias: string): Token | null {
  if (tokenAddress === ethers.constants.AddressZero) {
    const chain = getNetworkByAlias(networkAlias)
    if (!chain) {
      return null
    }

    const nativeCurrency = currencies.find(x => x.symbol === chain.currency)
    if (!nativeCurrency) {
      return null
    }
    return nativeCurrency
  }
  return currencies.find(x => BigNumber.from(x.address || 0).eq(tokenAddress))
}
