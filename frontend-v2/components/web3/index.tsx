import { useWeb3React, createWeb3ReactRoot } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3Provider } from '@ethersproject/providers'
import React, { ReactNode, useEffect, useState } from 'react'
import { network, injected, walletconnect, POLLING_INTERVAL, RPC_URLS, IS_TESTNET } from './connectors'
import type { AddEthereumChainParameter } from '@web3-react/metamask'

export { NoEthereumProviderError } from '@web3-react/injected-connector'
export function getLibrary (provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}
export const DEFAULT_WEB3 = 'NETWORK'
export const DEFAULT_CONNECTOR = network

export function useWeb3Default () {
  return useWeb3React<Web3Provider>(DEFAULT_WEB3)
}
export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

const DEACTIVATION_PERSISTENCE_KEY = 'WEB3_DEACTIVATION'

export function switchNetwork (provider: any, chainId: number) {
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
        if (error.code !== 4902) {
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

const DefaultConnector = ({ children }) => {
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
  children?: ReactNode
  getLibrary (provider: any): Web3Provider
}

export class ErrorBoundaryWeb3ProviderNetwork extends React.Component<PropsType, { error: Error | undefined }> {
  constructor (props) {
    super(props)
    this.state = {
      error: null
    }
  }

  static getDerivedStateFromError (error) {
    return { error }
  }

  render () {
    if (this.state.error) {
      return <>{this.state.error.message}</>
    }

    let Web3ReactProviderDefault
    try {
      Web3ReactProviderDefault = createWeb3ReactRoot(DEFAULT_WEB3)
    } catch (e) {
      return <>{this.props.children}</>
    }

    return <Web3ReactProviderDefault getLibrary={this.props.getLibrary}>
      <DefaultConnector>
        {this.props.children}
      </DefaultConnector>
    </Web3ReactProviderDefault>
  }
}

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18
}

const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Binance Coin',
  symbol: 'BNB',
  decimals: 18
}

const currencies = [ETH, MATIC, BNB]

export type Network = {
  id: number
  name: string
  currency: string
  blockExplorerUrls: string[]
  image: any
  color: string
  colorText: string
}

export const networks = [{
  id: 1,
  name: 'Ethereum',
  currency: ETH.symbol,
  blockExplorerUrls: ['https://etherscan.io'],
  image: require('assets/images/icons/ethereum.svg'),
  color: '#546BC7',
  colorText: '#fff'
}, {
  id: 5,
  name: 'Goerli',
  currency: ETH.symbol,
  blockExplorerUrls: ['https://goerli.etherscan.io'],
  image: require('assets/images/icons/ethereum.svg'),
  color: '#546BC7',
  colorText: '#fff',
  testnet: true
}, {
  id: 56,
  name: 'BSC',
  currency: BNB.symbol,
  blockExplorerUrls: ['https://bscscan.com'],
  image: require('assets/images/icons/bsc.svg'),
  color: '#FFC700',
  colorText: '#28282E'
}, {
  id: 97,
  name: 'BSC Testnet',
  currency: BNB.symbol,
  blockExplorerUrls: ['https://testnet.bscscan.com'],
  image: require('assets/images/icons/bsc.svg'),
  color: '#FFC700',
  colorText: '#28282E',
  testnet: true
}, {
  id: 137,
  name: 'Polygon',
  currency: MATIC.symbol,
  blockExplorerUrls: ['https://polygonscan.com'],
  image: require('assets/images/icons/polygon.svg'),
  color: '#A06EF4',
  colorText: '#fff'
}, {
  id: 80001,
  name: 'Polygon Testnet',
  currency: MATIC.symbol,
  blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  image: require('assets/images/icons/polygon.svg'),
  color: '#A06EF4',
  colorText: '#fff',
  testnet: true
}]

interface Wallet {
  id: string
  name: string
  networks: number[]
  image: any
}

export const wallets: Wallet[] = [{
  id: 'metamask',
  name: 'MetaMask',
  networks: [1, 56, 137, 5, 97, 80001],
  image: require('assets/images/icons/metamask.svg')
}, {
  id: 'bsc-wallet',
  name: 'BSC Wallet',
  networks: [1, 56, 5, 97],
  image: require('assets/images/icons/bsc.svg')
}, {
  id: 'walletconnect',
  name: 'WalletConnect',
  networks: [1, 56, 137, 5, 97, 80001],
  image: require('assets/images/icons/walletconnect.svg')
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
    nativeCurrency,
    rpcUrls: [RPC_URLS[chainId]],
    blockExplorerUrls: chain.blockExplorerUrls
  }
}

function parseChainId (chainId: string) {
  return Number.parseInt(chainId, 16)
}
