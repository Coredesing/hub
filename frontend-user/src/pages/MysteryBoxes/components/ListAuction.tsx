import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Item } from '../../../types/Pagination'
import stylesList from './List.module.scss'
import styles from './ListAuction.module.scss'
import { TOKEN_TYPE } from '../../../constants'
import { paginator, useAxiosFetch } from '../utils'
import CardSlim from './CardSlim'

type Props = {
  now: Date
}

const List = ({ now }: Props) => {
  const url = `/pools/mysterious-box?token_type=${TOKEN_TYPE.Box}&process=only-auction&is_display=1&limit=6`

  const {data, loading} = useAxiosFetch(url)
  const items = useMemo<Item[]>(() => {
    return data?.data?.data || []
  }, [data])

  return (
    <div className={styles.auction}>
      <div className={stylesList.container}>
        <div className={styles.header}>
          <div className={styles.heading}>
            AUCTIONS
          </div>

          <svg viewBox="0 0 118 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M59 18L51.2058 4.5L66.7942 4.5L59 18Z" fill="currentColor"/>
            <path d="M0 5H40L42 7H0V5Z" fill="currentColor"/>
            <path d="M118 5H78L76 7H118V5Z" fill="currentColor"/>
          </svg>
        </div>
        <div className={styles.cards}>
          { items.map(item => {
            return (
              <CardSlim key={item.id} item={item} now={now} />
            )
          }) }
        </div>
      </div>
    </div>
  )
}

export default List
