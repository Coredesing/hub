import { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary, Web3ProviderNetwork } from 'components/web3'
import { MyWeb3Provider } from 'components/web3/context'
import WalletProvider from 'components/Base/WalletConnector/provider'
import 'assets/styles/index.scss'
import { Toaster } from 'react-hot-toast'
import AppProvider from '@/context/provider'
import Router, { useRouter } from 'next/router'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { useEffect, useState } from 'react'
import LoadingOverlay from 'components/Base/LoadingOverlay'

function MyApp ({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = (url) => (url !== router.asPath) && setLoading(true)
    const handleComplete = (url) => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <MyWeb3Provider>
          <AppProvider>
            <WalletProvider>
              <Component {...pageProps} />
            </WalletProvider>
            <Toaster />
            <LoadingOverlay loading={loading}></LoadingOverlay>
          </AppProvider>

        </MyWeb3Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default MyApp
