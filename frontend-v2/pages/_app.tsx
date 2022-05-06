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
      <div id="fb-root"></div>
      <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v13.0" nonce="FBK6mkSr" id="facebook-share"></Script>
      <Script id="twitter-share">
        {`
          window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
              t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
              t._e.push(f);
            };

            return t;
          }(document, "script", "twitter-wjs"));
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
