import Link from 'next/link'
import styles from './styles.module.scss'

type Props = {
  item: any;
  detailLink?: string;
}

const CardSlim = ({ item, detailLink }: Props) => {
  return (
    <div className={`${styles.card} ${styles.slim}`}>
      {/* <div className={styles.visibility}>
        { visibility(item) === 'Auction' &&
        <svg className={styles.visibilityIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 15H15" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.86621 9.86667L13.1329 13.1333L14.9995 11.2667L11.7329 8" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.334 0.999939L2.86719 8.4668L5.66742 11.267L13.1343 3.80018L10.334 0.999939Z" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 12.2002H2.86667" stroke="#F3BA2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        }
        {visibility(item)}
      </div> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image || item.icon} alt={item?.title} className={styles.banner}/>
      <div className={styles.information}>
        <div className="mb-2">
          <Link href="#" passHref>
            <a className="flex align-middle items-center">
              <span className="w-6 h-6 relative mr-2">
                {/* <Image src={networkImage('bsc')} alt={item?.network_available} /> */}
                <img src={item.project?.logo} alt="" />
              </span>
              <span className="font-semibold opacity-50 uppercase">{item.project?.name}</span>
            </a>
          </Link>
        </div>
        <div>
          <Link href={detailLink || `/market/${item.project?.slug}/${item.id}`} passHref>
            <a className={styles.title}>
              #{item.id}
            </a>
          </Link>
        </div>
        <div className={styles.informationPurchase} style={{ marginBottom: '1rem' }}>
          <div>
            <p>Listing Price</p>
            <span style={{ color: '#72F34B' }}>
              {item.price || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardSlim
