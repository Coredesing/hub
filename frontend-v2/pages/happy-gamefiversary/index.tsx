import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import fonts from '@/components/Pages/Adventure/index.module.scss'
import logo from '@/components/Pages/Adventure/images/logo.png'
import banner from '@/components/Pages/Adventure/images/banner.png'
import cat from '@/components/Pages/Adventure/images/cat.png'
import fish from '@/components/Pages/Adventure/images/fish.svg'
import satellite from '@/components/Pages/Adventure/images/satellite.svg'
import planet1 from '@/components/Pages/Adventure/images/planet-1.png'
import planet2 from '@/components/Pages/Adventure/images/planet-2.png'
import grid from '@/components/Pages/Adventure/images/grid.png'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Flicking, { ViewportSlot, Plugin } from '@egjs/react-flicking'
import { Sync } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/react-flicking/dist/flicking.css'
import World from '@/components/Pages/Adventure/World'
import Spin from '@/components/Pages/Adventure/Spin'
import { fetcher, gtagEvent } from '@/utils'
import Image from 'next/image'
import { format } from 'date-fns'
import Head from 'next/head'
import WalletConnector from '@/components/Base/WalletConnector'

// eslint-disable-next-line no-unused-expressions
fonts

const menu = [{
  id: 'about',
  text: 'About Event'
}, {
  id: 'leaderboard',
  text: 'Leaderboard',
  secondary: true
}, {
  id: 'history',
  text: 'Our History'
}, {
  id: 'adventure',
  text: 'Adventure'
}, {
  id: 'spin',
  text: 'Lucky Spin'
}, {
  id: 'press',
  text: 'Press'
}, {
  id: 'partners',
  text: 'Partners',
  secondary: true
}]

const history = [{
  time: 'August 2021',
  content () {
    return <div>GameFi.org hosted our first token offering on the platform - <span className="underline">KABY ARENA IGO</span>, marking significant results with all tokens sold out that are worth <span className="underline">$100,000</span>.</div>
  }
}, {
  time: 'September 2021',
  content () {
    return <div>GameFi.org officially launched the $GAFI token. We have been gaining milestones with the $GAFI staking mechanism for IGO campaigns of project partners. Over <span className="underline">60 IGOs</span> have been launched, recording an average <span className="underline">all-time-high ROI </span> of 6,100%. </div>
  }
}, {
  time: 'October 2021',
  content () {
    return <div>GameFi.org hosted our first NFT offering on the platform - Mech Master Mystery Box sale. All boxes were sold out, successfully raised <span className="underline">over $1,000,000</span> for the project.</div>
  }
}, {
  time: 'February 2022',
  content () {
    return <div>GameFi.org released a beta version of our official website. With major changes in UX/UI design, we offer friendly and accessible ways for users to explore the platform.</div>
  }
}, {
  time: 'April 2022',
  content () {
    return <div>GameFi.org’s official version was introduced. We define the platform as a one-stop destination for Web3 gaming with major features: GameFi Launchpad, GameFi Marketplace, GameFi Insight, GameFi Earn.  </div>
  }
}, {
  time: 'June 2022',
  content () {
    return <div>GameFi.org Game Hub officially debuted as an advanced version of our previous game aggregator mechanism. Game Hub immediately became a reliable <span className="underline">steam-like</span> platform for users to explore the world of game & metaverses.</div>
  }
}]

const Content = () => {
  const [menuMobile, setMenuMobile] = useState(false)
  const [historyActive, setHistoryActive] = useState(1)
  const [plugins, setPlugins] = useState<Plugin[]>([])

  const flickingHistory = useRef()
  const flickingTimeline = useRef()

  useEffect(() => {
    setPlugins([
      new Sync({
        type: 'index',
        synchronizedFlickingOptions: [{
          flicking: flickingHistory.current,
          isSlidable: true
        }, {
          flicking: flickingTimeline.current,
          isClickable: true
        }]
      })
    ])
  }, [])

  const [insights, setInsights] = useState(null)
  const [tweets, setTweets] = useState(null)
  const [user, setUser] = useState(null)

  const fetchInsights = useCallback(async () => {
    try {
      const response = await fetcher('/api/adventure/posts?tag=gamefiversary&limit=4')
      setInsights(response.data)
    } catch (e) { }
  }, [])
  const fetchTweets = useCallback(async () => {
    try {
      const response = await fetcher('/api/hub/guilds/feeds?id=1415522287126671363&limit=5')
      setTweets((response?.data?.posts?.data || []).slice(0, 4))
      setUser(response?.data?.user?.data || null)
    } catch (e) { }
  }, [])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  useEffect(() => {
    fetchTweets()
  }, [fetchTweets])

  const title = 'Happy Gamefiversary - Catventure in the Multiverse'
  const description = 'Come along with Gafi the Catstronaut and his space clowder as they explore uncharted web3 gaming universes in hunt of the legendary Golden Gafish.'

  return <div className="dark overflow-hidden">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} key="title" />
      <meta property="og:description" content={description} key="description" />
      <meta property="og:image" content={'https://gamefi.org/happy-gamefiversary.jpg?v=1655805418132'} key="image" />
      <meta name="keywords" content="launchpad, game hub, nft marketplace, game portal, game pass, game guild, tournament, metaverse, ido"></meta>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={'https://gamefi.org/happy-gamefiversary.jpg?v=1655805418132'} />
    </Head>
    <header className="fixed top-0 z-40 flex-none mx-auto w-full dark:bg-black dark:text-white font-atlas">
      <div className="sm:container mx-auto flex justify-between items-center p-3 lg:px-4 relative">
        <div className="flex justify-between flex-none w-full md:w-auto">
          <a href="#" className="flex items-center">
            <img src={logo.src} alt="gamefiversary"></img>
          </a>
          <button type="button" className="md:hidden inline-flex justify-center items-center px-4" aria-controls="navbar-multi-level" aria-expanded="false" onClick={() => setMenuMobile(v => !v)}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <div className={clsx('w-full md:block md:w-auto absolute top-20 left-0 md:relative md:top-0 md:left-0', menuMobile ? 'block' : 'hidden')}>
          <ul className="flex flex-col md:flex-row bg-gamefiDark-900 rounded md:bg-transparent py-2 drop-shadow-lg uppercase font-casual font-semibold text-sm leading-tight">
            {menu.map((item, i) => <li key={item.id}>
              <a href={`#${item.id}`} className={`px-4 lg:px-6 py-3 hover:text-gamefiGreen-500 relative block ${item.secondary ? 'md:hidden xl:block' : ''}`} onClick={() => {
                gtagEvent('catventure', { section: item.id })
              }}>
                <span className="hidden lg:block lg:absolute lg:top-0 lg:left-0 font-light">0{i + 1}</span>
                {item.text}
              </a>
            </li>)}
            <li className="px-4 lg:px-6">
              <WalletConnector hideBuy buttonClassName="sm:!w-full"></WalletConnector>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <div className="dark:bg-black dark:text-white font-atlas min-h-screen">
      <div className="transform -mb-40 sm:-mb-16 relative">
        <section className="relative md:container mx-auto z-10 pt-20" id="about">
          <div className="w-screen md:w-auto h-screen md:aspect-[16/7.5] md:h-auto relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={banner.src} alt="" className="absolute bottom-0 w-full" />
            </div>
            <div className="absolute inset-0 flex items-start pt-[25%] md:pt-10 lg:pt-8 2xl:pt-24 justify-center z-10">
              <h2 className="font-spotnik font-bold text-center text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[80px] leading-none uppercase">
                <span className="block">Catventure</span> In The Multiverse
              </h2>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <img src={cat.src} alt="" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full md:w-1/2 max-w-[700px]" />
            </div>
            <div className="absolute left-10 md:left-40 bottom-60 md:bottom-40">
              <img src={planet1.src} alt="" className="blur-[1px]" />
            </div>
            <div className="absolute -right-10 -bottom-10 z-20">
              <img src={planet2.src} alt="" className="blur-[2px]" />
            </div>
          </div>
        </section>
      </div>

      <Parallax speed={20} className="-mb-40 sm:-mb-16 3xl:mt-24">
        <section className="mx-auto max-w-[1920px] overflow-hidden z-20">
          <div className="md:container mx-auto text-center bg-black p-8">
            <div className="font-spotnik">
              <p className="text-2xl xl:text-3xl py-8">
                Catventure in the Multiverse - bringing players a captivating, thrilling, and diverse experience of multiple gameplays. Participating in Catventure, players become the Castronauts and Space Clowders to travel through our multiverse of games and metaverse.
              </p>
              <p className="text-2xl xl:text-3xl py-8">
                Find yourself challenging limits through various missions across the gameplays, gaining Gafish points, and reaching the top players of GameFi.org championship.</p>
              <p className="text-2xl xl:text-3xl py-8">
                The more Gafish you earn, the stronger you are as a Castronaut and Space Clowder. Top strongest players and teams on the leaderboard have valuable rewards awaiting at the end of Catventure. Along this journey, GameFi.org’s ultimate spin of luck will also stay available for every Castronaut to take their chance of winning $GAFI airdrop.
              </p>
              <p className="text-2xl xl:text-3xl py-8">
                Catventure takes place from
                August 22, 2022 to September 8, 2022.
                Stay tuned, Castronauts!
                Happy 1st Gamefiversary!
              </p>
            </div>
          </div>
        </section>
      </Parallax>

      {/* <Parallax speed={20}>
        <section className="mx-auto max-w-[1920px] overflow-hidden">
          <div className="relative py-40">
            <div className="flex items-center bg-white border-8 border-black py-2 md:py-4 absolute rotate-[4deg] left-1/2 transform -translate-x-1/2">
              {[1, 2, 3, 4, 5, 6, 7].map((e) => {
                return (
                  <div key={e} className="flex flex-none items-center">
                    <span className="font-bold text-base lg:text-2xl 2xl:text-4xl leading-none text-black uppercase -mb-1">
                      Event Leaderboard
                    </span>
                    <img src={fish.src} alt="icon-fish" className="mx-4" />
                  </div>
                )
              })}
            </div>
            <div className="flex items-center bg-white border-8 border-black py-2 md:py-4 absolute -rotate-[4deg] left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#93FF61] to-[#FAFF00]">
              {[1, 2, 3, 4, 5, 6, 7].map((e) => {
                return (
                  <div key={e} className="flex flex-none items-center">
                    <span className="font-bold text-base lg:text-2xl 2xl:text-4xl leading-none text-black uppercase -mb-1">
                      Event Leaderboard
                    </span>
                    <img src={fish.src} alt="icon-fish" className="mx-4" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </Parallax> */}
      <Parallax speed={20}>
        <section className="mx-auto max-w-[1920px]" id="history">
          <div className="md:container mx-auto p-8">
            <span className="text-transparent bg-gradient-to-br from-[#93FF61] to-[#FAFF00] bg-clip-text font-spotnik text-lg md:text-2xl font-bold uppercase">
              [ GameFi.Org History ]
            </span>
          </div>
          <Flicking
            autoResize={true}
            useResizeObserver={true}
            resizeDebounce={50}
            defaultIndex={historyActive}
            align="center"
            interruptable={true}
            ref={flickingHistory}
            plugins={plugins}
            onWillChange={(e) => {
              setHistoryActive(e.index)
              gtagEvent('catventure_history', { time: e.index })
            }}
          >
            {history.map((item) => <div key={item.time} className="w-full text-white flex items-center justify-center">
              <div className="py-16 sm:w-[60%] max-w-[750px] text-justify text-base md:text-lg lg:text-xl xl:text-2xl underline-offset-8">
                <div className="relative z-0 text-center text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[80px] drop-shadow-[0_0_1px_rgba(255,255,255,0.5)] text-black uppercase font-bold">{item.time}</div>
                <div className="relative px-8 xl:px-16 z-20 -mt-6 md:-mt-8 xl:-mt-9">{item.content()}</div>
              </div>
            </div>)}
          </Flicking>
          <Flicking
            autoResize={true}
            useResizeObserver={true}
            resizeDebounce={50}
            defaultIndex={historyActive}
            align="center"
            interruptable={true}
            ref={flickingTimeline}
            bound={true}
          >
            {history.map((item, i) => <div className={clsx('group flex-none w-1/3 lg:w-1/4 xl:w-1/6 text-center relative cursor-pointer text-white text-opacity-70 hover:text-opacity-75', i === historyActive && 'text-opacity-100')} key={i}>
              <div className="relative !bg-transparent cursor-pointer flex items-center justify-center">
                <div className={`rounded-full border ${i === historyActive ? 'border-gamefiGreen-500' : 'border-transparent group-hover:border-white'}`}>
                  <div className={`h-2 w-2 m-4 ${i === historyActive ? 'bg-gamefiGreen-500' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>
              <div className={'pt-2 text-[12px]'}>{history[i].time}</div>
            </div>)}

            <ViewportSlot>
              <div className="absolute top-5 h-px w-full bg-gamefiDark-650"></div>
            </ViewportSlot>
          </Flicking>
        </section>
      </Parallax>
      <section className="mx-auto max-w-[1920px] overflow-hidden mt-16" id="adventure">
        <div className="relative w-full overflow-hidden">
          <div className="flex items-center bg-white py-2 md:py-4 my-4">
            {[1, 2, 3, 4, 5, 6, 7].map((e) => {
              return (
                <div key={e} className="flex flex-none items-center">
                  <span className="font-bold text-base lg:text-2xl 2xl:text-4xl leading-none text-black uppercase -mb-1">Adventure Event</span>
                  <img src={fish.src} alt="icon-fish" className="mx-4" />
                </div>
              )
            })}
          </div>
        </div>
        <div className="container mx-auto flex justify-between py-16 relative">
          <div className="max-w-2xl px-4">
            <p className="font-spotnik text-3xl md:text-4xl lg:text-5xl font-bold uppercase">Catventure in <br /> the Multiverse</p>
            <p className="text-sm md:text-base mt-6">Each gameplay in Catventure is a thrilling universe for our Castronauts and Space Clowders to explore, overcome missions and gain Gafish. Which one captivates you the most?</p>
          </div>
          <div className="flex-none absolute md:relative right-0 md:right-auto opacity-50 md:opacity-100">
            <img src={satellite.src} alt="" />
          </div>
        </div>
        <World />
      </section>
      <section className="mx-auto max-w-[1920px] overflow-hidden bg-[#141414]" id="spin">
        <Spin comingsoon />
      </section>
      <section className="mx-auto max-w-[1920px] overflow-hidden bg-repeat-x" id="press" style={{ backgroundImage: `url(${grid.src})` }}>
        <div className="container mx-auto py-16 relative">
          <div className="p-4">
            <p className="font-spotnik text-3xl md:text-4xl lg:text-5xl font-bold uppercase">Multiverse <br /> Insight News</p>
          </div>
          <div className="flex flex-col md:flex-row gap-16 justify-between items-start px-4 mt-8 font-spotnik">
            <div className="w-full">
              <div className="flex items-center gap-8 mb-12">
                <div className="font-bold text-7xl">1</div>
                <div>
                  <h4 className="font-bold uppercase text-3xl">Related News</h4>
                  <p className="text-base">Follow our latest articles about<br />the Gamefiversary event here!</p>
                </div>
              </div>
              {insights && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {insights.map(post => <a key={post.id} className="relative p-4 bg-white text-black rounded-lg font-casual" href={`https://gamefi.org/insight/${post.slug}`}>
                  <img src={post.feature_image} alt={post.title} className="w-full aspect-[16/9]"></img>
                  <h4 className="text-base leading-tight font-semibold py-2 hover:underline">{post.title}</h4>
                </a>)}
              </div>}
            </div>
            <div className="w-full">
              <div className="flex items-center gap-8 mb-12">
                <div className="font-bold text-7xl">2</div>
                <div>
                  <h4 className="font-bold uppercase text-3xl">Twitter News</h4>
                  <p className="text-base">Never miss any post from us<br /> 👉🏻 Check it out now</p>
                </div>
              </div>
              {tweets && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {tweets.map(post => <div key={post.id} className="relative p-4 bg-white text-black rounded-lg font-casual">
                  <div className="w-full flex gap-2 mb-4">
                    <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="w-10 h-10 rounded-full overflow-hidden">
                      <img src={user?.profile_image_url} className="w-full h-full" alt=""></img>
                    </a>
                    <div className="min-h-[40px] flex flex-col">
                      <div className="flex items-center gap-2">
                        <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="font-semibold hover:underline">{user?.name}</a>
                        {user?.verified && <div><Image src={require('@/assets/images/guilds/verified.png')} alt=""></Image></div>}
                      </div>
                      <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="text-xs text-gamefiDark-200 hover:underline">{!!user?.username && `@${user.username}`}</a>
                    </div>
                    <a href={`https://twitter.com/${user?.username}/status/${post?.id}`} target="_blank" rel="noreferrer noopener" className="ml-auto hover:underline">
                      <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.43465 24C20.7561 24 26.9473 14.7672 26.9473 6.76137C26.9473 6.49896 26.9418 6.23823 26.9296 5.9785C28.1312 5.12299 29.1758 4.05595 30 2.84131C28.897 3.32362 27.7103 3.64862 26.4651 3.79488C27.7361 3.04514 28.7116 1.85828 29.172 0.443484C27.9823 1.13766 26.6657 1.64206 25.2638 1.91418C24.1404 0.736685 22.5409 0 20.7711 0C17.3715 0 14.6149 2.71345 14.6149 6.05816C14.6149 6.53377 14.669 6.996 14.7744 7.43982C9.65941 7.18644 5.12315 4.77523 2.08775 1.10955C1.55867 2.00488 1.25435 3.04514 1.25435 4.15469C1.25435 6.25664 2.34107 8.11257 3.99324 9.19802C2.98371 9.16756 2.03505 8.89411 1.20573 8.43991C1.20437 8.46535 1.20437 8.49079 1.20437 8.51723C1.20437 11.4519 3.32612 13.9016 6.1422 14.4569C5.62536 14.5955 5.08132 14.6701 4.5196 14.6701C4.12313 14.6701 3.73755 14.6313 3.3625 14.561C4.14626 16.9679 6.4183 18.7197 9.11265 18.7692C7.00552 20.3942 4.35197 21.3625 1.46822 21.3625C0.971789 21.3625 0.481814 21.3347 0 21.2785C2.72393 22.9969 5.95825 24 9.43465 24Z" fill="#049EF4" />
                      </svg>
                    </a>
                  </div>
                  <div className="w-full text-sm mb-4">
                    {post.text}
                  </div>
                  {!!post?.created_at && <a href={`https://twitter.com/${user?.username}/status/${post?.id}`} target="_blank" rel="noreferrer noopener" className="hover:underline text-sm font-medium text-gamefiDark-200">{format(new Date(post?.created_at), 'dd MMM yyyy')}</a>}
                </div>)}
              </div>}
            </div>
          </div>
        </div>
      </section>
    </div >
  </div >
}

const Adventure = () => {
  return <ParallaxProvider>
    <Content></Content>
  </ParallaxProvider>
}

export default Adventure
