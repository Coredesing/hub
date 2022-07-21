import React, { useMemo } from 'react'
import Link from 'next/link'
import '@egjs/flicking/dist/flicking.css'
import Image from 'next/image'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import { imageCMS, formatNumber, gtagEvent } from '@/utils'
import Header from './Header'
import { intervalToDuration, format } from 'date-fns'
import styles from './Carousel.module.scss'
import { useAppContext } from '@/context'
import { useRouter } from 'next/router'

const IosIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_7221_17956)">
      <path d="M14.326 12.0796C13.98 12.8456 13.815 13.1876 13.369 13.8646C12.748 14.8096 11.873 15.9876 10.788 15.9976C9.82404 16.0066 9.57604 15.3706 8.26804 15.3776C6.96004 15.3846 6.68604 16.0086 5.72204 15.9996C4.63704 15.9896 3.80804 14.9266 3.18604 13.9806C1.45004 11.3366 1.26804 8.23456 2.33904 6.58556C3.10004 5.41256 4.30104 4.72756 5.43104 4.72756C6.58104 4.72756 7.30304 5.35756 8.25404 5.35756C9.17604 5.35756 9.73804 4.72656 11.068 4.72656C12.073 4.72656 13.138 5.27356 13.896 6.21856C11.411 7.58156 11.815 11.1306 14.326 12.0796Z" fill="#6CDB00" />
      <path d="M10.6042 2.699C11.1502 1.999 11.5642 1.01 11.4132 0C10.5222 0.061 9.4802 0.628 8.8712 1.367C8.3192 2.038 7.8632 3.033 8.0402 4C9.0132 4.03 10.0192 3.449 10.6042 2.699Z" fill="#6CDB00" />
    </g>
    <defs>
      <clipPath id="clip0_7221_17956">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
}

const WebIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0H1C0.4 0 0 0.4 0 1V12C0 12.6 0.4 13 1 13H6V14H3V16H13V14H10V13H15C15.6 13 16 12.6 16 12V1C16 0.4 15.6 0 15 0ZM14 11H2V2H14V11Z" fill="#6CDB00" />
  </svg>
}

const AndroidIcon = () => {
  return <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10.9994H16C15.8754 9.67471 15.4681 8.3922 14.8055 7.23843C14.1429 6.08467 13.2404 5.08651 12.159 4.31137L13.447 1.73537C13.4788 1.67643 13.4984 1.61171 13.5047 1.54504C13.511 1.47838 13.5038 1.41113 13.4836 1.34728C13.4634 1.28344 13.4306 1.2243 13.3872 1.17337C13.3437 1.12245 13.2904 1.08078 13.2305 1.05083C13.1706 1.02089 13.1053 1.00328 13.0385 0.999046C12.9717 0.994815 12.9047 1.00405 12.8415 1.02621C12.7783 1.04836 12.7202 1.08298 12.6706 1.12801C12.6211 1.17305 12.5811 1.22758 12.553 1.28837L11.3 3.80437C10.2822 3.27548 9.15202 2.99937 8.005 2.99937C6.85798 2.99937 5.72781 3.27548 4.71 3.80437L3.447 1.28837C3.41892 1.22758 3.37891 1.17305 3.32936 1.12801C3.2798 1.08298 3.22171 1.04836 3.15851 1.02621C3.09532 1.00405 3.02833 0.994815 2.9615 0.999046C2.89467 1.00328 2.82938 1.02089 2.76948 1.05083C2.70959 1.08078 2.65632 1.12245 2.61284 1.17337C2.56936 1.2243 2.53655 1.28344 2.51636 1.34728C2.49617 1.41113 2.48901 1.47838 2.4953 1.54504C2.5016 1.61171 2.52122 1.67643 2.553 1.73537L3.841 4.31137C2.75962 5.08651 1.85715 6.08467 1.19453 7.23843C0.531908 8.3922 0.124563 9.67471 0 10.9994H0ZM11.5 6.99937C11.6978 6.99937 11.8911 7.05802 12.0556 7.1679C12.22 7.27778 12.3482 7.43396 12.4239 7.61668C12.4996 7.79941 12.5194 8.00048 12.4808 8.19446C12.4422 8.38844 12.347 8.56662 12.2071 8.70647C12.0673 8.84633 11.8891 8.94157 11.6951 8.98015C11.5011 9.01874 11.3 8.99893 11.1173 8.92325C10.9346 8.84756 10.7784 8.71939 10.6685 8.55494C10.5586 8.39049 10.5 8.19715 10.5 7.99937C10.5 7.73415 10.6054 7.4798 10.7929 7.29226C10.9804 7.10472 11.2348 6.99937 11.5 6.99937ZM4.5 6.99937C4.69778 6.99937 4.89112 7.05802 5.05557 7.1679C5.22002 7.27778 5.34819 7.43396 5.42388 7.61668C5.49957 7.79941 5.51937 8.00048 5.48079 8.19446C5.4422 8.38844 5.34696 8.56662 5.20711 8.70647C5.06725 8.84633 4.88907 8.94157 4.69509 8.98015C4.50111 9.01874 4.30004 8.99893 4.11732 8.92325C3.93459 8.84756 3.77841 8.71939 3.66853 8.55494C3.55865 8.39049 3.5 8.19715 3.5 7.99937C3.5 7.73415 3.60536 7.4798 3.79289 7.29226C3.98043 7.10472 4.23478 6.99937 4.5 6.99937Z" fill="#6CDB00" />
  </svg>
}

const CarouselAction = ({ igoDate }) => {
  const { now } = useAppContext()
  const timeJoin = useMemo(() => {
    const time = igoDate && new Date(igoDate)
    return time
  }, [igoDate])

  const duration = useMemo(() => {
    if (timeJoin && now < timeJoin) {
      return intervalToDuration({
        start: now,
        end: timeJoin
      })
    }
  }, [now, timeJoin])

  return (
    <>
      <div className='mb-6' style={{ marginTop: 'auto', position: 'relative' }}>
        <div className='uppercase font-bold font-mechanic text-sm'><span>Count down to igo date</span></div>
        <svg viewBox="0 0 273 65" fill="none" xmlns="http://www.w3.org/2000/svg" className='block w-[70%]' fontSize="28" fontWeight="bold">
          <path opacity="0.12" d="M20.516 0.5H271.5V48.5V63.5H0.5V0.5H20.516Z" fill="#525252" stroke="#525252" />
          <path d="M20.3801 0.5H272.5V49.5V64.5H0.5V8.73149L10.2016 0.5H20.3801Z" stroke="#525252" />
          <rect x="263" y="4" width="6" height="21" fill="#525252" />
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }}><tspan x="55.1426" y="32.176">:</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }}><tspan x="121.143" y="32.176">:</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }}><tspan x="187.143" y="32.176">:</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }}><tspan x="12.8184" y="32.176">{formatNumber(duration?.days)}</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }} fontSize="10" fontWeight="600"><tspan x="14.209" y="50.92">DAYS</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }}><tspan x="79.4199" y="32.176">{formatNumber(duration?.hours)}</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }} fontSize="10" fontWeight="600"><tspan x="77.1377" y="50.92">HOURS</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }}><tspan x="142.344" y="32.176">{formatNumber(duration?.minutes)}</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }} fontSize="10" fontWeight="600"><tspan x="139.153" y="50.92">MINUTES</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }}><tspan x="208.344" y="32.176">{formatNumber(duration?.seconds)}</tspan></text>
          <text fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre', fontFamily: 'Rajdhani' }} fontSize="10" fontWeight="600"><tspan x="203.972" y="50.92">SECONDS</tspan></text>
        </svg>
        <div>
          <div className={styles.actionBtn}> <span className='mr-2'>Join Now</span> <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" /></div>
        </div>
      </div>
    </>
  )
}

const MoreInfoGame = ({ data, dataBase }) => {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!data?.currentPrice && !!data?.gameDownloads?.length) {
    return (
      <>
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-sm text-gray-300">Release Status</span>
          <span className="font-medium text-base truncate capitalize">{data?.releaseStatus || 'Coming Soon'}</span>
        </div>
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-sm text-gray-300">Game Download</span>
          {!!data?.gameDownloads?.length && <div className='flex gap-4'>
            <div className='flex flex-col md:justify-center gap-2'>
              <div className='flex flex-wrap gap-2'>
                {data?.gameDownloads?.map((e, i) => {
                  return (
                    <a key={i} href={e?.link || ''} className="text-xs px-2 py-1.5 bg-gamefiDark-630/50 hover:bg-gamefiDark-630 rounded" target="_blank" rel="noopenner noreferrer" onClick={() => {
                      gtagEvent('hub_download', { game: dataBase?.slug, type: e.type, link: e.link })
                    }}>
                      {
                        (e.type === 'ios') ? <IosIcon /> : (e.type === 'android') ? <AndroidIcon /> : <WebIcon />
                      }
                    </a>
                  )
                })}
              </div>
            </div>
          </div>}
        </div>
        {
          data?.guildSupported && <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-sm text-gray-300">Guild Supported</span>
            <span className="font-medium text-base truncate capitalize">{data?.guildSupported || 'Coming Soon'}</span>
          </div>
        }
      </>
    )
  }

  if (data?.currentPrice && data?.igoDate) {
    return (
      <>
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-sm text-gray-300">IGO Date</span>
          <span className="font-medium text-base truncate capitalize">{data?.igoDate && format(new Date(data?.igoDate), 'dd MMM, yyyy')}</span>
        </div>
      </>
    )
  }

  const now = new Date(Date.now())
  const igo = new Date(data?.igoDate)

  if (data?.igoDate && now < igo) {
    return (<><CarouselAction igoDate={data?.igoDate} /></>)
  }

  return <div></div>
}

const GameRight = ({ data, className, dataBase = null, callApi }) => {
  const router = useRouter()

  const { slug } = router.query

  const communityOfficial = get(dataBase, 'project.data.attributes.communityOfficial', {})
  const {
    website,
    telegram,
    facebook,
    twitch,
    reddit,
    medium,
    discordServer,
    twitter,
    youtube,
    tiktok,
    instagram,
    telegramANN
  } = communityOfficial || { website: false, telegram: false, facebook: false, twitch: false, reddit: false, medium: false, discordServer: false, twitter: false, youtube: false, tiktok: false, instagram: false, telegramANN: false }

  return (
    <div className={`flex-1 overflow-x-hidden ${className || ''}`}>
      <img src={imageCMS(data?.mobileThumbnail)} className="w-full aspect-[16/9] mb-3" alt="" />
      <Header
        className={'flex md:hidden flex-col mt-6'}
        name={dataBase?.name}
        callApi={callApi}
        id={dataBase?.id}
        slug={dataBase?.slug}
        isVerified={get(dataBase, 'project.data.attributes.isVerifiedGameFi')}
        totalFavorites={data?.totalFavorites}
      />
      <div className="w-full mb-6 relative overflow-hidden text-base">
        <span>{data?.shortDesc}</span>
      </div>
      {communityOfficial && <div className="flex justify-between mb-3 gap-4">
        <span className="text-sm text-gray-300">Community</span>
        <div className='flex flex-col gap-5'>
          <div className="grid grid-cols-6 gap-2 justify-end mr-auto md:mr-0" style={{ direction: 'rtl' }}>
            {website && <a href={website || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7C10.6 7 7 10.6 7 15C7 19.4 10.6 23 15 23C19.4 23 23 19.4 23 15C23 10.6 19.4 7 15 7ZM20.9 14H19C18.9 12.5 18.6 11.1 18.2 9.9C19.6 10.8 20.6 12.3 20.9 14ZM15 21C14.4 21 13.2 19.1 13 16H17C16.8 19.1 15.6 21 15 21ZM13 14C13.2 10.9 14.3 9 15 9C15.7 9 16.8 10.9 17 14H13ZM11.9 9.9C11.4 11.1 11.1 12.5 11 14H9.1C9.4 12.3 10.4 10.8 11.9 9.9ZM9.1 16H11C11.1 17.5 11.4 18.9 11.8 20.1C10.4 19.2 9.4 17.7 9.1 16ZM18.1 20.1C18.6 18.9 18.8 17.5 18.9 16H20.8C20.6 17.7 19.6 19.2 18.1 20.1Z" fill="white"/>
              </svg>
            </a>}

            {telegram && <a href={telegram || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_7022_17128)">
                  <path d="M22.9683 8.68422C22.9557 8.62517 22.9276 8.57057 22.8868 8.52608C22.846 8.48158 22.794 8.44883 22.7363 8.43122C22.526 8.3893 22.3084 8.40484 22.1063 8.47622C22.1063 8.47622 8.08725 13.5142 7.28625 14.0722C7.11425 14.1932 7.05625 14.2622 7.02725 14.3442C6.88925 14.7442 7.32025 14.9172 7.32025 14.9172L10.9333 16.0942C10.9943 16.1052 11.057 16.1015 11.1163 16.0832C11.9383 15.5642 19.3863 10.8612 19.8163 10.7032C19.8843 10.6832 19.9343 10.7032 19.9163 10.7522C19.7443 11.3522 13.3103 17.0712 13.2753 17.1062C13.2582 17.1205 13.2448 17.1387 13.2363 17.1592C13.2277 17.1798 13.2243 17.2021 13.2263 17.2242L12.8893 20.7522C12.8893 20.7522 12.7473 21.8522 13.8453 20.7522C14.6243 19.9732 15.3723 19.3272 15.7453 19.0142C16.9873 19.8722 18.3243 20.8202 18.9013 21.3142C18.9979 21.4083 19.1125 21.4819 19.2383 21.5305C19.3641 21.5792 19.4985 21.6018 19.6333 21.5972C19.7992 21.5767 19.955 21.5062 20.0801 21.3952C20.2051 21.2841 20.2934 21.1376 20.3333 20.9752C20.3333 20.9752 22.8943 10.7002 22.9793 9.31722C22.9873 9.18222 23.0003 9.10022 23.0003 9.00022C23.0039 8.89392 22.9931 8.78762 22.9683 8.68422Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_7022_17128">
                    <rect width="16" height="16" fill="white" transform="translate(7 7)"/>
                  </clipPath>
                </defs>
              </svg>
            </a>}

            {facebook && <a href={facebook || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.0229 23L13 16H10V13H13V11C13 8.3008 14.6715 7 17.0794 7C18.2328 7 19.2241 7.08587 19.5129 7.12425V9.94507L17.843 9.94583C16.5334 9.94583 16.2799 10.5681 16.2799 11.4812V13H20L19 16H16.2799V23H13.0229Z" fill="white"/>
              </svg>
            </a>}

            {twitch && <a href={twitch || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.43291 7L7.35791 9.746V21H10.9999V23H13.3279L15.3579 21H18.4579L22.6369 16.791V7H8.43291ZM21.2089 16.075L18.8209 18.463H14.9999L12.9999 20.493V18.463H9.74591V8.433H21.2089V16.075Z" fill="white"/>
                <path d="M18.8209 11.1797H17.3879V15.3547H18.8209V11.1797Z" fill="white"/>
                <path d="M14.9999 11.1797H13.5669V15.3547H14.9999V11.1797Z" fill="white"/>
              </svg>
            </a>}

            {reddit && <a href={reddit || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 14.9008C23 13.8008 22.1 13.0008 21.1 13.0008C20.6 13.0008 20.2 13.2008 19.9 13.4008C18.7 12.7008 17.2 12.2008 15.6 12.1008L16.4 9.50078L18.7 10.0008C18.8 10.8008 19.5 11.5008 20.3 11.5008C21.2 11.5008 21.9 10.8008 21.9 9.90078C21.9 9.00078 21.2 8.30078 20.3 8.30078C19.7 8.30078 19.1 8.70078 18.9 9.20078L16.2 8.50078C16 8.50078 15.8 8.60078 15.7 8.80078L14.7 12.1008C13 12.1008 11.4 12.6008 10.1 13.3008C9.8 13.1008 9.4 12.9008 8.9 12.9008C7.9 12.9008 7 13.8008 7 14.9008C7 15.6008 7.3 16.1008 7.8 16.5008C7.8 16.7008 7.8 16.8008 7.8 17.0008C7.8 18.3008 8.6 19.6008 10 20.5008C11.3 21.4008 13.1 21.9008 15 21.9008C16.9 21.9008 18.7 21.4008 20 20.5008C21.4 19.6008 22.2 18.4008 22.2 17.0008C22.2 16.9008 22.2 16.7008 22.2 16.6008C22.6 16.1008 23 15.5008 23 14.9008ZM11.5 16.0008C11.5 15.4008 12 14.9008 12.6 14.9008C13.2 14.9008 13.7 15.4008 13.7 16.0008C13.7 16.6008 13.2 17.1008 12.6 17.1008C12 17.1008 11.5 16.6008 11.5 16.0008ZM17.6 19.2008C17 19.8008 16.2 20.0008 15 20.0008C13.8 20.0008 12.9 19.7008 12.4 19.2008C12.2 19.0008 12.2 18.8008 12.4 18.6008C12.6 18.4008 12.8 18.4008 13 18.6008C13.4 19.0008 14 19.2008 15 19.2008C16 19.2008 16.6 19.0008 17 18.6008C17.2 18.4008 17.4 18.4008 17.6 18.6008C17.8 18.8008 17.8 19.1008 17.6 19.2008ZM17.4 17.1008C16.8 17.1008 16.3 16.6008 16.3 16.0008C16.3 15.4008 16.8 14.9008 17.4 14.9008C18 14.9008 18.5 15.4008 18.5 16.0008C18.5 16.6008 18 17.1008 17.4 17.1008Z" fill="white"/>
              </svg>
            </a>}

            {medium && <a href={medium || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7H8C7.73478 7 7.48043 7.10536 7.29289 7.29289C7.10536 7.48043 7 7.73478 7 8V22C7 22.2652 7.10536 22.5196 7.29289 22.7071C7.48043 22.8946 7.73478 23 8 23H22C22.2652 23 22.5196 22.8946 22.7071 22.7071C22.8946 22.5196 23 22.2652 23 22V8C23 7.73478 22.8946 7.48043 22.7071 7.29289C22.5196 7.10536 22.2652 7 22 7V7ZM20.292 10.791L19.434 11.614C19.3968 11.6411 19.3679 11.678 19.3502 11.7205C19.3326 11.763 19.327 11.8095 19.334 11.855V17.9C19.327 17.9455 19.3326 17.992 19.3502 18.0345C19.3679 18.077 19.3968 18.1139 19.434 18.141L20.272 18.964V19.145H16.057V18.964L16.925 18.121C17.01 18.036 17.01 18.011 17.01 17.88V12.993L14.6 19.124H14.271L11.461 12.994V17.1C11.4494 17.1854 11.4575 17.2722 11.4845 17.354C11.5115 17.4358 11.5569 17.5103 11.617 17.572L12.746 18.942V19.123H9.546V18.942L10.675 17.572C10.7347 17.5103 10.779 17.4354 10.8043 17.3534C10.8297 17.2714 10.8354 17.1846 10.821 17.1V12.351C10.8273 12.2858 10.818 12.22 10.7941 12.159C10.7701 12.098 10.732 12.0435 10.683 12L9.683 10.791V10.61H12.8L15.2 15.893L17.322 10.61H20.293L20.292 10.791Z" fill="white"/>
              </svg>
            </a>}

            {discordServer && <a href={discordServer || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5521 13.7121C13.3292 13.7305 13.1213 13.832 12.9698 13.9965C12.8182 14.161 12.7341 14.3765 12.7341 14.6001C12.7341 14.8238 12.8182 15.0393 12.9698 15.2038C13.1213 15.3683 13.3292 15.4698 13.5521 15.4881C13.664 15.4835 13.7739 15.4569 13.8755 15.4097C13.9771 15.3626 14.0684 15.2958 14.1442 15.2134C14.22 15.1309 14.2788 15.0343 14.3172 14.929C14.3556 14.8238 14.3729 14.7121 14.3681 14.6001C14.3736 14.4881 14.3568 14.376 14.3186 14.2705C14.2804 14.165 14.2217 14.0681 14.1458 13.9855C14.0698 13.9029 13.9783 13.8362 13.8764 13.7893C13.7744 13.7423 13.6642 13.7161 13.5521 13.7121ZM16.4721 13.7121C16.2933 13.697 16.1141 13.7363 15.958 13.8247C15.8019 13.9131 15.6761 14.0466 15.5971 14.2077C15.5181 14.3687 15.4896 14.5499 15.5152 14.7275C15.5409 14.9051 15.6196 15.0708 15.741 15.2029C15.8624 15.335 16.0209 15.4273 16.1956 15.4679C16.3704 15.5085 16.5533 15.4953 16.7205 15.4302C16.8877 15.3651 17.0313 15.251 17.1326 15.1029C17.2338 14.9548 17.288 14.7796 17.2881 14.6001C17.2929 14.4882 17.2756 14.3765 17.2372 14.2713C17.1988 14.166 17.14 14.0694 17.0642 13.9869C16.9884 13.9045 16.8971 13.8377 16.7955 13.7906C16.6939 13.7434 16.584 13.7168 16.4721 13.7121Z" fill="white"/>
                <path d="M20.36 7H9.64C9.42411 7.00052 9.21044 7.04357 9.01118 7.12667C8.81192 7.20978 8.63098 7.33131 8.47869 7.48434C8.3264 7.63737 8.20575 7.8189 8.12361 8.01856C8.04148 8.21822 7.99948 8.43211 8 8.648V19.464C7.99948 19.6799 8.04148 19.8938 8.12361 20.0934C8.20575 20.2931 8.3264 20.4746 8.47869 20.6277C8.63098 20.7807 8.81192 20.9022 9.01118 20.9853C9.21044 21.0684 9.42411 21.1115 9.64 21.112H18.712L18.288 19.632L19.312 20.584L20.28 21.484L22 23V8.648C22.0005 8.43211 21.9585 8.21822 21.8764 8.01856C21.7943 7.8189 21.6736 7.63737 21.5213 7.48434C21.369 7.33131 21.1881 7.20978 20.9888 7.12667C20.7896 7.04357 20.5759 7.00052 20.36 7V7ZM17.272 17.448C17.272 17.448 16.984 17.1 16.744 16.8C17.3239 16.6635 17.8368 16.3263 18.192 15.848C17.9041 16.0396 17.5955 16.1979 17.272 16.32C16.8998 16.4789 16.5106 16.5943 16.112 16.664C15.4269 16.7902 14.7242 16.7875 14.04 16.656C13.6383 16.5774 13.2447 16.4623 12.864 16.312C12.5436 16.1886 12.2378 16.0303 11.952 15.84C12.2944 16.3082 12.7896 16.6422 13.352 16.784C13.112 17.084 12.816 17.448 12.816 17.448C12.3408 17.4608 11.8697 17.3566 11.4442 17.1446C11.0187 16.9325 10.6519 16.6192 10.376 16.232C10.402 14.6102 10.7959 13.0154 11.528 11.568C12.1723 11.062 12.9578 10.7685 13.776 10.728L13.856 10.828C13.0876 11.0192 12.3707 11.3769 11.756 11.876C11.756 11.876 11.932 11.776 12.228 11.644C12.8033 11.3829 13.4161 11.2142 14.044 11.144C14.0888 11.1347 14.1343 11.1294 14.18 11.128C14.7143 11.0545 15.2555 11.0451 15.792 11.1C16.6371 11.1965 17.4551 11.4574 18.2 11.868C17.6151 11.3936 16.9361 11.0486 16.208 10.856L16.32 10.728C17.1382 10.7685 17.9237 11.062 18.568 11.568C19.3001 13.0154 19.694 14.6102 19.72 16.232C19.4419 16.6188 19.0735 16.9317 18.6468 17.1437C18.2202 17.3556 17.7482 17.4601 17.272 17.448Z" fill="white"/>
              </svg>
            </a>}

            {twitter && <a href={twitter || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 10C22.4 10.3 21.8 10.4 21.1 10.5C21.8 10.1 22.3 9.5 22.5 8.7C21.9 9.1 21.2 9.3 20.4 9.5C19.8 8.9 18.9 8.5 18 8.5C16.3 8.5 14.8 10 14.8 11.8C14.8 12.1 14.8 12.3 14.9 12.5C12.2 12.4 9.7 11.1 8.1 9.1C7.8 9.6 7.7 10.1 7.7 10.8C7.7 11.9 8.3 12.9 9.2 13.5C8.7 13.5 8.2 13.3 7.7 13.1C7.7 14.7 8.8 16 10.3 16.3C10 16.4 9.7 16.4 9.4 16.4C9.2 16.4 9 16.4 8.8 16.3C9.2 17.6 10.4 18.6 11.9 18.6C10.8 19.5 9.4 20 7.8 20C7.5 20 7.3 20 7 20C8.5 20.9 10.2 21.5 12 21.5C18 21.5 21.3 16.5 21.3 12.2C21.3 12.1 21.3 11.9 21.3 11.8C22 11.3 22.6 10.7 23 10Z" fill="white"/>
              </svg>
            </a>}

            {youtube && <a href={youtube || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.8 11.8C22.6 10.5 22 9.6 20.6 9.4C18.4 9 15 9 15 9C15 9 11.6 9 9.4 9.4C8 9.6 7.3 10.5 7.2 11.8C7 13.1 7 15 7 15C7 15 7 16.9 7.2 18.2C7.4 19.5 8 20.4 9.4 20.6C11.6 21 15 21 15 21C15 21 18.4 21 20.6 20.6C22 20.3 22.6 19.5 22.8 18.2C23 16.9 23 15 23 15C23 15 23 13.1 22.8 11.8ZM13 18V12L18 15L13 18Z" fill="white"/>
              </svg>
            </a>}

            {tiktok && <a href={tiktok || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.793 12.958V15.706C13.4469 15.6147 13.0847 15.6023 12.7332 15.6696C12.3816 15.7369 12.0497 15.8822 11.7618 16.0949C11.4739 16.3076 11.2374 16.5821 11.0697 16.8983C10.902 17.2146 10.8075 17.5644 10.793 17.922C10.7726 18.2303 10.8186 18.5395 10.9277 18.8285C11.0369 19.1176 11.2067 19.38 11.4258 19.5979C11.6448 19.8158 11.9081 19.9843 12.1977 20.092C12.4874 20.1996 12.7967 20.244 13.105 20.222C13.4158 20.2456 13.728 20.2015 14.0201 20.0928C14.3122 19.984 14.5773 19.8132 14.797 19.5921C15.0167 19.371 15.1858 19.1048 15.2927 18.812C15.3995 18.5192 15.4416 18.2067 15.416 17.896V7H18.135C18.598 9.876 20.035 10.544 21.962 10.852V13.608C20.6273 13.4989 19.3397 13.0642 18.212 12.342V17.787C18.21 20.25 16.75 23 13.125 23C12.445 22.9969 11.7725 22.8581 11.1469 22.5918C10.5213 22.3255 9.9551 21.937 9.48152 21.4491C9.00795 20.9612 8.63652 20.3836 8.38898 19.7503C8.14145 19.1171 8.02279 18.4407 8.03996 17.761C8.06134 17.0531 8.23254 16.3579 8.54228 15.721C8.85202 15.0842 9.29324 14.5202 9.83687 14.0664C10.3805 13.6125 11.0142 13.2791 11.6961 13.088C12.378 12.897 13.0927 12.8527 13.793 12.958Z" fill="white"/>
              </svg>
            </a>}

            {instagram && <a href={instagram || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 8.441C17.136 8.441 17.389 8.45 18.233 8.488C18.7402 8.49409 19.2425 8.58746 19.718 8.764C20.0658 8.89248 20.3802 9.09754 20.638 9.364C20.9045 9.62179 21.1095 9.93622 21.238 10.284C21.4145 10.7595 21.5079 11.2618 21.514 11.769C21.552 12.613 21.561 12.869 21.561 15.002C21.561 17.135 21.552 17.391 21.514 18.235C21.5079 18.7422 21.4145 19.2445 21.238 19.72C21.1052 20.0651 20.9015 20.3785 20.64 20.64C20.3785 20.9015 20.0651 21.1052 19.72 21.238C19.2445 21.4145 18.7422 21.5079 18.235 21.514C17.391 21.552 17.135 21.561 15.002 21.561C12.869 21.561 12.613 21.552 11.769 21.514C11.2618 21.5079 10.7595 21.4145 10.284 21.238C9.93622 21.1095 9.62179 20.9045 9.364 20.638C9.09754 20.3802 8.89248 20.0658 8.764 19.718C8.58746 19.2425 8.49409 18.7402 8.488 18.233C8.45 17.389 8.441 17.133 8.441 15C8.441 12.867 8.45 12.611 8.488 11.767C8.49409 11.2598 8.58746 10.7575 8.764 10.282C8.89248 9.93422 9.09754 9.61979 9.364 9.362C9.62179 9.09554 9.93622 8.89048 10.284 8.762C10.7595 8.58546 11.2618 8.49209 11.769 8.486C12.613 8.448 12.869 8.439 15.002 8.439L15 8.441ZM15 7C12.827 7 12.555 7.009 11.7 7.048C11.037 7.06148 10.381 7.18727 9.76 7.42C9.22596 7.62056 8.74231 7.9356 8.343 8.343C7.9356 8.74231 7.62056 9.22596 7.42 9.76C7.18727 10.381 7.06148 11.037 7.048 11.7C7.009 12.555 7 12.827 7 15C7 17.173 7.009 17.445 7.048 18.3C7.06148 18.963 7.18727 19.619 7.42 20.24C7.62056 20.774 7.9356 21.2577 8.343 21.657C8.74231 22.0644 9.22596 22.3794 9.76 22.58C10.3816 22.813 11.0383 22.9387 11.702 22.952C12.555 22.991 12.827 23 15 23C17.173 23 17.445 22.991 18.3 22.952C18.9637 22.9387 19.6204 22.813 20.242 22.58C20.7734 22.3743 21.256 22.0599 21.659 21.657C22.0619 21.254 22.3763 20.7714 22.582 20.24C22.815 19.6184 22.9407 18.9617 22.954 18.298C22.993 17.445 23.002 17.173 23.002 14.998C23.002 12.823 22.993 12.553 22.954 11.698C22.9397 11.0355 22.8132 10.3802 22.58 9.76C22.3794 9.22596 22.0644 8.74231 21.657 8.343C21.2577 7.9356 20.774 7.62056 20.24 7.42C19.619 7.18727 18.963 7.06148 18.3 7.048C17.445 7.009 17.173 7 15 7Z" fill="white"/>
                <path d="M15.0001 10.8926C14.1876 10.8926 13.3934 11.1335 12.7178 11.5849C12.0423 12.0363 11.5157 12.6779 11.2048 13.4285C10.8939 14.1792 10.8125 15.0051 10.971 15.802C11.1295 16.5989 11.5208 17.3309 12.0953 17.9054C12.6698 18.4799 13.4018 18.8711 14.1987 19.0296C14.9955 19.1882 15.8215 19.1068 16.5722 18.7959C17.3228 18.4849 17.9644 17.9584 18.4158 17.2829C18.8672 16.6073 19.1081 15.8131 19.1081 15.0006C19.1081 14.4611 19.0018 13.9269 18.7954 13.4285C18.5889 12.9301 18.2863 12.4772 17.9049 12.0958C17.5234 11.7143 17.0706 11.4117 16.5722 11.2053C16.0737 10.9988 15.5396 10.8926 15.0001 10.8926ZM15.0001 17.6676C14.4726 17.6676 13.957 17.5112 13.5184 17.2181C13.0798 16.9251 12.738 16.5085 12.5361 16.0212C12.3342 15.5339 12.2814 14.9976 12.3843 14.4803C12.4872 13.9629 12.7413 13.4877 13.1142 13.1147C13.4872 12.7417 13.9624 12.4877 14.4798 12.3848C14.9971 12.2819 15.5334 12.3347 16.0207 12.5366C16.508 12.7385 16.9246 13.0803 17.2176 13.5189C17.5107 13.9575 17.6671 14.4731 17.6671 15.0006C17.6671 15.7079 17.3861 16.3863 16.8859 16.8864C16.3858 17.3866 15.7074 17.6676 15.0001 17.6676Z" fill="white"/>
                <path d="M19.2701 11.6895C19.8003 11.6895 20.2301 11.2597 20.2301 10.7295C20.2301 10.1993 19.8003 9.76953 19.2701 9.76953C18.7399 9.76953 18.3101 10.1993 18.3101 10.7295C18.3101 11.2597 18.7399 11.6895 19.2701 11.6895Z" fill="white"/>
              </svg>
            </a>}

            {telegramANN && <a href={telegramANN || ''} className="hover:text-gamefiGreen" target="_blank" rel="noopenner noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_7022_17128)">
                  <path d="M22.9683 8.68422C22.9557 8.62517 22.9276 8.57057 22.8868 8.52608C22.846 8.48158 22.794 8.44883 22.7363 8.43122C22.526 8.3893 22.3084 8.40484 22.1063 8.47622C22.1063 8.47622 8.08725 13.5142 7.28625 14.0722C7.11425 14.1932 7.05625 14.2622 7.02725 14.3442C6.88925 14.7442 7.32025 14.9172 7.32025 14.9172L10.9333 16.0942C10.9943 16.1052 11.057 16.1015 11.1163 16.0832C11.9383 15.5642 19.3863 10.8612 19.8163 10.7032C19.8843 10.6832 19.9343 10.7032 19.9163 10.7522C19.7443 11.3522 13.3103 17.0712 13.2753 17.1062C13.2582 17.1205 13.2448 17.1387 13.2363 17.1592C13.2277 17.1798 13.2243 17.2021 13.2263 17.2242L12.8893 20.7522C12.8893 20.7522 12.7473 21.8522 13.8453 20.7522C14.6243 19.9732 15.3723 19.3272 15.7453 19.0142C16.9873 19.8722 18.3243 20.8202 18.9013 21.3142C18.9979 21.4083 19.1125 21.4819 19.2383 21.5305C19.3641 21.5792 19.4985 21.6018 19.6333 21.5972C19.7992 21.5767 19.955 21.5062 20.0801 21.3952C20.2051 21.2841 20.2934 21.1376 20.3333 20.9752C20.3333 20.9752 22.8943 10.7002 22.9793 9.31722C22.9873 9.18222 23.0003 9.10022 23.0003 9.00022C23.0039 8.89392 22.9931 8.78762 22.9683 8.68422Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_7022_17128">
                    <rect width="16" height="16" fill="white" transform="translate(7 7)"/>
                  </clipPath>
                </defs>
              </svg>
            </a>}
          </div>
        </div>
      </div>}
      <div className="flex items-center justify-between mb-3 gap-4">
        <span className="text-sm text-gray-300">Developer</span>
        <span className="font-medium text-base truncate max-w-xs ">{data?.developer}</span>
      </div>
      <div className="flex items-center justify-between mb-3 gap-4">
        <span className="text-sm text-gray-300">Rating</span>
        <div className='flex items-center'>
          <Link href={`/hub/${slug}/reviews`}>
            <a className='hover:cursor-pointer inline-block'>
              <Image src={require('@/assets/images/icons/star-rating.svg')} alt="" />
            </a>
          </Link>
          <span className="font-medium text-base truncate max-w-xs ml-2">{data?.rating !== '-' ? data?.rating?.toFixed(1) : data?.rating}</span>
        </div>
      </div>
      {isEmpty(data?.network) || <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-300">Network</span>
        <div className='flex'>
          {data?.network?.map((e, i) => {
            const icon = get(e, 'image', '/')

            return (
              <div key={i}>
                <Image width={21} height={21} className="inline-block h-5 w-5 rounded-full ring-2 ring-gamefiDark-900" src={icon} alt=""></Image>
              </div>
            )
          }
          )}
        </div>
      </div>}
      <MoreInfoGame data={data} dataBase={dataBase} />
      <div className="mb-8 line-clamp-1">
        {data?.categories?.map((x, i) => (
          <Link key={i} href={`/hub/list?category=${x?.attributes?.slug}`} passHref>
            <a className="mr-2 mb-2 text-xs px-2 py-1.5 bg-gamefiDark-630/50 hover:bg-gamefiDark-630 rounded inline-block" onClick={() => {
              gtagEvent('hub_category', {
                game_name: dataBase?.slug,
                category: x?.attributes?.slug
              })
            }}>
              {x?.attributes?.name}
            </a>
          </Link>)
        )}
      </div>
    </div>
  )
}

export default GameRight
