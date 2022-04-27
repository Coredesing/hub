import Dropdown from '@/components/Base/Dropdown'
import React, { useCallback, useEffect, useState } from 'react'
import { NetworkSelector } from '@/components/Base/WalletConnector'
import NFTCard from '../NFTCard'
import { filterPriceOptions } from '../constant'
import { ObjectType } from '@/utils/types'
import DiscoverFilter from '../Discover/DiscoverFilter'
import Pagination from '../Pagination'
import NoItemFound from '@/components/Base/NoItemFound'
import { useAppContext } from '@/context/index'
// import clsx from 'clsx'
import Activities from '../Activities'
import CurrencySelector from '../CurrencySelector'
import DiscoverTypes from '../Discover/DiscoverTypes'
import { WrapperItem } from '../WrapperContent'

const CollectionItems = ({ slug }: { slug: string }) => {
  const [collectionType, setCollectionType] = useState<'items' | 'activities'>('items')
  const { state: collectionsMarketState, actions } = useAppContext().collectionsMarket
  const collectionsData = collectionsMarketState?.data?.[collectionType]?.[slug] || {}

  const [filter, setFilter] = useState<ObjectType>({
    page: 1,
    limit: 10,
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
    actions.setCollectionsMarket({
      type: collectionType,
      slug,
      filter: { ...filter, limit: collectionType === 'items' ? 20 : 10 },
      isGetInfoFromContract: true,
      allowSetOneByOne: collectionType === 'items',
      allowGetOwnerNft: collectionType === 'items'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, collectionType, slug])

  // const [infos, setInfos] = useState([])
  // const url = useMemo(() => {
  //   const query = new URLSearchParams(filter).toString()
  //   return `/marketplace/collection/${slug}/items?${query}`
  // }, [filter, slug])
  // const { response, loading } = useFetch(url)

  // useEffect(() => {
  //   setInfos([])
  // }, [url])
  // const onSetInfo = useCallback((item: ObjectType) => {
  //   setInfos((arr) => [...arr, item])
  // }, [setInfos])

  // const { loading: infoLoading } = useNFTInfos(response?.data?.data, onSetInfo)

  const onChangePage = (page: number) => {
    setFilter(f => ({ ...f, page }))
    const toHeader = document.getElementById('first')
    toHeader && toHeader.scrollIntoView({ behavior: 'smooth' })
  }

  const onFilterPrice = (item: ObjectType) => {
    setFilter(f => ({ ...f, price_order: item.value }))
  }

  const onAdvanceFilter = useCallback((params: ObjectType) => {
    setFilter(f => ({ ...f, ...params }))
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
    <div className="w-full pb-20">
      <div className="md:px-4 lg:px-8 md:container mx-2 mt-20">
        <div className="m-auto" style={{ maxWidth: '1170px' }}>
          <div className="mt-14 flex items-center justify-between flex-wrap md:flex-row gap-2 relative" id='first'>
            <DiscoverTypes
              currentType={collectionType}
              onChange={(type) => {
                setCollectionType(type)
                setFilter(f => ({ ...f, page: 1 }))
              }} />
            <div className="grid sm:flex md:flex-row flex-wrap gap-2 items-center sm:justify-self-auto sm:w-auto w-full">
              <div className='w-full sm:w-auto'><NetworkSelector
                isMulti={false}
                isToggle={false}
                selected={{ [filter.network]: true }}
                onChange={handleChangeNetwork}
                className='mb-0 sm:h-10'
                style={{ marginBottom: '0' }} /></div>

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
              {/* <CurrencySelector selected={filter.currency} onChange={onSelectCurrency} className='mb-0' style={{ height: '38px' }} />
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
                  onApply={onAdvanceFilter}
                  disabled={!filter.currency}
                />
              </div>
            </div> */}
            </div>
            {(collectionsMarketState.loading)
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
            collectionType === 'items'
              ? <div className="mt-14 grid sm:grid-cols-2-auto lg:grid-cols-3-auto xl:grid-cols-4-auto gap-2 lg:gap-4 justify-center md:justify-start">
                {
                  (collectionsData.currentList || []).length > 0
                    ? collectionsData.currentList.map((info, i) => (<WrapperItem key={`discover-${i}`}>
                      <NFTCard item={info} showListing={true} showOffer={true}></NFTCard>
                    </WrapperItem>
                    ))
                    : <></>
                }
              </div>
              : <div className='mt-10'>
                <Activities data={collectionsData?.currentList || []} />
              </div>
          }
          {
            +collectionsData.totalPage > 1 && <Pagination page={collectionsData.currentPage} pageLast={collectionsData.totalPage} setPage={onChangePage} className="w-full justify-center mt-8 mb-8" />
          }
          {
            !collectionsMarketState.loading && collectionsMarketState.data !== null && !collectionsData.currentList?.length && <NoItemFound />
          }
        </div>
      </div>
    </div>
  )
}

export default CollectionItems
