import LoadingOverlay from '@/components/Base/LoadingOverlay'
import Pagination from '@/components/Base/Pagination'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'
import { useMyWeb3 } from '@/components/web3/context'
import { debounce, fetcher, formatPrice, printNumber, useFetch } from '@/utils'
import { API_BASE_URL, TOKEN_TYPE } from '@/utils/constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Contract, ethers } from 'ethers'
import Link from 'next/link'
import { ObjectType } from '@/utils/types'
import BigNumber from 'bignumber.js'
import ABIPool from '@/components/web3/abis/PreSalePool.json'
import SearchInput from '@/components/Base/SearchInput'
import Dropdown from '@/components/Base/Dropdown'
import { fetchJoined } from '@/pages/api/igo'
import { getLibraryDefaultFlexible, getCurrency } from '@/components/web3/utils'
import { useWeb3Default } from '@/components/web3'
import { format } from 'date-fns'
import Image from 'next/image'
import Tippy from '@tippyjs/react'

const Pools = () => {
  const { account, library } = useMyWeb3()
  const { library: libraryDefault } = useWeb3Default()

  const [loadingPools, setLoadingPools] = useState(false)
  const [pools, setPools] = useState({ total: 0, data: [] })
  const poolTypes = useMemo(() => [
    { value: 1000, label: 'All types' },
    { value: 0, label: 'Public' },
    { value: 1, label: 'Private' },
    { value: 2, label: 'Seed' }
  ], [])
  const [filter, setFilter] = useState<ObjectType>({ page: 1, limit: 10, search: '', type: 1000, typeSelected: poolTypes[0], status: '' })
  const loadPools = useCallback(async () => {
    if (!account) {
      setPools({
        total: 0,
        data: []
      })
      return
    }

    setLoadingPools(true)
    try {
      const res = await fetchJoined(account, filter.page, filter.limit, filter.search, filter.type, filter.status)
      const data = await Promise.all(res.data.data.map(pool => {
        return new Promise((resolve) => {
          getLibraryDefaultFlexible(libraryDefault, pool?.network_available).then(library => {
            if (!library || !pool?.campaign_hash) {
              resolve(pool)
              return
            }

            const contract = new Contract(pool.campaign_hash, ABIPool, library)
            Promise.all([
              contract.userPurchased(account),
              contract.userClaimed(account)
            ]).then(([userPurchased, userClaimed]) => {
              pool.user_purchased = new BigNumber(userPurchased.toString()).div(new BigNumber(10).pow(pool.decimals)).toFixed()
              pool.user_claimed = new BigNumber(userClaimed.toString()).div(new BigNumber(10).pow(pool.decimals)).toFixed()
              resolve(pool)
            }).catch(() => {
              pool.allocation = 0
              resolve(pool)
            })
          })
        })
      }))

      setPools({
        total: +res.data.lastPage || 0,
        data: data || []
      })
      setLoadingPools(false)
    } catch (err) {
      console.debug(err)
      setLoadingPools(false)
    }
  }, [account, filter, libraryDefault])
  useEffect(() => {
    loadPools()
  }, [loadPools])

  const nextClaim = (item: any) => {
    const configs = item?.campaignClaimConfig?.filter(config => new Date(Number(config.start_time) * 1000).getTime() >= new Date().getTime())
    console.log(item)
    if (!configs?.length) {
      return item.campaign_status.toLowerCase() === 'ended' ? 'Finished' : ''
    }

    return format(new Date(Number(configs[0].start_time) * 1000), 'yyyy-MM-dd HH:mm:ss')
  }

  const { response: tokenomicsResponse } = useFetch(`/tokenomics?tickers=${pools?.data?.length > 0 ? pools.data.map(pool => pool.symbol).join(',') : ''}`)

  const tokenomics = useMemo(() => {
    const data = tokenomicsResponse?.data
    return data
  }, [tokenomicsResponse])

  const addToWallet = async (address: string) => {
    const result = await library('wallet_watchAsset', ['ERC20', {
      address: address
    }])
    console.log(result)
  }

  const onChangePage = (page: number) => {
    setFilter(f => ({ ...f, page }))
  }

  const onSearchPool = debounce((e: any) => {
    setFilter(f => ({ ...f, search: e.target.value }))
  }, 1000)

  const onFilterPoolType = (item: ObjectType) => {
    setFilter(f => ({ ...f, type: item.value, typeSelected: item }))
  }

  // const poolHref = useCallback((pool) => {
  //   if (pool.token_type === TOKEN_TYPE.ERC20) {
  //     return `/igo/${pool.id}`
  //   }

  //   return `/ino/${pool.id}`
  // }, [])
  const poolHref = useCallback((pool) => {
    if (pool.token_type === TOKEN_TYPE.ERC20) {
      return `https://hub.gamefi.org/#/buy-token/${pool.id}`
    }

    return `https://hub.gamefi.org/#/mystery-box/${pool.id}`
  }, [])

  return (
    <div className='py-10 px-4 xl:px-9 2xl:pr-32'>
      <div className='flex items-center justify-between'>
        <h3 className='uppercase font-bold text-2xl mb-7'>IGO Pools</h3>
      </div>
      <div className='flex justify-between sm:flex-wrap gap-3 mb-7'>
        <div className='flex gap-3 flex-wrap'>
          <Dropdown
            items={poolTypes}
            propLabel='label'
            propValue='value'
            onChange={onFilterPoolType}
            selected={filter.typeSelected}
            classes={{
              wrapperDropdown: 'w-40'
            }}
          />
        </div>
        <div>
          <SearchInput
            onChange={onSearchPool}
            defaultValue={filter.search}
            placeholder='Search'
            style={{ maxWidth: '320px', width: '100%', height: '38px' }} />
        </div>
      </div>
      <div className="relative">
        <LoadingOverlay loading={loadingPools} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCellHead className="bg-transparent border-b-0">
                <span className="text-13px font-bold text-white/50">Pool Name</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 hidden sm:table-cell">
                <span className="text-13px font-bold text-white/50">Have Bought</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 hidden sm:table-cell">
                <span className="text-13px font-bold text-white/50">Token Allocation</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 hidden sm:table-cell">
                <span className="text-13px font-bold text-white/50">Claimed Tokens</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0">
                <span className="text-13px font-bold text-white/50">Next Claim</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 text-right">
                <span className="text-13px font-bold text-white/50">Token Price</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 text-right">
                <span className="text-13px font-bold text-white/50">Current Price</span>
              </TableCellHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              pools.data.map((item, id) => <TableRow key={id} className="bg-gamefiDark-800 border-b-8 border-gamefiDark-900">
                <TableCell className="border-none">
                  <div className='flex gap-2'>
                    <img src={item.banner} alt="" className='w-10' />
                    <Link href={poolHref(item)} passHref={true}>
                      <a className="hover:underline truncate font-medium">{item.title}</a>
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="border-none hidden sm:table-cell">
                  {printNumber((Number(item.user_purchased) * (Number(item.token_conversion_rate)) || 0))} {getCurrency(item)?.symbol}
                </TableCell>
                <TableCell className="border-none hidden sm:table-cell">
                  {printNumber((Number(item.user_purchased) || 0))} {item.symbol}
                </TableCell>
                <TableCell className="border-none hidden sm:table-cell">
                  {printNumber((item.user_claimed || 0).toLocaleString('en-US'))} {item.symbol}
                </TableCell>
                <TableCell className="border-none hidden sm:table-cell">
                  {nextClaim(item)}
                </TableCell>
                <TableCell className="border-none hidden sm:table-cell text-right">
                  ${item.token_conversion_rate}
                </TableCell>
                <TableCell className="border-none hidden sm:table-cell text-right">
                  {printNumber(tokenomics?.find(token => token.ticker === item.symbol)?.price)}
                </TableCell>
                {/* <TableCell className="border-none hidden sm:table-cell text-right">
                  {item.token && item.campaign_status?.toLowerCase() === 'ended' && <>
                    <Tippy content="Add to Metamask">
                      <button
                        className="w-8 h-8 xl:w-10 xl:h-10 p-2 bg-gamefiDark-630 rounded hover:opacity-90"
                        onClick={() => addToWallet(item.token)}
                      >
                        <Image src={require('@/assets/images/wallets/metamask.svg')} alt=""></Image>
                      </button>
                    </Tippy>
                  </>}
                </TableCell> */}
              </TableRow>)
            }
          </TableBody>
        </Table>
        {
          !!pools.total && pools.total > 1 && <Pagination
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
