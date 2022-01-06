import React, { ReactNode } from 'react'
import Head from 'next/head'
import Sidebar from 'components/Base/Sidebar'
import Topbar from 'components/Base/Topbar'
import Toolbox from 'components/Base/Toolbox'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title }: Props) => {
  const theme = 'dark'
  return (
    <div className={`flex w-full h-screen ${theme}`}>
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
        <div className="w-full overflow-hidden">
          <Topbar></Topbar>
          {children}
        </div>
        <Toolbox></Toolbox>
      </div>
    </div>
  )
}

export default Layout
