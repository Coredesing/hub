import { useMemo } from 'react'
import { Item } from '../../../types/Pagination'
import { networkImage, currency, visibility } from './List'
import styles from './Card.module.scss'
import stylesCarousel from './Carousel.module.scss'
import { intervalToDuration } from 'date-fns'

type Props = {
  item: Item,
  now: Date
}

const CardSlim = ({ item, now }: Props) => {
  const stages = useMemo(() => {
    const timeBuy = new Date(parseInt(item.start_time) * 1000)
    const timeFinish = new Date(parseInt(item.finish_time) * 1000)

    return { timeBuy, timeFinish }
  }, [item, now])

  const duration = useMemo(() => {
    const { timeBuy, timeFinish } = stages

    if (now < timeBuy) {
      return intervalToDuration({
        start: now,
        end: timeBuy
      })
    }

    return intervalToDuration({
      start: now,
      end: timeFinish
    })
  }, [item, now])

  const text = useMemo(() => {
    const { timeBuy, timeFinish } = stages

    if (now < timeBuy) {
      return 'Starts in'
    }

    return 'Ends in'
  }, [stages, now])

  return (
    <div className={`${styles.card} ${styles.slim}`}>
      <div className={styles.visibility}>{visibility(item)}</div>
      <img src={item.mini_banner} alt={item.title} className={styles.banner} />
      <div className={styles.information}>
        <h3 className={styles.title}>{item.title} <img src={networkImage(item.network_available)} alt={item.network_available} /></h3>
        <div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="white"/>
          </svg>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="white"/>
          </svg>
        </div>
        <div className={styles.description}>
          {item.description}
        </div>
        <div className={stylesCarousel.informationPurchase} style={{marginBottom: '1rem'}}>
          <div>
            <p>Starting Price</p>
            <span style={{color: '#72F34B'}}>{item.ether_conversion_rate} {currency(item)}</span>
          </div>
          <div>
            <p>Total Sale</p>
            {item.total_sold_coin} Boxes
          </div>
        </div>
        <div className={styles.informationStage}>
          { item.campaign_status == 'Ended' && <span style={{padding: '0.6rem 0'}}>Ended</span> }
          { item.campaign_status !== 'Ended' && (
            <>
              <div className={styles.informationLabel}>{text}</div>
              { item.campaign_status === 'TBA' ? 'TBA' : <span>{duration.days}d : {duration.hours}h : {duration.minutes}m : {duration.seconds}s</span> }
            </>
          ) }
        </div>
      </div>
    </div>
  )
}

export default CardSlim
