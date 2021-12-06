import { useWeb3, setWeb3LibraryCallback, UnsupportedChainIdError } from '@/utils/vue-web3'
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { WalletConnectConnector, UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { Web3Provider } from '@ethersproject/providers'
import { computed, watch } from 'vue'
import { providers } from 'ethers'

setWeb3LibraryCallback((provider) => {
  const library = new Web3Provider(provider)
  return library
})

const CHAIN_ID_GOERLI = 5
const CHAIN_ID_BSC_MAINNET = 56
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID)
const RPC_URL = import.meta.env.VITE_RPC_URL
const injected = new InjectedConnector({
  supportedChainIds: [CHAIN_ID]
})
const walletconnect = new WalletConnectConnector({
  rpc: { [CHAIN_ID]: RPC_URL },
  qrcode: true
})
const bsc = new BscConnector({ supportedChainIds: [CHAIN_ID] })
const connectors = {
  injected,
  walletconnect,
  bsc
}
const CONNECTOR_KEY = 'WEB3_CONNECTOR'
const CHAINS = {
  [CHAIN_ID_GOERLI]: {
    chainId: `0x${CHAIN_ID_GOERLI.toString(16)}`,
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'gorETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.goerli.mudit.blog/'],
    blockExplorerUrls: ['https://goerli.etherscan.io/']
  },
  [CHAIN_ID_BSC_MAINNET]: {
    chainId: `0x${CHAIN_ID_BSC_MAINNET.toString(16)}`,
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org', 'https://bsc-dataseed.binance.org/', 'https://bsc-dataseed1.defibit.io/', 'https://bsc-dataseed1.ninicoin.io/'],
    blockExplorerUrls: ['https://bscscan.com']
  }
}
export const setupNetwork = async (provider) => {
  if (!provider) {
    return
  }
  const chainId = parseInt(CHAIN_ID, 10)
  const chain = CHAINS[chainId]
  if (!chain) {
    return false
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.chainId }]
    })

    return true
  } catch (error) {
    if (error.code !== 4902) {
      return false
    }

    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [chain]
      })
      return true
    } catch (error) {
      return false
    }
  }
}
export const tokenAddress = import.meta.env.VITE_TOKEN_CONTRACT
export const zeroAddress = '0x0000000000000000000000000000000000000000'
export const defaultLibrary = new providers.JsonRpcProvider(RPC_URL)

export default function () {
  const { activate, deactivate, active, account, chainId, error, library } = useWeb3()

  const errInvalidChain = computed(() => error.value instanceof UnsupportedChainIdError)
  const err = computed(() => {
    if (!error.value) {
      return null
    }

    if (errInvalidChain.value) {
      return 'Unsupported Network'
    }

    if (error.value instanceof NoEthereumProviderError) {
      return 'No Ethereum Extension Detected'
    }

    if (error.value instanceof UserRejectedRequestErrorInjected || error.value instanceof UserRejectedRequestErrorWalletConnect) {
      return 'Request Rejected'
    }

    return 'Error Occurred'
  })

  const login = computed(() => {
    return async (name) => {
      const connector = connectors[name]
      if (!connector) {
        return
      }

      await setupNetwork(connector instanceof InjectedConnector ? window.ethereum || window.BinanceChain : null)

      watch(error, () => {
        if (!error.value) {
          return
        }

        if (connector instanceof WalletConnectConnector) {
          connector.walletConnectProvider = null
        }

        console.debug(error)
      })

      activate(connector)

      window.localStorage.setItem(CONNECTOR_KEY, name)
    }
  })

  const logout = computed(() => {
    return () => {
      window.localStorage.removeItem(CONNECTOR_KEY)
      deactivate()

      if (window.localStorage.getItem('walletconnect')) {
        walletconnect.close()
        walletconnect.walletConnectProvider = null
        localStorage.removeItem('walletconnect')
      }
    }
  })

  const eager = () => {
    const connectorName = window.localStorage.getItem(CONNECTOR_KEY)
    if (!connectorName) {
      return
    }

    const connector = connectors[connectorName]
    if (!connector) {
      return
    }

    if (!connector.isAuthorized) {
      return
    }

    connector.isAuthorized()
      .then(ok => {
        if (!ok) {
          return
        }

        login.value(connectorName)
      })
  }

  return {
    login,
    logout,
    eager,
    active,
    account: computed(() => account.value),
    chainId,
    error: err,
    errInvalidChain,
    library
  }
}
