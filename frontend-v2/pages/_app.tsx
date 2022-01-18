import { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary, ErrorBoundaryWeb3ProviderNetwork } from 'components/web3'
import { MyWeb3Provider } from 'components/web3/context'
import WalletProvider from 'components/Base/WalletConnector/provider'
import '../assets/styles/index.scss'
import { Toaster } from 'react-hot-toast'
import AppProvider from '@/context/provider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ErrorBoundaryWeb3ProviderNetwork getLibrary={getLibrary}>
        <MyWeb3Provider>
          <AppProvider>
            <WalletProvider>
              <Component {...pageProps} />
            </WalletProvider>
            <Toaster />
          </AppProvider>
        </MyWeb3Provider>
      </ErrorBoundaryWeb3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default MyApp
