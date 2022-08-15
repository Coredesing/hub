import { useCountdown } from '@/components/Pages/Hub/Countdown'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '@/components/Pages/Adventure/index.module.scss'
import { CATVENTURE_GG_CALENDAR_EVENT } from '@/utils/constants'
import Head from 'next/head'

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

  return <div className='flex dark bg-black w-full h-[100vh] flex-col overflow-hidden relative' style={styles}>
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
    <div className='mx-auto mt-10'>
      <Image src={require('@/assets/images/logo-color.png')} width={156} height={17} alt="gamefi-logo" />
    </div>
    <div className='mx-auto px-10 mt-14'>
      <Image src={require('@/components/Pages/Adventure/images/text-countdown.svg')} alt="text-countdown" />
    </div>
    <div className="relative z-50 mt-6 w-fit block gap-2 text-transparent font-bold font-spotnik bg-clip-text bg-gradient-to-r from-[#6CDB00] to-[#A2DB00] text-[30px] text-center md:text-[48px] lg:text-[64px] lg:leading-[82px] leading-[62px] mx-auto px-10">
      {`${countdown.days > 0 ? `${pad(countdown.days)}D :` : ''} ${pad(countdown.hours)}H : ${pad(countdown.minutes)}M`}
    </div>
    <a
      target="_blank"
      rel="noreferrer"
      href={CATVENTURE_GG_CALENDAR_EVENT || ''}
      className='mt-10 flex h-11 mx-auto font-semibold font-casual text-[13px] leading-[13px] gap-3 uppercase relative z-10'>
      <div className='flex items-center justify-center px-32 md:px-[90px] bg-gamefiGreen-700 rounded-sm py-3'>
        Remind me
      </div>
    </a>
    <p className='relative z-10 mt-8 mx-auto text-[13px] leading-[13px] text-white/60 tracking-[0.05em] font-casual'>Back to GameFi.org</p>
    <div className='absolute bottom-0 left-0 w-full h-[439px]'>
      <Image src={require('@/components/Pages/Adventure/images/bg-countdown.png')} layout={'fill'} objectFit={'cover'} alt="meow-logo" />
    </div>
    <div className='mx-auto mt-10'>
      <Image src={require('@/components/Pages/Adventure/images/meow_dark.png')} alt="meow-logo" />
    </div>
    <div className="absolute bottom-0 left-0 hidden items-center w-full overflow-x-hidden text-[20px] md:text-[30px]">
      <div className='py-2 md:py-3 px-2 animate-marquee whitespace-nowrap w-full h-full flex items-center bg-white gap-7'>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
      </div>

      <div className='py-2 md:py-3 absolute top-0 -left-1 px-2 animate-marquee2 whitespace-nowrap w-full h-full flex items-center bg-white gap-7'>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
        <span className="font-bold pb-1 text-black uppercase font-spotnik ">Adventure Event</span>
        <div style={{ alignSelf: 'center', flex: '0 0 auto' }}>
          <Image src={require('@/components/Pages/Adventure/images/fish.svg')} alt="icon-fish"/>
        </div>
      </div>
    </div>
  </div>
}

export default Catventure
