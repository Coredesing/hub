import { useCountdown } from '@/components/Pages/Hub/Countdown'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import fonts from '@/components/Pages/Adventure/index.module.scss'
import { CATVENTURE_GG_CALENDAR_EVENT } from '@/utils/constants'
import Head from 'next/head'
import bg from '@/components/Pages/Adventure/images/bg-countdown.png'

// eslint-disable-next-line no-unused-expressions
fonts // this is intentional to avoid tree-shaking

const CATVENTURE_START_TIME = new Date(Date.UTC(2022, 8, 22, 13))

const pad = (num = 0, width = 2, char = '0') => {
  const _num = num.toString()

  return _num.length >= width
    ? _num
    : new Array(width - _num.length + 1).join(char) + _num
}

const Catventure = () => {
  const [deadline, setDeadline] = useState(new Date())
  const { countdown, ended } = useCountdown({ deadline })
  const router = useRouter()

  useEffect(() => {
    ended && router.push('/adventure')
  }, [ended, router])

  useEffect(() => {
    if (CATVENTURE_START_TIME) {
      setDeadline(CATVENTURE_START_TIME)
    }
  }, [])

  const title = 'Happy Gamefiversary - Catventure in the Multiverse'
  const description = 'Come along with Gafi the Catstronaut and his space clowder as they explore uncharted web3 gaming universes in hunt of the legendary Golden Gafish.'

  return <div className='flex bg-black text-white w-full h-[100vh] flex-col overflow-hidden relative bg-repeat-x bg-bottom' style={{ backgroundImage: `url(${bg.src})` }}>
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
    <a href='https://gamefi.org' className='mx-auto mt-10 xtall:mt-20 cursor-pointer z-10'>
      <Image src={require('@/assets/images/logo-color.png')} width={156} height={17} alt="gamefi-logo" />
    </a>

    <div className='mx-auto px-10 mt-14 xtall:mt-20 z-10'>
      <Image src={require('@/components/Pages/Adventure/images/text-countdown.svg')} alt="text-countdown" />
    </div>

    <div className="relative mt-6 xtall:mt-20 block gap-2 text-transparent font-bold font-spotnik bg-clip-text selection:text-white bg-gradient-to-r from-[#6CDB00] to-[#A2DB00] text-base lsm:text-2xl sm:text-3xl xl:text-4xl 2xl:text-[40px] text-center mx-auto px-10 z-10">
      {`${countdown.days > 0 ? `${pad(countdown.days)}D :` : ''} ${pad(countdown.hours)}H : ${pad(countdown.minutes)}M : ${pad(countdown.seconds)}S`}
    </div>

    <a
      target="_blank"
      rel="noreferrer"
      href={CATVENTURE_GG_CALENDAR_EVENT || ''}
      className='mt-10 flex mx-auto font-semibold font-casual text-[13px] uppercase'>
      <div className='flex items-center justify-center px-24 text-gamefiDark-900 bg-gamefiGreen-700 rounded-sm py-3 z-10'>
        Remind me
      </div>
    </a>

    <a href='https://gamefi.org' className='mt-8 mx-auto text-[13px] text-white/60 tracking-[0.05em] font-casual cursor-pointer leading-none hover:underline z-10'>Back to GameFi.org</a>

    <div className='absolute w-full bottom-0 tall:bottom-[4rem] z-0'>
      <div className="flex justify-center max-w-[16rem] tall:max-w-md mx-auto w-[60%]">
        <Image src={require('@/components/Pages/Adventure/images/meow_dark.png')} alt="meow-logo" />
      </div>
    </div>

    <div className="hidden absolute bottom-0 w-full h-[4rem] tall:flex overflow-x-hidden bg-white">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {Array.from(Array(8)).map((_, i) => {
          return <div key={i} className="mx-4 inline-flex gap-8 items-center">
            <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
            <svg width="39" height="39" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M35 19.5c0 5.821-8.79 8.5-13.232 8.5-2.66 0-7.505-2.275-11-4.456a1.018 1.018 0 0 0-1.227.108L5.16 27.677C3.572 29.105 3 27.5 3 25.482V13.76c0-2.02.597-3.581 2.184-2.153L9.22 15.34c.34.315.852.354 1.244.105C13.983 13.216 19.069 11 21.768 11 26.21 11 35 13.679 35 19.5Zm-5.04-1.7c0 1.252-1.129 2.267-2.521 2.267s-2.52-1.015-2.52-2.267 1.128-2.267 2.52-2.267c1.392 0 2.52 1.015 2.52 2.267Z" fill="#000" /></svg>
          </div>
        })}
      </div>

      <div className="animate-marquee2 whitespace-nowrap flex h-full items-center absolute top-0">
        {Array.from(Array(8)).map((_, i) => {
          return <div key={i} className="mx-4 inline-flex gap-8 items-center">
            <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
            <svg width="39" height="39" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M35 19.5c0 5.821-8.79 8.5-13.232 8.5-2.66 0-7.505-2.275-11-4.456a1.018 1.018 0 0 0-1.227.108L5.16 27.677C3.572 29.105 3 27.5 3 25.482V13.76c0-2.02.597-3.581 2.184-2.153L9.22 15.34c.34.315.852.354 1.244.105C13.983 13.216 19.069 11 21.768 11 26.21 11 35 13.679 35 19.5Zm-5.04-1.7c0 1.252-1.129 2.267-2.521 2.267s-2.52-1.015-2.52-2.267 1.128-2.267 2.52-2.267c1.392 0 2.52 1.015 2.52 2.267Z" fill="#000" /></svg>
          </div>
        })}
      </div>
    </div>
  </div>
}

export default Catventure
