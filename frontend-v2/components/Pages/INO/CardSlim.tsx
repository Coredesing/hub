import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { Item } from './types'
import { networkImage, visibility } from './List'
import styles from './ListCard.module.scss'
import stylesCarousel from './Carousel.module.scss'
import { intervalToDuration } from 'date-fns'
import { formatNumber } from '@/utils'
import { useCurrency } from '@/components/web3/utils'

type Props = {
  item: Item;
  now: Date;
  isTicket?: boolean;
}

const CardSlim = ({ item, now, isTicket }: Props) => {
  const { currency } = useCurrency(item)
  const stages = useMemo(() => {
    const timeBuy = item.start_time && new Date(parseInt(item.start_time) * 1000)
    const timeFinish = item.finish_time && new Date(parseInt(item.finish_time) * 1000)
    return { timeBuy, timeFinish }
  }, [item])

  const countdown = useMemo(() => {
    const { timeBuy, timeFinish } = stages
    if (!timeBuy || !timeFinish) {
      return {
        text: 'TBA',
        duration: null
      }
    }
    if (now < timeBuy) {
      return {
        text: 'Starts in',
        duration: intervalToDuration({
          start: now,
          end: timeBuy
        })
      }
    }
    if (now < timeFinish) {
      return {
        text: 'Ends in',
        duration: intervalToDuration({
          start: now,
          end: timeFinish
        })
      }
    }
    return { text: 'Ended' }
  }, [stages, now])

  const poolType = useMemo(() => {
    return visibility(item)
  }, [item])

  const poolTypeIcon = useMemo(() => {
    if (poolType === 'Auction') {
      return <svg className={styles.visibilityIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 15H15" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.86621 9.86667L13.1329 13.1333L14.9995 11.2667L11.7329 8" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.334 0.999939L2.86719 8.4668L5.66742 11.267L13.1343 3.80018L10.334 0.999939Z" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 12.2002H2.86667" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
    if (poolType === 'Community') {
      return <svg className={styles.visibilityIcon} width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.0625 12.813H15.6875V9.99634C15.6875 9.80128 15.6223 9.61181 15.5023 9.45804C15.3823 9.30426 15.2143 9.19499 15.0251 9.14759L12.1875 8.43797L11.9661 6.88572C12.4234 6.67675 12.811 6.34089 13.0829 5.91805C13.3548 5.49521 13.4996 5.00319 13.5 4.50047V3.73572C13.512 3.11125 13.3071 2.50193 12.9202 2.01162C12.5333 1.52131 11.9883 1.18035 11.3781 1.04684C10.9177 0.959284 10.4423 0.994902 10 1.15009" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.55312 10.3189L7.125 9.625L6.90363 8.07275C7.32725 8.13986 7.7602 8.11804 8.17493 8.00868C8.58965 7.89931 8.97706 7.70479 9.3125 7.4375C8.66339 6.55444 8.35289 5.46769 8.4375 4.375C8.4375 3.67881 8.16094 3.01113 7.66866 2.51884C7.17637 2.02656 6.50869 1.75 5.8125 1.75C5.11631 1.75 4.44863 2.02656 3.95634 2.51884C3.46406 3.01113 3.1875 3.67881 3.1875 4.375C3.27211 5.46769 2.96161 6.55444 2.3125 7.4375C2.64794 7.70479 3.03535 7.89931 3.45007 8.00868C3.8648 8.11804 4.29775 8.13986 4.72137 8.07275L4.5 9.625L2.07188 10.3189C1.88917 10.3711 1.72844 10.4815 1.61399 10.6332C1.49953 10.7849 1.43758 10.9697 1.4375 11.1597V12.6875H10.1875V11.1597C10.1874 10.9697 10.1255 10.7849 10.011 10.6332C9.89656 10.4815 9.73583 10.3711 9.55312 10.3189V10.3189Z" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
    if (poolType === 'Private') {
      return <svg className={styles.visibilityIcon} width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.6875 6.66602V13.7771C12.6875 14.0129 12.5953 14.239 12.4312 14.4057C12.2671 14.5724 12.0446 14.666 11.8125 14.666H2.1875C1.95544 14.666 1.73288 14.5724 1.56878 14.4057C1.40469 14.239 1.3125 14.0129 1.3125 13.7771V7.5549C1.3125 7.31916 1.40469 7.09306 1.56878 6.92637C1.73288 6.75967 1.95544 6.66602 2.1875 6.66602H10" stroke="#6CDB00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.9375 4.44412C3.9375 3.619 4.26016 2.82768 4.83449 2.24423C5.40882 1.66078 6.18777 1.33301 7 1.33301C7.81223 1.33301 8.59118 1.66078 9.16551 2.24423C9.73984 2.82768 10.0625 3.619 10.0625 4.44412V6.66634" stroke="#6CDB00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11.9997C7.72487 11.9997 8.3125 11.4027 8.3125 10.6663C8.3125 9.92996 7.72487 9.33301 7 9.33301C6.27513 9.33301 5.6875 9.92996 5.6875 10.6663C5.6875 11.4027 6.27513 11.9997 7 11.9997Z" stroke="#6CDB00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
  }, [poolType])

  return (
    <div className={`${styles.card} ${styles.slim}`}>
      <div className={styles.visibility}>
        {poolTypeIcon}
        <span>{poolType}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Link href={`/${isTicket ? 'ticket' : 'ino'}/${item.slug || item.id}`} passHref>
        <img src={item.mini_banner} alt={item.title} className={`${styles.banner} hover:cursor-pointer`} />
      </Link>
      <div className={styles.information}>
        <Link href={`/${isTicket ? 'ticket' : 'ino'}/${item.slug || item.id}`} passHref={true}>
          <a className={styles.title}>
            {item.title} <span className="w-6 h-6 relative"><Image src={networkImage(item.network_available)} alt={item.network_available} /></span>
          </a>
        </Link>
        <div className={styles.socials}>
          {item.website && <a href={item.website} className={styles.social} target="_blank" rel="noopenner noreferrer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="white" />
            </svg>
          </a>}

          {item?.socialNetworkSetting?.telegram_link && <a href={item?.socialNetworkSetting?.telegram_link} className={styles.social} target="_blank" rel="noopenner noreferrer">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="white" />
            </svg>
          </a>}

          {item?.socialNetworkSetting?.twitter_link && <a href={item?.socialNetworkSetting?.twitter_link} className={styles.social} target="_blank" rel="noopenner noreferrer">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="white" />
            </svg>
          </a>}

          {item?.socialNetworkSetting?.medium_link && <a href={item?.socialNetworkSetting?.medium_link} className={styles.social} target="_blank" rel="noopenner noreferrer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="white" />
            </svg>
          </a>}
        </div>
        <div className={styles.description}>
          {item.description}
        </div>
        <div className={stylesCarousel.informationPurchase} style={{ marginBottom: '1rem' }}>
          <div>
            <p>Starting Price</p>
            <span style={{ color: '#72F34B' }}>{item.ether_conversion_rate} {currency.symbol}</span>
          </div>
          <div>
            <p>Total Sales</p>
            {item.total_sold_coin} Boxes
          </div>
        </div>
        <div className={styles.informationStage}>
          {countdown.text && <span style={{ padding: '0.6rem 0' }}>{countdown.text}</span>}
          {countdown.duration && <span>{formatNumber(countdown.duration.days)}d : {formatNumber(countdown.duration.hours)}h : {formatNumber(countdown.duration.minutes)}m : {formatNumber(countdown.duration.seconds)}s</span>}
          {/* {item.campaign_status === 'Ended' && <span style={{ padding: '0.6rem 0' }}>Ended</span>}
          {item.campaign_status !== 'Ended' && (
            <>
              <div className={styles.informationLabel}>{text}</div>
              {item.campaign_status === 'TBA' ? 'TBA' : !duration ? 'TBA' : <span>{formatNumber(duration.days)}d : {formatNumber(duration.hours)}h : {formatNumber(duration.minutes)}m : {formatNumber(duration.seconds)}s</span>}
            </>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default CardSlim
