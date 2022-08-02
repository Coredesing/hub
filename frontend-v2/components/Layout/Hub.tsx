import { ReactNode } from 'react'
import Head from 'next/head'
import Sidebar from '@/components/Base/Sidebar'
import Topbar from '@/components/Base/Topbar/Hub'
import Toolbox from '@/components/Base/Toolbox'
import Footer from '@/components/Base/Footer'
import { defaultDescription, defaultTitle } from '@/utils/constants'

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  disableFooter?: boolean;
  disableSearchBar?: boolean;
}

const LayoutHub = ({ children, title, description, image, disableFooter, disableSearchBar = false }: Props) => {
  const theme = 'dark'

  return (<div className={`flex w-full h-screen ${theme}`}>
    <div className="dark:bg-gamefiDark-900 dark:text-white w-full h-full flex flex-col md:flex-row">
      <Head>
        <title>{title || defaultTitle}</title>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={title || defaultTitle} key="title" />
        <meta property="og:description" content={description || defaultDescription} key="description" />
        <meta name="description" content={description || defaultDescription} />
        <meta property="og:image" content={image || 'https://gamefi.org/gamefi.jpg'} key="image" />
        <meta name="keywords" content="launchpad, game hub, nft marketplace, game portal, game pass, game guild, tournament, metaverse, ido"></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || defaultTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
        <meta name="twitter:image" content={image || 'https://gamefi.org/gamefi.jpg'} />
      </Head>
      <div>
        <Sidebar></Sidebar>
      </div>
      <div id='layoutBodyHub' className="w-full h-full overflow-auto relative">
        <div className='absolute w-full h-full bg-no-repeat bg-cover grayscale opacity-20' style={{ backgroundImage: `url(${image})` }} />
        <div className='absolute w-full h-full bg-gradient-to-t from-gamefiDark-900 via-gamefiDark-900/80 to-transparent' />
        <div className='relative'>
          <Topbar disableSearchBar={disableSearchBar}></Topbar>
          {children}
          {!disableFooter && <Footer></Footer>}
        </div>
      </div>
      <Toolbox></Toolbox>
    </div>
  </div>
  )
}

export default LayoutHub
