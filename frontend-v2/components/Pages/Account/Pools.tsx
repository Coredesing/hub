import LoadingOverlay from '@/components/Base/LoadingOverlay'
import Pagination from '@/components/Base/Pagination'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'
import { useMyWeb3 } from '@/components/web3/context'
import { fetcher } from '@/utils'
import { API_BASE_URL, TOKEN_TYPE } from '@/utils/constants'
import { formatPoolStatus, formatPoolType } from '@/utils/pool'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import styles from './Pools.module.scss'
import { getCurrency } from '@/components/web3/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Pools = () => {
  const { account } = useMyWeb3()
  const router = useRouter()
  const [loadingPools, setLoadingPools] = useState(false);
  const [pools, setPools] = useState({ total: 0, data: [] })
  const [filter, setFilter] = useState({ page: 1, limit: 10, search: '', type: '', status: '' })

  useEffect(() => {
    if (!account) return
    const getPools = async () => {
      setLoadingPools(true)
      const res = await fetcher(`${API_BASE_URL}/pools/user/${account}/joined-pools?page=${filter.page || 1}&limit=${filter.limit}&title=${filter.search || ''}&type=${filter.type ?? ''}&status=${filter.status || ''}`)
      setPools({
        total: +res.data.lastPage || 0,
        data: res.data.data || []
      })
      // console.log('res', res)
    }
    getPools().catch(console.error).finally(() => setLoadingPools(false))
  }, [account, filter])

  useEffect(() => {
    if (!account) {
      setPools({ total: 0, data: [] })
    }
  }, [account])

  const allocationAmount = useCallback((pool: any) => {
    if (!pool) return null

    const currency = getCurrency({
      accept_currency: pool.accept_currency,
      network_available: pool.network_available
    })

    let amount = ''
    if (pool.token_type === TOKEN_TYPE.ERC721) {
      const isClaim = pool.process === 'only-claim'
      if (isClaim) {
        amount = pool.userClaimInfo?.user_claimed || 0
      } else {
        amount = pool.userClaimInfo?.user_purchased || 0
      }
      return `${amount} ${pool.symbol?.toUpperCase()}`
    }
    if (pool.token_type === TOKEN_TYPE.ERC20) {
      amount = pool.userClaimInfo?.user_purchased || 0
      const ethRate = pool.accept_currency === 'eth' ? pool.ether_conversion_rate : pool.token_conversion_rate
      return `${(+amount * +ethRate) || 0} ${currency?.symbol || ''}`
    }

    if (!pool.allowcation_amount) return '-'
    let allowcationAmount = pool.allowcation_amount || 0
    if (BigNumber.from(allowcationAmount).lte(0)) return '-'

    const allowcationAmountText = `${allowcationAmount} ${currency?.symbol || ''}`
    return allowcationAmountText
  }, [])

  const onChangePage = (page: number) => {
    setFilter(f => ({ ...f, page }))
  }

  const redirectPool = (pool: any) => {
    switch (pool.token_type) {
      case TOKEN_TYPE.ERC20: {
        window.open(`https://hub.gamefi.org/#/buy-token/${pool.id}`)
        return
      }

      default: {
        router.push(`/ino/${pool.id}`)
      }
    }
  }

  return (
    <div className='py-10 px-9'>
      <div className='flex items-center justify-between'>
        <h3 className='uppercase font-bold text-2xl mb-7'>IGO Pools</h3>
      </div>

      <div>
        <Table >
          <LoadingOverlay loading={loadingPools} />
          <TableHead>
            <TableRow>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Pool name</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Type</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Status</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Allocation</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Action</span>
              </TableCellHead>
            </TableRow>
          </TableHead>
          <TableBody className={styles.activityTableBody}>
            {
              pools.data.map((item, id) => <TableRow key={id}>
                <TableCell className={styles.activityTableCell}>
                  <div className='flex gap-2'>
                    <img src={item.banner} alt="" width={40} height={40} className='object-contain' />
                    <span>{item.title}</span>
                  </div>
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  {formatPoolType(item.is_private)}
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  {formatPoolStatus(item.campaign_status)}
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  {allocationAmount(item)}
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  <button
                    onClick={() => redirectPool(item)}
                    className={`${styles.btnclippart} block rounded-sm uppercase text-13px font-bold bg-gamefiGreen-700 w-36 text-center p-2 text-black font-mechanic`} >
                    Pool Detail</button>
                </TableCell>
              </TableRow>)
            }
          </TableBody>
        </Table>
        {
          !!pools.total && <Pagination
            className='mt-4 mb-8'
            currentPage={filter.page}
            totalPage={pools.total}
            onChange={onChangePage}
          />
        }
      </div>
    </div>
  )
}

export default Pools