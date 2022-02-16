import { ReactNode, useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '@/components/Base/Sidebar'
import Topbar from '@/components/Base/Topbar'
import Toolbox from '@/components/Base/Toolbox'
import Footer from '@/components/Base/Footer'

type Props = {
  children?: ReactNode;
  title?: string;
}

const BETA_SUPPRESSION = 'BETA_SUPPRESSION'

const Layout = ({ children, title }: Props) => {
  const [suppressed, setSuppressed] = useState<boolean>(false)

  useEffect(function () {
    if (!window.localStorage) {
      return
    }

    const suppressed = window.localStorage.getItem(BETA_SUPPRESSION)
    if (suppressed) {
      setSuppressed(true)
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
      </Head>
      <div>
        <Sidebar></Sidebar>
      </div>
      <div className="w-full h-full overflow-auto relative">
        { !suppressed && <div className="text-[11px] font-casual flex py-1 px-4 bg-gamefiYellow text-gamefiDark-900 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 hidden sm:inline mr-2 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="hidden sm:inline">This is the beta version of GameFi.org.</span>
          <span className="hidden md:inline ml-1">If you encounter any potential technical problem, you can</span>
          <a href="https://hub.gamefi.org" target="_blank" className="ml-auto sm:ml-1 uppercase md:normal-case font-semibold hover:underline" rel="noreferrer">go back to the former version</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4 inline flex-none cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={suppress}>
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
