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
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { debounce } from '@/utils'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
const AW_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

const callbackVH = () => {
  window.requestAnimationFrame(() => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })
}

const debounced = debounce(callbackVH, 100)

function MyApp ({ Component, pageProps }: AppProps) {
  useEffect(() => {
    debounced()
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
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
            `}
      </Script>
      <noscript dangerouslySetInnerHTML={{
        __html: `<img alt="fb-pixel" height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1"
        />`
      }}></noscript>
      <Script id="gtag" strategy="afterInteractive">
        {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
            `}
      </Script>
      <noscript dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>"
        />`
      }}></noscript>

      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <MyWeb3Provider>
            <WalletProvider>
              <AppProvider>
                <Component {...pageProps} />
                <Toaster
                  position="top-right"
                />
                <LoadingOverlay loading={loading}></LoadingOverlay>
              </AppProvider>
            </WalletProvider>
          </MyWeb3Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </>
  )
}

export default MyApp
