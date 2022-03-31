import React from 'react'
import styles from './Activites.module.scss'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from 'components/Base/Table'
import { getCurrencyByTokenAddress, getTXLink } from '@/components/web3'
import { MARKET_ACTIVITIES } from '../constant'
import { utils } from 'ethers'
import { formatHumanReadableTime, formatNumber, shortenAddress } from '@/utils'
import Link from 'next/link'
import ImageLoader from '@/components/Base/ImageLoader'

const Activities = ({
  data = []
}: { data: any[] }) => {
  return (
    <>
      <Table >
        <TableHead>
          <TableRow>
            <TableCellHead className={styles.activityTableCellHead}>
              <span className="text-13px font-bold">Item</span>
            </TableCellHead>
            <TableCellHead className={styles.activityTableCellHead}>
              <span className="text-13px font-bold">Price</span>
            </TableCellHead>
            <TableCellHead className={styles.activityTableCellHead}>
              <span className="text-13px font-bold">Type</span>
            </TableCellHead>
            <TableCellHead className={styles.activityTableCellHead}>
              <span className="text-13px font-bold">From</span>
            </TableCellHead>
            <TableCellHead className={styles.activityTableCellHead}>
              <span className="text-13px font-bold">To</span>
            </TableCellHead>
            <TableCellHead className={styles.activityTableCellHead}>
              <span className="text-13px font-bold">Date</span>
            </TableCellHead>
          </TableRow>
        </TableHead>
        <TableBody className={styles.activityTableBody}>
          {
            (data).map((item, id) => <TableRow key={id}>
              <TableCell className={styles.activityTableCell}>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16'>
                    <ImageLoader size='small' src={item?.token_info?.image || item?.token_info?.icon} alt="" className='w-16 h-16 rounded object-cover' />
                  </div>
                  <div>
                    <Link passHref href={`/marketplace/${item.slug}/${item.token_id || item.id}`}>
                      <a className='block font-semibold text-base font-casual'>#{formatNumber(item.token_id || item.id, 3)}</a>
                    </Link>
                    <Link passHref href={`/marketplace/collection/${item.slug}`} >
                      <a className='block font-medium text-sm text-white/50 font-casual'>{item.collection_info?.name}</a>
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell className={styles.activityTableCell}>
                <span className='text-13px'>
                  {item.raw_amount ? utils.formatEther(item.raw_amount) : '-/-'} {item.currencySymbol || getCurrencyByTokenAddress(item?.currency, item?.network)?.symbol}
                </span>
              </TableCell>
              <TableCell className={styles.activityTableCell}>
                <span className='text-13px font-semibold'>
                  {MARKET_ACTIVITIES[item.event_type] || '-/-'}
                </span>
              </TableCell>
              <TableCell className={styles.activityTableCell}>
                <span className='text-13px'>
                  {
                    MARKET_ACTIVITIES[item.event_type] === MARKET_ACTIVITIES.TokenListed ||
                      MARKET_ACTIVITIES[item.event_type] === MARKET_ACTIVITIES.TokenDelisted ||
                      MARKET_ACTIVITIES[item.event_type] === MARKET_ACTIVITIES.TokenBought
                      ? shortenAddress(item.seller || '', '.', 5)
                      : shortenAddress(item.buyer || '', '.', 5)
                  }
                </span>
              </TableCell>
              <TableCell className={styles.activityTableCell}>
                <span className='text-13px'>
                  {
                    MARKET_ACTIVITIES[item.event_type] === MARKET_ACTIVITIES.TokenListed ||
                      MARKET_ACTIVITIES[item.event_type] === MARKET_ACTIVITIES.TokenDelisted ||
                      MARKET_ACTIVITIES[item.event_type] === MARKET_ACTIVITIES.TokenBought
                      ? shortenAddress(item.buyer || '', '.', 5)
                      : shortenAddress(item.seller || '', '.', 5)
                  }
                </span>
              </TableCell>
              <TableCell className={styles.activityTableCell}>
                <a href={getTXLink(item.network, item.transaction_hash)} target={'_blank'} rel='noreferrer' className='flex items-center gap-2 text-13px'>
                  {formatHumanReadableTime(+item.dispatch_at * 1000, Date.now())}
                  <span className='block w-3 h-3'>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 8.5V10C11.5 10.3978 11.342 10.7794 11.0607 11.0607C10.7794 11.342 10.3978 11.5 10 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5H3.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6.5 0.5H11.5V5.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11.5 0.5L5.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </TableCell>
            </TableRow>)
          }
        </TableBody>
      </Table>
    </>
  )
}

export default Activities
