import { ReactNode, useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '@/components/Base/Sidebar'
import Topbar from '@/components/Base/Topbar'
import Toolbox from '@/components/Base/Toolbox'
import Footer from '@/components/Base/Footer'
import imageSocial from '@/assets/images/gamefi.jpg'

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

const BETA_SUPPRESSION = 'BETA_SUPPRESSION'

const Layout = ({ children, title, description, image }: Props) => {
  const [suppressed, setSuppressed] = useState<boolean>(true)

  useEffect(function () {
    if (!window.localStorage) {
      return
    }

    const suppressed = window.localStorage.getItem(BETA_SUPPRESSION)
    if (!suppressed) {
      setSuppressed(false)
    }
  }, [])

  const suppress = () => {
    setSuppressed(true)
    if (window.localStorage) {
      window.localStorage.setItem(BETA_SUPPRESSION, '1')
    }
  }

  const theme = 'dark'
  return (<div className={`flex w-full h-screen ${theme}`}>
    <div className="dark:bg-gamefiDark-900 dark:text-white w-full h-full flex flex-col md:flex-row">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={title || 'GameFi.org'} key="title" />
        <meta property="og:description" content={description || 'GameFi.org is an all-in-one discovery gaming hub for games, guilds, and metaverses.'} key="description" />
        <meta property="og:image" content={image || imageSocial.src} key="title" />
      </Head>
      <div>
        <Sidebar></Sidebar>
      </div>
      <div className="w-full h-full overflow-auto relative">
        { !suppressed && <div className="text-[11px] font-casual flex py-1 px-4 bg-gamefiGreen-700 text-gamefiDark-900 items-center justify-center">
          <span className="hidden sm:inline">This is the beta version of GameFi.org!</span>
          <a href="https://hub.gamefi.org" target="_blank" className="sm:ml-1 uppercase sm:normal-case font-semibold hover:underline" rel="noreferrer">Go back to the old version</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-2 h-4 w-4 inline flex-none cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={suppress}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div> }
        <Topbar></Topbar>
        {children}
        <Footer></Footer>
      </div>
      <Toolbox></Toolbox>
    </div>
  </div>
  )
}

export default Layout
