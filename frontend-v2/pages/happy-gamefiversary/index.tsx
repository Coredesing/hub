import fonts from '@/components/Pages/Adventure/index.module.scss'
import logo from '@/components/Pages/Adventure/images/logo.png'
import banner from '@/components/Pages/Adventure/images/banner.png'
import cat from '@/components/Pages/Adventure/images/cat.png'
import fish from '@/components/Pages/Adventure/images/fish.svg'
import satellite from '@/components/Pages/Adventure/images/satellite.svg'
import planet1 from '@/components/Pages/Adventure/images/planet-1.png'
import planet2 from '@/components/Pages/Adventure/images/planet-2.png'
import grid from '@/components/Pages/Adventure/images/grid.png'
import logoGameFi from '@/components/Pages/Adventure/images/logo-gradient.png'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Flicking, { ViewportSlot, Plugin } from '@egjs/react-flicking'
import { Sync } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/react-flicking/dist/flicking.css'
import World from '@/components/Pages/Adventure/World'
import Spin from '@/components/Pages/Adventure/Spin'
import { easeOutSine, fetcher, gtagEvent } from '@/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import Guilds from '@/components/Pages/Adventure/Partners/guilds'
import Communities from '@/components/Pages/Adventure/Partners/communities'
import Games from '@/components/Pages/Adventure/Partners/games'

// eslint-disable-next-line no-unused-expressions
fonts

const menu = [{
  id: 'about',
  text: 'About Event'
}, {
  id: 'leaderboard',
  text: 'Leaderboard',
  hidden: true,
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
      <meta property="og:image" content={'https://gamefi.org/happy-gamefiversary.jpg?v=1661187628261'} key="image" />
      <meta name="keywords" content="launchpad, game hub, nft marketplace, game portal, game pass, game guild, tournament, metaverse, ido"></meta>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={'https://gamefi.org/happy-gamefiversary.jpg?v=1661187628261'} />
    </Head>
    <header className="fixed top-0 z-40 flex-none mx-auto w-full bg-black text-white font-atlas">
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
          <ul className="flex flex-col md:flex-row bg-gamefiDark-900 rounded md:bg-transparent py-2 drop-shadow-lg uppercase font-casual font-semibold text-sm leading-tight justify-center items-center">
            {menu.filter(x => !x.hidden).map((item, i) => <li key={item.id}>
              <a href={`#${item.id}`} className={`px-4 lg:px-6 py-3 hover:text-gamefiGreen-500 relative block ${item.secondary ? 'md:hidden xl:block' : ''}`} onClick={() => {
                gtagEvent('catventure', { section: item.id })
              }}>
                <span className="hidden xl:block xl:absolute xl:top-0 xl:left-0 font-light">0{i + 1}</span>
                {item.text}
              </a>
            </li>)}
            <li className="px-4 xl:px-6">
              <Link href="/happy-gamefiversary/tasks" passHref={true}>
                <a className="mt-auto bg-gradient-to-r from-[#93FF61] to-[#FAFF00] text-black font-casual font-semibold text-[12px] uppercase block w-full clipped-t-r px-6 py-3 text-center" onClick={() => {
                  gtagEvent('catventure_join_now')
                }}>
                  Join Now
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <div className="bg-black text-white font-atlas">
      <div className="relative">
        <section className="relative md:container mx-auto z-10 md:pt-20" id="about">
          <div className="w-screen md:w-auto h-screen md:aspect-[16/7] md:h-auto relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={banner.src} alt="" className="absolute bottom-0 w-full" />
            </div>
            <div className="absolute inset-0 flex items-start pt-[25%] md:pt-4 xl:pt-0 2xl:pt-16 justify-center z-10">
              <h2 className="font-spotnik font-bold text-center text-4xl sm:text-5xl xl:text-7xl 2xl:text-[80px] leading-none uppercase">
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

      <section className="mx-auto max-w-[1920px] overflow-hidden z-20">
        <div className="md:container mx-auto text-center bg-black px-8 pt-24 w-full">
          <div className="font-spotnik max-w-[870px] mx-auto py-1">
            <p className="text-2xl xl:text-3xl">
              To celebrate our first Gamefiversary, GameFi.org is honored to bring you the Catventure in the Multiverse. This very first event will bring you a captivating, thrilling, and diverse experience of multiple gameplays. Let&lsquo;s get on our spaceship to become a Catstronaut and join Space Clowders to travel through our Multiverse of games and metaverse.
            </p>
          </div>
        </div>
      </section>

      {/* <section className="mx-auto max-w-[1920px] overflow-hidden">
        <div className="relative pb-40 pt-20">
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
      </section> */}

      <div id="history" className="pt-24 invisible"></div>
      <section className="mx-auto max-w-[1920px]">
        <div className="md:container mx-auto p-8">
          <span className="text-transparent bg-gradient-to-br from-[#93FF61] to-[#FAFF00] bg-clip-text font-spotnik text-lg md:text-2xl font-bold uppercase">
            [ GameFi.org History ]
          </span>
        </div>
        <Flicking
          autoResize={true}
          useResizeObserver={true}
          resizeDebounce={50}
          defaultIndex={historyActive}
          align="center"
          interruptable={true}
          preventClickOnDrag={false}
          ref={flickingHistory}
          plugins={plugins}
          onChanged={(e) => {
            setHistoryActive(e.index)
            gtagEvent('catventure_history', { time: e.index })
          }}
          easing={easeOutSine}
        >
          {history.map((item) => <div key={item.time} className="w-full text-white flex items-center justify-center">
            <div className="py-16 sm:w-[60%] max-w-[750px] text-base md:text-lg lg:text-xl xl:text-2xl underline-offset-8">
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
          preventClickOnDrag={false}
          ref={flickingTimeline}
          bound={true}
          easing={easeOutSine}
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

      <div id="adventure" className="pt-24 invisible"></div>
      <section className="mx-auto max-w-[1920px] overflow-hidden">
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
            <p className="text-sm md:text-base mt-6">Each gameplay in Catventure is a thrilling universe for our Catstronauts and Space Clowders to explore, overcome missions and gain Gafish. Which one captivates you the most?</p>
          </div>
          <div className="flex-none absolute md:relative right-0 md:right-auto opacity-50 md:opacity-100">
            <img src={satellite.src} alt="" />
          </div>
        </div>
        <World />
      </section>

      <div id="spin" className="pt-24 invisible -mt-24"></div>
      <section className="mx-auto max-w-[1920px] overflow-hidden bg-[#141414]">
        <Spin comingsoon />
      </section>

      <div id="press" className="pt-24 invisible -mt-24"></div>
      <section className="mx-auto max-w-[1920px] overflow-hidden bg-repeat-x" style={{ backgroundImage: `url(${grid.src})` }}>
        <div className="container mx-auto lg:block font-atlas p-6 lg:p-12 relative">
          <div className="py-4">
            <p className="font-spotnik text-3xl md:text-4xl lg:text-5xl font-bold uppercase">Multiverse <br /> Insight News</p>
          </div>
          <div className="flex flex-col md:flex-row gap-16 justify-between items-start mt-8 font-spotnik">
            <div className="w-full">
              <div className="flex items-center gap-8 mb-12">
                <div className="font-bold text-7xl">1</div>
                <div>
                  <h4 className="font-bold uppercase text-3xl">Related News</h4>
                  <p className="text-base">Follow our latest articles about<br /><Link href="/insight/tag/gamefiversary" passHref><a className="text-gamefiGreen-500 hover:underline hover:underline-offset-4">the Gamefiversary event here!</a></Link></p>
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
                  <p className="text-base">Never miss any post from us<br /> <a href="https://twitter.com/GameFi_Official" target="_blank" rel="noreferrer" className="p-2 block group text-gamefiGreen-500 hover:underline hover:underline-offset-4">👉🏻 Check it out now</a></p>
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

      <div id="partners" className="pt-24 invisible -mt-24"></div>
      <section className="mx-auto max-w-[1920px] overflow-hidden">
        <div className="container mx-auto relative flex">
          <img src={satellite.src} alt="" className="ml-auto opacity-50 md:opacity-100" />
          <div className="absolute inset-0 md:left-auto md:right-40 flex items-center justify-center text-3xl lg:text-5xl uppercase font-bold"><span className="bg-black">Our Partners</span></div>
        </div>

        <Games />
        <Guilds />
        <Communities />
      </section>
      <div className="container mx-auto py-8 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-center relative">
          <img src={logoGameFi.src} alt="GameFi.org" className="h-5 w-auto" />
          <div className="text-sm text-white text-opacity-60 text-center my-4 flex-1 md:my-0">Crafted with love © GameFi.org 2022 <br className="md:hidden" /><span className="hidden md:inline">–</span> All Rights Reserved.</div>
          <div className="flex gap-4 md:gap-0">
            <div className="cursor-pointer">
              <a href="https://gamefi.org/" target="_blank" rel="noreferrer" className="p-2 block group">
                <svg className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" />
                </svg>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="https://t.me/GameFi_OfficialANN" target="_blank" rel="noreferrer" className="p-2 block group">
                <svg className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#x)">
                    <path d="M15.9683 1.68422C15.9557 1.62517 15.9276 1.57057 15.8868 1.52608C15.846 1.48158 15.794 1.44883 15.7363 1.43122C15.526 1.3893 15.3084 1.40484 15.1063 1.47622C15.1063 1.47622 1.08725 6.51422 0.286252 7.07222C0.114252 7.19322 0.056252 7.26222 0.027252 7.34422C-0.110748 7.74422 0.320252 7.91722 0.320252 7.91722L3.93325 9.09422C3.99426 9.10522 4.05701 9.10145 4.11625 9.08322C4.93825 8.56422 12.3863 3.86122 12.8163 3.70322C12.8843 3.68322 12.9343 3.70322 12.9163 3.75222C12.7443 4.35222 6.31025 10.0712 6.27525 10.1062C6.25818 10.1205 6.2448 10.1387 6.23627 10.1592C6.22774 10.1798 6.2243 10.2021 6.22625 10.2242L5.88925 13.7522C5.88925 13.7522 5.74725 14.8522 6.84525 13.7522C7.62425 12.9732 8.37225 12.3272 8.74525 12.0142C9.98725 12.8722 11.3243 13.8202 11.9013 14.3142C11.9979 14.4083 12.1125 14.4819 12.2383 14.5305C12.3641 14.5792 12.4985 14.6018 12.6333 14.5972C12.7992 14.5767 12.955 14.5062 13.0801 14.3952C13.2051 14.2841 13.2934 14.1376 13.3333 13.9752C13.3333 13.9752 15.8943 3.70022 15.9793 2.31722C15.9873 2.18222 16.0003 2.10022 16.0003 2.00022C16.0039 1.89392 15.9931 1.78762 15.9683 1.68422Z" />
                  </g>
                  <defs>
                    <clipPath id="x">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="https://t.me/GameFi_Official" target="_blank" rel="noreferrer" className="p-2 block group">
                <svg className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#y)">
                    <path d="M15.9683 1.68422C15.9557 1.62517 15.9276 1.57057 15.8868 1.52608C15.846 1.48158 15.794 1.44883 15.7363 1.43122C15.526 1.3893 15.3084 1.40484 15.1063 1.47622C15.1063 1.47622 1.08725 6.51422 0.286252 7.07222C0.114252 7.19322 0.056252 7.26222 0.027252 7.34422C-0.110748 7.74422 0.320252 7.91722 0.320252 7.91722L3.93325 9.09422C3.99426 9.10522 4.05701 9.10145 4.11625 9.08322C4.93825 8.56422 12.3863 3.86122 12.8163 3.70322C12.8843 3.68322 12.9343 3.70322 12.9163 3.75222C12.7443 4.35222 6.31025 10.0712 6.27525 10.1062C6.25818 10.1205 6.2448 10.1387 6.23627 10.1592C6.22774 10.1798 6.2243 10.2021 6.22625 10.2242L5.88925 13.7522C5.88925 13.7522 5.74725 14.8522 6.84525 13.7522C7.62425 12.9732 8.37225 12.3272 8.74525 12.0142C9.98725 12.8722 11.3243 13.8202 11.9013 14.3142C11.9979 14.4083 12.1125 14.4819 12.2383 14.5305C12.3641 14.5792 12.4985 14.6018 12.6333 14.5972C12.7992 14.5767 12.955 14.5062 13.0801 14.3952C13.2051 14.2841 13.2934 14.1376 13.3333 13.9752C13.3333 13.9752 15.8943 3.70022 15.9793 2.31722C15.9873 2.18222 16.0003 2.10022 16.0003 2.00022C16.0039 1.89392 15.9931 1.78762 15.9683 1.68422Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="y">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="https://twitter.com/GameFi_Official" target="_blank" rel="noreferrer" className="p-2 block group">
                <svg className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 3C15.4 3.3 14.8 3.4 14.1 3.5C14.8 3.1 15.3 2.5 15.5 1.7C14.9 2.1 14.2 2.3 13.4 2.5C12.8 1.9 11.9 1.5 11 1.5C9.3 1.5 7.8 3 7.8 4.8C7.8 5.1 7.8 5.3 7.9 5.5C5.2 5.4 2.7 4.1 1.1 2.1C0.8 2.6 0.7 3.1 0.7 3.8C0.7 4.9 1.3 5.9 2.2 6.5C1.7 6.5 1.2 6.3 0.7 6.1C0.7 7.7 1.8 9 3.3 9.3C3 9.4 2.7 9.4 2.4 9.4C2.2 9.4 2 9.4 1.8 9.3C2.2 10.6 3.4 11.6 4.9 11.6C3.8 12.5 2.4 13 0.8 13C0.5 13 0.3 13 0 13C1.5 13.9 3.2 14.5 5 14.5C11 14.5 14.3 9.5 14.3 5.2C14.3 5.1 14.3 4.9 14.3 4.8C15 4.3 15.6 3.7 16 3Z" />
                </svg>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="https://discord.com/invite/gamefi" target="_blank" rel="noreferrer" className="p-2 block group">
                <svg className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.8352 13.8052C12.8352 13.8052 12.3451 13.213 11.9367 12.7025C12.9235 12.4702 13.7964 11.8963 14.4009 11.0824C13.911 11.4084 13.3858 11.6778 12.8352 11.8856C12.2019 12.156 11.5395 12.3524 10.8611 12.471C9.69515 12.6859 8.49931 12.6813 7.33501 12.4574C6.65146 12.3237 5.98156 12.1277 5.33369 11.872C4.78846 11.662 4.26799 11.3926 3.78165 11.0687C4.36427 11.8656 5.20701 12.4339 6.16417 12.6752C5.75574 13.1858 5.252 13.8052 5.252 13.8052C4.44327 13.8271 3.64157 13.6498 2.91748 13.2889C2.19338 12.928 1.56911 12.3947 1.09961 11.7359C1.14379 8.97582 1.81414 6.26185 3.06008 3.79865C4.15652 2.93752 5.49326 2.43803 6.88573 2.36914L7.02188 2.53932C5.71427 2.86462 4.4942 3.47349 3.4481 4.32281C3.4481 4.32281 3.74761 4.15263 4.25135 3.92799C5.23036 3.48363 6.27333 3.19647 7.34182 3.07709C7.41803 3.06131 7.49547 3.0522 7.57326 3.04986C8.48253 2.92474 9.4035 2.90875 10.3166 3.00221C11.7547 3.16645 13.1468 3.61045 14.4145 4.30919C13.419 3.5018 12.2636 2.9148 11.0245 2.58697L11.2151 2.36914C12.6076 2.43803 13.9443 2.93752 15.0408 3.79865C16.2867 6.26185 16.9571 8.97582 17.0012 11.7359C16.5279 12.3941 15.901 12.9267 15.1749 13.2873C14.4489 13.648 13.6457 13.8258 12.8352 13.8052ZM5.51177 7.93044C5.76964 7.65048 6.12338 7.47774 6.50272 7.44654C6.69355 7.4533 6.88113 7.4979 7.05457 7.57776C7.22802 7.65763 7.38386 7.77116 7.51306 7.91175C7.64226 8.05235 7.74224 8.21722 7.80718 8.39678C7.87213 8.57634 7.90075 8.76702 7.89139 8.95774C7.89961 9.14818 7.87019 9.33839 7.80482 9.51745C7.73945 9.69652 7.63941 9.86094 7.51043 10.0013C7.38145 10.1417 7.22605 10.2552 7.05314 10.3355C6.88023 10.4157 6.69319 10.4611 6.50272 10.4689C6.12338 10.4377 5.76964 10.265 5.51177 9.98503C5.25389 9.70507 5.11074 9.33836 5.11074 8.95774C5.11074 8.57711 5.25389 8.2104 5.51177 7.93044ZM10.5971 7.63804C10.8628 7.48758 11.1677 7.42084 11.472 7.44654C11.6624 7.45441 11.8495 7.49977 12.0224 7.58001C12.1953 7.66026 12.3507 7.77381 12.4797 7.91417C12.6087 8.05453 12.7087 8.21895 12.7741 8.39802C12.8394 8.57709 12.8689 8.76729 12.8607 8.95774C12.8606 9.26306 12.7684 9.56126 12.596 9.81331C12.4237 10.0654 12.1793 10.2595 11.8948 10.3703C11.6103 10.4812 11.2989 10.5035 11.0015 10.4345C10.7041 10.3655 10.4344 10.2083 10.2278 9.98343C10.0213 9.75861 9.88735 9.47665 9.84365 9.17447C9.79995 8.87228 9.8485 8.56394 9.98294 8.28981C10.1174 8.01567 10.3315 7.78851 10.5971 7.63804Z" />
                </svg>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="https://medium.com/gamefi-official" target="_blank" rel="noreferrer" className="p-2 block group">
                <svg className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" />
                </svg>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="https://www.facebook.com/GameFi.org/" target="_blank" rel="noreferrer" className="p-2 block group">
                <svg className="w-5 h-5 fill-white group-hover:fill-gamefiGreen-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.01972 15.3334L5.9987 8.66675H3.33203V6.00008H5.9987V4.33341C5.9987 1.85915 7.53091 0.666748 9.73812 0.666748C10.7954 0.666748 11.7041 0.745461 11.9689 0.780648V3.3664L10.4381 3.36709C9.23766 3.36709 9.00524 3.93751 9.00524 4.77455V6.00008H12.4987L11.1654 8.66675H9.00524V15.3334H6.01972Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div >
}

const Adventure = () => {
  return <Content></Content>
}

export default Adventure
