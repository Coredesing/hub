import { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary, Web3ProviderNetwork } from '@/components/web3'
import { MyWeb3Provider } from '@/components/web3/context'
import WalletProvider from '@/components/Base/WalletConnector/provider'
import { Toaster } from 'react-hot-toast'
import AppProvider from '@/context/provider'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LoadingOverlay from '@/components/Base/LoadingOverlay'
import Script from 'next/script'

import 'tippy.js/dist/tippy.css'
import '@/assets/styles/index.scss'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
const AW_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

function MyApp ({ Component, pageProps }: AppProps) {
  // migration signature from localStorage to sessionStorage
  // this is temporary

  useEffect(() => {
    if (window?.localStorage) {
      const keys = Object.keys(window.localStorage)
      keys.forEach(key => {
        if (key.match(/SIGNATURE_0x(\w+)/)) {
          window.localStorage.removeItem(key)
        }
      })
    }
  }, [])

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = (url) => (url !== router.asPath) && setLoading(true)
    const handleComplete = () => setLoading(false)

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
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${AW_MEASUREMENT_ID}');
        `}
      </Script>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <MyWeb3Provider>
            <AppProvider>
              <WalletProvider>
                <Component {...pageProps} />
              </WalletProvider>
              <Toaster
                position="top-right"
              />
              <LoadingOverlay loading={loading}></LoadingOverlay>
            </AppProvider>

          </MyWeb3Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </>
  )
}

export default MyApp
