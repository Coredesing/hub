import LoadingOverlay from '@/components/Base/LoadingOverlay'
import Pagination from '@/components/Base/Pagination'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'
import { useMyWeb3 } from '@/components/web3/context'
import { debounce, printNumber, useFetch } from '@/utils'
import { CLAIM_TYPE, TOKEN_TYPE } from '@/utils/constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Contract, ethers } from 'ethers'
import Link from 'next/link'
import { ObjectType } from '@/utils/types'
import BigNumber from 'bignumber.js'
import ABIPool from '@/components/web3/abis/PreSalePool.json'
import SearchInput from '@/components/Base/SearchInput'
import { fetchJoined } from '@/pages/api/igo'
import { getLibraryDefaultFlexible, getCurrency } from '@/components/web3/utils'
import { getNetworkByAlias, switchNetwork, useWeb3Default } from '@/components/web3'
import { format } from 'date-fns'
import Tippy from '@tippyjs/react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import ERC20_ABI from '@/components/web3/abis/ERC20.json'
import Modal from '@/components/Base/Modal'
import { NetworkSelector } from '@/components/Base/WalletConnector'
import Progress from './Progress'
import { roundNumber } from '@/utils/pool'

const Pools = () => {
  const { account, library, network } = useMyWeb3()
  const { library: libraryDefault } = useWeb3Default()
  const [open, setOpen] = useState(false)
  const [selectedPool, setSelectedPool] = useState(null)
  const handleClose = () => {
    setSelectedPool(null)
    setOpen(false)
  }

  const [loadingPools, setLoadingPools] = useState(false)
  const [pools, setPools] = useState({ total: 0, data: [] })
  const [filter, setFilter] = useState<ObjectType>({ page: 1, limit: 10, search: '', status: null, network: { eth: true, bsc: true, polygon: true } })
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
      const res = await fetchJoined(account, filter.page, filter.limit, filter.search, filter.type, filter.status?.value, Object.keys(filter.network).filter(item => filter.network[item] && item).join(','))
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
              pool.user_purchased = new BigNumber(userPurchased.toString()).div(new BigNumber(10).pow([99, 100].includes(pool.id) ? 18 : pool.decimals)).toFixed()
              pool.user_claimed = new BigNumber(userClaimed.toString()).div(new BigNumber(10).pow([99, 100].includes(pool.id) ? 18 : pool.decimals)).toFixed()
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
    if (!configs?.length) {
      return item?.campaign_status?.toLowerCase() === 'ended' ? 'Finished' : ''
    }

    return format(new Date(Number(configs[0].start_time) * 1000), 'yyyy-MM-dd HH:mm')
  }

  const { response: tokenomicsResponse } = useFetch(`/tokenomics?tickers=${pools?.data?.length > 0 ? pools.data.map(pool => pool.symbol).join(',') : ''}`)

  const tokenomics = useMemo(() => {
    const data = tokenomicsResponse?.data
    return data
  }, [tokenomicsResponse])

  const addToWallet = useCallback(async (item: any) => {
    if (!library?.provider?.isMetaMask) {
      toast.error('MetaMask wallet is not found!')
      return
    }

    if (!item.token) {
      return
    }

    if (network?.alias !== item?.network_available) {
      return switchNetwork(library?.provider, getNetworkByAlias(item?.network_available)?.id)
    }

    const tokenContract = new ethers.Contract(item.token, ERC20_ABI, library.getSigner())

    if (!tokenContract) {
      return
    }
    const symbol = await tokenContract.symbol()
    const decimals = await tokenContract.decimals()
    const name = await tokenContract.name()

    await library?.provider?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenContract.address,
          symbol,
          decimals,
          name
        }
      }
    })
  }, [library, network])

  const onChangePage = (page: number) => {
    setFilter(f => ({ ...f, page }))
  }

  const onSearchPool = debounce((e: any) => {
    setFilter(f => ({ ...f, search: e.target.value }))
  }, 1000)

  // const onFilterPoolStatus = (item: ObjectType) => {
  //   setFilter(f => ({ ...f, status: item }))
  // }

  const poolHref = useCallback((pool) => {
    if (pool.token_type === TOKEN_TYPE.ERC20) {
      return `/igo/${pool.slug || pool.id}`
    }

    return `/ino/${pool.slug || pool.id}`
  }, [])

  const currentClaimPhase = (item: any) => {
    let data = null
    const available = item?.campaignClaimConfig?.filter(config => new Date().getTime() >= new Date(Number(config.start_time) * 1000).getTime())
    if (!available?.length) {
      data = null
    } else {
      data = available[available.length - 1]
    }

    return data
  }

  const availableToClaim = (item: any) => {
    return Number(currentClaimPhase(item)?.max_percent_claim) * Number(item?.user_purchased) / 100 || 0
  }

  const claimTypes = (item: any) => {
    if (!item?.campaignClaimConfig?.length) {
      return []
    }

    const types = []
    item?.campaignClaimConfig?.forEach(config => {
      const claimType = CLAIM_TYPE[Number(config?.claim_type)]

      const index = types.findIndex(type => type.name === claimType)
      if (index === -1) types.push({ id: config?.claim_type, name: claimType, value: 0 })
    })

    const keys = item?.campaignClaimConfig?.map(item => item.claim_type)
    const results = []
    let previousValue = 0
    types.forEach(type => {
      const lastIndex = keys.lastIndexOf(type.id)
      const value = Number(item?.campaignClaimConfig[lastIndex]?.max_percent_claim) - previousValue
      results.push({
        ...type,
        value: value > 0 ? value : 0
      })
      previousValue += value
    })
    return results
  }

  const handleChangeNetwork = useCallback((network: any) => {
    if (network !== null && typeof network === 'object') {
      setFilter(f => ({ ...f, network }))
    }
  }, [])

  return (
    <div className='py-10 px-4 xl:px-9 2xl:pr-32'>
      <div className='flex items-center justify-between'>
        <h3 className='uppercase font-bold text-2xl mb-7'>IGO Pools</h3>
      </div>
      <div className='flex justify-between flex-wrap gap-3 mb-7'>
        <div className='flex gap-5 flex-wrap'>
          <NetworkSelector
            onChange={handleChangeNetwork}
            isMulti={true}
            isToggle={false}
            selected={filter.network}
          ></NetworkSelector>
          {/* <div className="flex gap-2 items-center">
            <span className="text-gamefiDark-100 uppercase font-semibold text-sm">Pool Status</span>
            <Dropdown
              items={poolStatus}
              propLabel='label'
              propValue='value'
              onChange={onFilterPoolStatus}
              selected={filter.status}
              classes={{
                wrapperDropdown: 'w-40'
              }}
            />
          </div> */}
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
              <TableCellHead className="bg-transparent border-b-0">
                <span className="text-13px font-bold text-white/50">Have Bought</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 hidden xl:table-cell">
                <span className="text-13px font-bold text-white/50">Token Allocation</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 hidden xl:table-cell min-w-[100px]">
                <span className="text-13px font-bold text-white/50">Claimed Tokens</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 hidden xl:table-cell">
                <span className="text-13px font-bold text-white/50">Next Claim (yyyy-MM-dd {format(new Date(), 'z')})</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 text-right hidden xl:table-cell">
                <span className="text-13px font-bold text-white/50">Token Price</span>
              </TableCellHead>
              <TableCellHead className="bg-transparent border-b-0 text-right hidden xl:table-cell">
                <span className="text-13px font-bold text-white/50">Current Price</span>
              </TableCellHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              pools.data.map((item, id) => <TableRow key={id} className="bg-gamefiDark-630/30 border-b-8 border-gamefiDark-900">
                <TableCell className="border-none">
                  <div className='flex gap-2'>
                    <img src={item.banner} alt="" className='hidden 2xl:block w-10' />
                    <Link href={poolHref(item)} passHref={true}>
                      <a className="hover:underline w-32 truncate font-medium">{item.title}</a>
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="border-none">
                  {roundNumber((Number(item.user_purchased) * (Number(item.token_conversion_rate)) || 0), 2)} {getCurrency(item)?.symbol}
                </TableCell>
                <TableCell className="border-none hidden xl:table-cell">
                  {roundNumber((Number(item.user_purchased) || 0), 2)} {item.symbol}
                </TableCell>
                <TableCell className="border-none hidden xl:table-cell min-w-[100px]">
                  {claimTypes(selectedPool)?.find(type => type.name === CLAIM_TYPE[0])?.value}
                  {claimTypes(item)?.find(type => type.name === CLAIM_TYPE[0])?.value === 100 && Number(item.user_purchased) > 0
                    ? <Progress claimed={Number(item?.user_claimed) || 0} total={roundNumber(availableToClaim(item), 2)}></Progress>
                    : ''}
                </TableCell>
                <TableCell className="border-none hidden xl:table-cell">
                  {nextClaim(item)}
                </TableCell>
                <TableCell className="border-none hidden xl:table-cell text-right">
                  ${item.token_conversion_rate}
                </TableCell>
                <TableCell className="border-none hidden xl:table-cell text-right">
                  {tokenomics?.find(token => token.ticker === item.symbol)?.price ? `$${printNumber(tokenomics?.find(token => token.ticker === item.symbol)?.price)}` : ''}
                </TableCell>
                <TableCell className="border-none hidden xl:table-cell text-right">
                  {item.token &&
                    item.campaign_status?.toLowerCase() === 'ended' && item.token_type === 'erc20' &&
                    item.token?.toLowerCase() !== '0xe23c8837560360ff0d49ed005c5e3ad747f50b3d' && <>
                    <Tippy content="Add to Metamask">
                      <button
                        className="w-8 h-8 xl:w-10 xl:h-10 p-2 bg-gamefiDark-630 rounded hover:opacity-90"
                        onClick={() => {
                          addToWallet(item)
                        }}
                      >
                        <Image src={require('@/assets/images/wallets/metamask.svg')} alt=""></Image>
                      </button>
                    </Tippy>
                  </>}
                </TableCell>
                <TableCell className="border-none xl:hidden text-right">
                  <button className="whitespace-nowrap text-gamefiGreen" onClick={() => {
                    setSelectedPool(item)
                    setOpen(true)
                  }}>View Detail &gt;</button>
                </TableCell>
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
      <Modal
        show={open && selectedPool}
        toggle={handleClose}
      >
        <div className="py-12 px-4">
          <div className="w-full flex items-center justify-between">
            <div>Pool Name</div>
            <div><a className="hover:underline w-32 truncate font-medium">{selectedPool?.title}</a></div>
          </div>
          <div className="w-full flex mt-4 items-center justify-between">
            <div>Have Bought</div>
            <div>{printNumber((Number(selectedPool?.user_purchased) * (Number(selectedPool?.token_conversion_rate)) || 0))} {getCurrency(selectedPool)?.symbol}</div>
          </div>
          <div className="w-full flex mt-4 items-center justify-between">
            <div>Token Allocation</div>
            <div>{printNumber((Number(selectedPool?.user_purchased) || 0))} {selectedPool?.symbol}</div>
          </div>
          <div className="w-full flex mt-4 items-center justify-between">
            <div>Claimed Tokens</div>
            <div>{claimTypes(selectedPool)?.find(type => type.name === CLAIM_TYPE[0])?.value === 100 && Number(availableToClaim(selectedPool)) > 0
              ? <Progress claimed={selectedPool?.user_claimed || 0} total={availableToClaim(selectedPool)}></Progress>
              : ''}</div>
          </div>
          <div className="w-full flex mt-4 items-center justify-between">
            <div>Next Claim</div>
            <div>{nextClaim(selectedPool)}</div>
          </div>
          <div className="w-full flex mt-4 items-center justify-between">
            <div>Token Price</div>
            <div>${selectedPool?.token_conversion_rate}</div>
          </div>
          <div className="w-full flex mt-4 items-center justify-between">
            <div>Current Price</div>
            <div>{tokenomics?.find(token => token.ticker === selectedPool?.symbol)?.price ? `$${printNumber(tokenomics?.find(token => token.ticker === selectedPool?.symbol)?.price)}` : ''}</div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Pools
