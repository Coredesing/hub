import NotFound from '@/components/Pages/Notfound'
import Head from 'next/head'

export default function Custom404 () {
  return <div className="w-full flex items-center justify-center bg-gamefiDark-900 text-white" style={{ height: '100vh' }}>
    <Head>
      <title>GameFi.org - Not Found</title>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={'GameFi.org'} key="title" />
      <meta property="og:description" content={'GameFi.org is an all-in-one discovery gaming hub for games, guilds, and metaverses.'} key="description" />
    </Head>
    <NotFound />
  </div>
}
