import NotFound from '@/components/Pages/Notfound'
import { defaultDescription, defaultTitle } from '@/utils/constants'
import Head from 'next/head'

export default function Custom404 () {
  return <div className="w-full flex items-center justify-center bg-gamefiDark-900 text-white" style={{ height: '100vh' }}>
    <Head>
      <title>GameFi.org - Not Found</title>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={defaultTitle} key="title" />
      <meta property="og:description" content={defaultDescription} key="description" />
    </Head>
    <NotFound />
  </div>
}
