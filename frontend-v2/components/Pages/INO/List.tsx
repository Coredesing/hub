import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState, useEffect } from 'react'
import { Item } from './types'
import styles from './List.module.scss'
import { paginator, useAxiosFetch } from './utils'

export const TOKEN_TYPE = 'box'

export const visibility = (item: Item) => {
  if (item.process === 'only-auction') {
    return 'Auction'
  }

  if (item.is_private === 1) {
    return 'Private'
  }

  if (item.is_private === 2) {
    return 'Seed'
  }

  if (item.is_private === 3) {
    return 'Community'
  }

  return 'Public'
}

export const networkImage = (network: string) => {
  switch (network) {
    case 'bsc': {
      return require('assets/images/networks/bsc.svg')
    }

    case 'eth': {
      return require('assets/images/networks/eth.svg')
    }

    case 'polygon': {
      return require('assets/images/networks/polygon.svg')
    }
  }
}

export const currency = (item: Item) => {
  if (item.accept_currency === 'eth') {
    return currencyNative(item.network_available)
  }

  if (item.accept_currency === 'usdt') {
    return currencyStable(item.network_available)
  }

  return ''
}

export const currencyNative = (network: string) => {
  switch (network) {
    case 'bsc': {
      return 'BNB'
    }

    case 'eth': {
      return 'ETH'
    }

    case 'polygon': {
      return 'MATIC'
    }
  }
}

export const currencyStable = (network: string) => {
  switch (network) {
    case 'bsc': {
      return 'BUSD'
    }

    case 'eth': {
      return 'USDT'
    }

    case 'polygon': {
      return 'USDT'
    }
  }
}

const List = () => {
  const [network, setNetwork] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [pageLast, setPageLast] = useState<number>(1)
  useEffect(() => {
    if (network || title) {
      setPage(1)
    }
  }, [network, title])

  const pages = useMemo(() => {
    return paginator({ current: page, last: pageLast })
  }, [page, pageLast])

  const url = useMemo(() => {
    return `/pools/mysterious-box?token_type=${TOKEN_TYPE}&campaign_status=Ended&network_available=${network}&title=${title}&is_display=1&page=${page}&limit=6&is_search=1`
  }, [network, title, page])

  const { data, loading } = useAxiosFetch(url)
  useEffect(() => {
    setPageLast(data?.data?.lastPage)
  }, [data])

  const items = useMemo<Item[]>(() => {
    return data?.data?.data || []
  }, [data])

  return (
    <div className={styles.container} style={{ marginBottom: '2rem' }}>
      <div className={styles.header}>
        <div className={styles.heading}>Previous Projects</div>
        <div className={styles.filters}>
          <div className={styles.filter}>
            <select value={network} onChange={ e => { setNetwork(e.target.value) } }>
              <option value="bsc">BSC</option>
              <option value="eth">ETH</option>
              <option value="polygon">POLYGON</option>
              <option value="">All Networks</option>
            </select>
            <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.625 1.375L7 7L1.375 1.375" stroke="white" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.filter}>
            <input placeholder="Search" value={title} onChange={e => { setTitle(e.target.value) }} />
            <svg viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.filterIconLeft}>
              <path d="M12.6092 12.1123L9.64744 9.03184C10.409 8.12657 10.8262 6.98755 10.8262 5.80178C10.8262 3.03135 8.57221 0.777344 5.80178 0.777344C3.03135 0.777344 0.777344 3.03135 0.777344 5.80178C0.777344 8.57222 3.03135 10.8262 5.80178 10.8262C6.84184 10.8262 7.83297 10.5125 8.68035 9.91702L11.6646 13.0208C11.7894 13.1504 11.9572 13.2218 12.1369 13.2218C12.3071 13.2218 12.4686 13.1569 12.5911 13.0389C12.8515 12.7884 12.8598 12.3729 12.6092 12.1123ZM5.80178 2.08807C7.84957 2.08807 9.5155 3.754 9.5155 5.80178C9.5155 7.84957 7.84957 9.5155 5.80178 9.5155C3.754 9.5155 2.08807 7.84957 2.08807 5.80178C2.08807 3.754 3.754 2.08807 5.80178 2.08807Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
      { loading && (
        <div className={styles.loaderWrapper}>
          <svg className={styles.loader} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) }
      { !loading && items.map(item => {
        return (
          <div className={styles.row} key={item.id}>
            <Link href={`/ino/${item.id}`} passHref={true}>
              <a className={styles.link}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.mini_banner} alt={item.title} />
                <div className={styles.title}>
                  <h4>{item.title}</h4>
                  <p>{visibility(item)}</p>
                </div>
              </a>
            </Link>
            <div className={styles.info}>
              <span>Network</span>
              <div className="inline-flex items-center"><div className="w-6 h-6 mr-2 relative inline-block"><Image src={networkImage(item.network_available)} alt={item.network_available} layout="fill" objectFit="cover" /></div> {item.network_available}</div>
            </div>
            <div className={styles.info}>
              <span>Total Raise</span>
              <p>{item.total_sold_coin}</p>
            </div>
            <div className={styles.info}>
              <span>Price</span>
              <p style={{ color: '#72F34B' }}>{item.ether_conversion_rate} {currency(item)}/BOX</p>
            </div>
          </div>
        )
      }) }

      <div className={styles.pagination} style={{ marginTop: '2rem' }}>
        <span onClick={() => { setPage(1) }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25 1.25L2 5L5.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.25 1.25L5 5L8.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span onClick={() => { page > 1 && setPage(page - 1) }}>
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.75 0.25L1 4L4.75 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        { pages && (
          <>
          <span className={pages.current === pages.first ? styles.paginationActive : ''} onClick={() => { setPage(pages.first) }}>{pages.first}</span>
          { pages.leftCluster && <span>...</span> }
          { pages.pages.map(page => <span key={page} className={pages.current === page ? styles.paginationActive : ''} onClick={() => { setPage(page) }}>{page}</span>) }
          { pages.rightCluster && <span>...</span> }
          { pages.last > pages.first && <span className={pages.current === pages.last ? styles.paginationActive : ''} onClick={() => { setPage(pageLast) }}>{pages.last}</span> }
          </>
        )}
        <span onClick={() => { page < pageLast && setPage(page + 1) }}>
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.25 0.25L5 4L1.25 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span onClick={() => { setPage(pageLast) }}>
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.75 8.75L7 5L3.75 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M0.75 8.75L4 5L0.750001 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  )
}

export default List
