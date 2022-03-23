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
      limit: isDiscover ? 8 : 10
    }
    actions.setDiscoverMarket({ type, filter: applyFilter, isGetInfoFromContract: true, allowSetOneByOne: isDiscover })
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
      <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 relative">
        <div className='relative'>
          <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
            <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
              Discover
            </div>
            <div className="absolute -bottom-5 left-0 right-0">
              <Image src={require('@/assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
            </div>
          </div>
          <div className="mt-14 flex items-center justify-between flex-wrap md:flex-row gap-2">
            <div className="flex">
              <div className="relative" style={{ marginRight: '-6px' }}>
                <button
                  className={`absolute top-0 bottom-0 w-full flex items-center justify-center pr-2 font-semibold uppercase ${showDiscover === 'items' ? 'text-black' : 'text-white opacity-50'}`}
                  onClick={() => setShowDiscover('items')}
                >Items
                </button>
                <svg width="142" height="38" viewBox="0 0 142 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 2C0 0.89543 0.895431 0 2 0H66H130.458C131.367 0 132.161 0.612387 132.392 1.49101L142 38H8.82843C8.298 38 7.78929 37.7893 7.41421 37.4142L0.585786 30.5858C0.210713 30.2107 0 29.702 0 29.1716V2Z" fill={showDiscover === 'items' ? '#6CDB00' : '#242732'} />
                </svg>
              </div>
              <div className="relative">
                <button
                  className={`absolute top-0 bottom-0 w-full flex items-center justify-center pr-2 font-semibold uppercase ${showDiscover === 'activities' ? 'text-black' : 'text-white opacity-50'}`}
                  onClick={() => setShowDiscover('activities')}
                >Activities</button>
                <svg width="142" height="38" viewBox="0 0 142 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0H133.172C133.702 0 134.211 0.210714 134.586 0.585786L141.414 7.41421C141.789 7.78929 142 8.29799 142 8.82843V36C142 37.1046 141.105 38 140 38H11.5418C10.6332 38 9.83885 37.3876 9.60763 36.509L0 0Z" fill={showDiscover === 'activities' ? '#6CDB00' : '#242732'} />
                </svg>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-2 sm:justify-self-auto justify-end sm:w-auto w-full">
              <div><NetworkSelector isMulti={false} isToggle={false} selected={{ [filter.network]: true }} onChange={handleChangeNetwork} style={{ height: '38px' }}></NetworkSelector></div>
              <CurrencySelector selected={filter.currency} onChange={onSelectCurrency} />
              <div className='flex'>
                <div>
                  <Dropdown
                    items={filterPriceOptions}
                    selected={filterPriceOptions.find(f => f.value === filter.price_order)}
                    onChange={onFilterPrice}
                    disabled={!filter.currency}
                  />
                </div>
                <div className="">
                  <DiscoverFilter
                    disabled={!filter.currency}
                    onApply={onAdvanceFilter}
                  />
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
            <div className="mt-14 grid gap-4 justify-center" style={{ gridTemplateColumns: 'repeat(auto-fill, 280px)' }}>
              {
                (discoverData?.currentList || []).length > 0
                  ? discoverData.currentList.map((info, i) => (
                    <NFTCard key={`discover-${i}`} item={info} showListing={true} showOffer={true}></NFTCard>
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
    </div>
  )
}

export default Discover
