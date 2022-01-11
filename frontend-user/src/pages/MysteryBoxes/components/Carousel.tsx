/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import { useMediaQuery } from 'react-responsive'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import styles from './Carousel.module.scss'
import stylesList from './List.module.scss'
import { Item } from '../../../types/Pagination'
import { networkImage, currency, currencyNative, currencyStable } from './List'

type Props = {
  items: Item[],
}

const CarouselAction = ({ item }: { item: Item }) => {
}

const _Carousel = ( { items }: Props ) => {
  const isMobile = useMediaQuery({ query: `(max-width: 1000px)` });

  if (!items) {
    items = []
  }

  return (
    <div className={stylesList.container} style={{marginTop: '2rem'}}>
      <div className={styles.heading}>
        <span>Featured</span> INOs
      </div>
      <Carousel
        showStatus={false}
        showIndicators={false}
        autoPlay={true}
        stopOnHover={true}
        showThumbs={true}
        thumbWidth={170}
        swipeable={true}
        infiniteLoop={true}
        interval={5000}

        renderThumbs={() => {
          const foo = items && items.length ? items : []
          return foo.map((item) => {
            return <img key={`thumb-${item.id}`} src={item.mini_banner} alt="img" className={styles.thumbnail} />
          })
        }}
        renderArrowPrev={(onClickHandler, hasPrev, label) => {
          return (
            <div
              onClick={onClickHandler}
              title={label}
              className={`${styles.control} ${styles.controlPrev}`}
            >
              <img src={'/images/icons-new/arrow-left.png'} alt="left"/>
            </div>
          )
        }
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          (
            <div
              onClick={onClickHandler}
              title={label}
              className={`${styles.control} ${styles.controlNext}`}
            >
              <img src={'/images/icons-new/arrow-right.png'} alt="right"/>
            </div>
          )
        }
      >
        {items.map(item => {
          return (
            <div key={`ino-${item.id}`} className={styles.item}>
              <img src={item.banner} className={styles.image} />
              <div className={styles.information}>
                <h3 className={styles.title}>{item.title} <img src={networkImage(item.network_available)} /></h3>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.informationPurchase}>
                  <div>
                    <p>Price</p>
                    <span style={{color: '#72F34B'}}>{item.ether_conversion_rate} {currency(item)}</span>
                  </div>
                  <div>
                    <p>Total Sale</p>
                    {item.total_sold_coin} Boxes
                  </div>
                </div>
                <div style={{marginTop: 'auto', position: 'relative'}}>
                  <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Pre-order starts in</p>
                  <svg viewBox="0 0 273 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.countdown} fontSize="28" fontWeight="bold">
                    <path opacity="0.12" d="M20.516 0.5H271.5V48.5V63.5H0.5V0.5H20.516Z" fill="#525252" stroke="#525252"/>
                    <path d="M20.3801 0.5H272.5V49.5V64.5H0.5V8.73149L10.2016 0.5H20.3801Z" stroke="#525252"/>
                    <rect x="263" y="4" width="6" height="21" fill="#525252"/>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}}><tspan x="55.1426" y="32.176">:</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}}><tspan x="121.143" y="32.176">:</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}}><tspan x="187.143" y="32.176">:</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}}><tspan x="12.8184" y="32.176">01</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontSize="10" fontWeight="600"><tspan x="14.209" y="50.92">DAYS</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}}><tspan x="79.4199" y="32.176">21</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontSize="10" fontWeight="600"><tspan x="77.1377" y="50.92">HOURS</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}}><tspan x="142.344" y="32.176">45</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontSize="10" fontWeight="600"><tspan x="139.153" y="50.92">MINUTES</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}}><tspan x="208.344" y="32.176">54</tspan></text>
                    <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontSize="10" fontWeight="600"><tspan x="203.972" y="50.92">SECONDS</tspan></text>
                  </svg>
                  <div className={styles.actionBtn}>
                    Join Now <img src="/images/icons-new/arrow-right-dark.svg" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </Carousel>
      </div>
  )
}

export default _Carousel
