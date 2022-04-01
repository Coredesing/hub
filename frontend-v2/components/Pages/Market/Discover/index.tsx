import Dropdown from '@/components/Base/Dropdown'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { NetworkSelector } from '@/components/Base/WalletConnector'
import DiscoverFilter from './DiscoverFilter'
import NFTCard from '../NFTCard'
import Pagination from '../Pagination'
import { ObjectType } from '@/utils/types'
import { filterPriceOptions } from '../constant'
import { useAppContext } from '@/context/index'
import Activities from '../Activities'
import CurrencySelector from '../CurrencySelector'
import WrapperContent, { WrapperItem } from '../WrapperContent'
import DiscoverTypes from './DiscoverTypes'

const Discover = () => {
  const [showDiscover, setShowDiscover] = useState('items')
  const type = showDiscover === 'items' ? 'discover' : 'activities'
  const { state: discoversMarketState, actions } = useAppContext().discoverMarket
  const discoverData = discoversMarketState?.data?.[type] || {}
  const [filter, setFilter] = useState<ObjectType>({
    page: 1,
    network: 'bsc',
    price_order: '',
    currency: '',
    min_price: '',
    max_price: ''
  })

  const handleChangeNetwork = useCallback((network: any) => {
    if (network !== null && typeof network === 'object') {
      for (const name in network) {
        if (network[name] && filter.network !== name) {
          setFilter(f => ({ ...f, network: name }))
          break
        }
      }
    }
  }, [filter])

  useEffect(() => {
    const isDiscover = type === 'discover'
    const applyFilter = {
      ...filter,
      limit: isDiscover ? 16 : 10
    }
    actions.setDiscoverMarket({ type, filter: applyFilter, isGetInfoFromContract: true, allowSetOneByOne: isDiscover, allowGetOwnerNft: isDiscover })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, type])

  // const [infos, setInfos] = useState([])
  // const url = useMemo(() => {
  //   const query = new URLSearchParams(filter).toString()
  //   return `/marketplace/discover?${query}`
  // }, [filter])
  // useEffect(() => {
  //   setInfos([])
  // }, [url])
  // const { response, loading } = useFetch(url)
  // const onSetInfo = useCallback((item: ObjectType) => {
  //   setInfos((arr) => [...arr, item])
  // }, [setInfos])
  // const { data: items, loading: infoLoading } = useNFTInfos(response?.data?.data, onSetInfo)
  // useEffect(() => {
  //   if (items) {
  // setInfos(items)
  //   }
  // }, [items])

  const onChangePage = (page: number) => {
    setFilter(f => ({ ...f, page }))
    const toDiscover = document.getElementById('discover')
    toDiscover && toDiscover.scrollIntoView({ behavior: 'smooth' })
  }

  const onFilterPrice = (item: ObjectType) => {
    setFilter(f => ({ ...f, price_order: item.value, page: 1 }))
  }

  const onAdvanceFilter = useCallback((params: ObjectType) => {
    setFilter(f => ({ ...f, ...params, page: 1 }))
  }, [])

  const onSelectCurrency = useCallback((item: any) => {
    setFilter(f => ({
      ...f,
      currency: item.address !== f.currency ? item.address : '',
      price_order: item.address === f.currency ? '' : f.price_order,
      min_price: '',
      max_price: ''
    }))
  }, [])

  return (
    <div className="bg-black w-full pb-20">
      <WrapperContent>
        <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 relative">
          <div className='relative'>
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div id='discover' className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
                Discover
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('@/assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
              </div>
            </div>
            <div className="mt-14 flex items-center justify-between flex-wrap md:flex-row gap-2">
              <DiscoverTypes
                currentType={showDiscover}
                onChange={(type) => {
                  setShowDiscover(type)
                  setFilter(f => ({ ...f, page: 1 }))
                }} />
              <div className="grid sm:flex items-center flex-wrap gap-2 sm:justify-self-auto sm:w-auto w-full">
                <div className='w-full sm:w-auto'><NetworkSelector
                  isMulti={false}
                  isToggle={false}
                  selected={{ [filter.network]: true }}
                  onChange={handleChangeNetwork}
                  className='h-10'
                  style={{ marginBottom: '0' }}></NetworkSelector></div>
                <div className='flex gap-2'>
                  <CurrencySelector
                    className="w-full h-10"
                    selected={filter.currency}
                    onChange={onSelectCurrency}
                  />
                  <div className='flex'>
                    <div>
                      <Dropdown
                        items={filterPriceOptions}
                        selected={filterPriceOptions.find(f => f.value === filter.price_order)}
                        onChange={onFilterPrice}
                        disabled={!filter.currency}
                        classes={{ buttonSelected: 'h-10' }}
                      />
                    </div>
                    <div>
                      <DiscoverFilter
                        disabled={!filter.currency}
                        onApply={onAdvanceFilter}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {discoversMarketState?.loading
              ? (
                <div className="loader-wrapper absolute left-0 right-0" style={{ bottom: '-74px' }}>
                  <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              )
              : <></>}
          </div>
          {
            showDiscover === 'items' && <>
              <div className="mt-14 grid sm:grid-cols-2-auto lg:grid-cols-3-auto xl:grid-cols-4-auto gap-2 lg:gap-4 justify-center">
                {
                  (discoverData?.currentList || []).length > 0
                    ? discoverData.currentList.map((info, i) => (
                      <WrapperItem key={`discover-${i}`}>
                        <NFTCard item={info} showListing={true} showOffer={true}></NFTCard>
                      </WrapperItem>
                    ))
                    : <></>
                }
              </div>
            </>
          }
          {
            showDiscover === 'activities' && <div className='mt-10'>
              <Activities data={discoverData?.currentList || []} />
            </div>
          }
          {
            +discoverData?.totalPage > 1 && <Pagination page={discoverData.currentPage} pageLast={discoverData.totalPage} setPage={onChangePage} className="w-full justify-center mt-8 mb-8" />
          }

          {/* {!loading && !infoLoading && infos?.length
          ? <>

            <div className="mt-14 grid gap-4 justify-center" style={{ gridTemplateColumns: 'repeat(auto-fill, 280px)' }}>
              {
                infos && infos.length > 0
                  ? infos.map((info, i) => (
                    <NFTCard key={`discover-${i}`} item={info} showListing={true} showOffer={true}></NFTCard>
                  ))
                  : <></>
              }
            </div>
            <Pagination page={response?.data?.page} pageLast={response?.data?.lastPage} setPage={onChangePage} className="w-full justify-center mt-8 mb-8" />
          </>
          : <></>} */}
          {/* {(loading || infoLoading)
          ? (
            <div className="loader-wrapper mx-auto mt-14">
              <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          )
          : <></>} */}
        </div>
      </WrapperContent>
    </div>
  )
}

export default Discover
