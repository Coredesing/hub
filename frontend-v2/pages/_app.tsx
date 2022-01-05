import { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary, ErrorBoundaryWeb3ProviderNetwork } from 'components/web3'
import '../assets/styles/index.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ErrorBoundaryWeb3ProviderNetwork getLibrary={getLibrary}>
        <Component {...pageProps} />
      </ErrorBoundaryWeb3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default MyApp
