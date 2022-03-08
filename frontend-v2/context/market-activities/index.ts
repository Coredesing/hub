import { useCallback, useReducer } from 'react'
import { discoverMarketActions, marketActivitiesActions } from './constant'
import tiersReducer, { discoverMarketReducer } from './reducer'
import axios from '@/utils/axios'
import { BigNumber, Contract } from 'ethers'
import ERC721ABI from 'components/web3/abis/Erc721.json'
import ERC20ABI from 'components/web3/abis/ERC20.json'
import { getNetworkByAlias, getLibrary } from 'components/web3'
import { networkConnector } from 'components/web3/connectors'
import { Web3Provider } from '@ethersproject/providers'
import { currencyNative, currencyStable, getLibraryDefaultFlexible, useLibraryDefaultFlexible } from 'components/web3/utils'
import { fetcher, isDifferentObj } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { ObjectType } from '@/utils/types'
import { getNftInfor } from '@/components/Pages/Market/utils'
import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider)

type MarketDetailFilter = {
  limit?: number;
  page?: number;
  tokenId: string | number;
  project: string;
  force?: boolean;
}

const useMarketActivities = () => {
  const initState = {
    data: null,
    loading: false,
    error: ''
  }

  const [state, dispatch] = useReducer(tiersReducer, initState)

  const setActivitiesMarketDetail = async (filter: MarketDetailFilter, provider: Web3Provider) => {
    const oldData = state.data
    dispatch({ type: marketActivitiesActions.LOADING, payload: oldData })
    try {
      const limit = filter?.limit || 10
      const page = filter?.page || 1
      const oldDataByDetail = oldData?.[filter.tokenId]
      if (!filter.force && oldDataByDetail?.data?.[page]?.length) {
        oldDataByDetail.currentPage = page
        oldDataByDetail.currentList = oldDataByDetail.data[page]
        dispatch({ type: marketActivitiesActions.SUCCESS, payload: { ...oldData, [filter.tokenId]: oldDataByDetail } })
        return
      }

      const response = await axios.get(`/marketplace/collection/${filter.project}/activities?page=${page}&limit=${limit}&token_id=${filter.tokenId}`)
      const result = response.data.data || null
      if (!result) {
        dispatch({ type: marketActivitiesActions.SUCCESS, payload: oldData })
        return
      }

      let listData = result.data || []
      listData = await Promise.all(listData.map(async item => {
        try {
          if (BigNumber.from(item.currency).isZero()) {
            item.currencySymbol = currencyNative(item.network)?.symbol
          } else {
            item.currencySymbol = currencyStable(item.network)?.symbol
            if (!item.currencySymbol) {
              const erc20Contract = new Contract(item.currency, ERC20ABI, provider)
              item.currencySymbol = await erc20Contract.symbol()
            }
          }
        } catch (error) {
          console.log('err', error)
        }

        return item
      }))
      const totalRecords = +result.total || 0
      const currentPage = +result.page || 1
      const setData = {
        [filter.tokenId]: {
          total: totalRecords,
          currentPage,
          totalPage: Math.ceil(totalRecords / limit),
          currentList: listData,
          filter: {
            ...(oldDataByDetail?.filter || {}),
            limit,
            page
          },
          data: {
            ...(oldDataByDetail?.data || {}),
            [currentPage]: listData
          }
        }
      }
      dispatch({ type: marketActivitiesActions.SUCCESS, payload: { ...oldData, ...setData } })
    } catch (error: any) {
      console.log('error', error)
      dispatch({
        type: marketActivitiesActions.FAILURE,
        payload: error
      })
    }
  }

  const setData = (data: any) => {
    dispatch({ type: marketActivitiesActions.SUCCESS, payload: data })
  }

  return {
    state,
    actions: {
      setActivitiesMarketDetail
    }
  }
}

export const useDiscoverMarket = () => {
  const initState = {
    data: null,
    loading: false,
    error: ''
  }
  const [state, dispatch] = useReducer(discoverMarketReducer, initState)
  const setDiscoverMarket = useCallback(async ({
    type,
    filter,
    isGetInfoFromContract,
    allowSetOneByOne
  }: {
    type: string,
    filter: ObjectType,
    isGetInfoFromContract?: boolean,
    allowSetOneByOne?: boolean
  }) => {
    try {
      const oldData = state.data || {}
      dispatch({ type: discoverMarketActions.LOADING, payload: { ...oldData } })
      const oldTypeData = oldData[type] || {}
      const oldFilter = oldTypeData.filter || {}
      if (oldTypeData.data?.[filter.page]?.length && !isDifferentObj(oldFilter, filter, ['page'])) {
        oldTypeData.currentPage = filter.page
        oldTypeData.currentList = oldTypeData?.data?.[filter.page]
        oldTypeData.filter = { ...(oldTypeData.filter || {}), ...filter }
        dispatch({ type: discoverMarketActions.SUCCESS, payload: { ...oldData, [type]: { ...oldTypeData } } })
        return
      }

      // check old filter and newFIlter check page old and new
      filter.limit = filter.limit || 10
      const query = new URLSearchParams(filter).toString()
      const response = await fetcher(`${API_BASE_URL}/marketplace/${type}?${query}`)
      const result = response.data || {}
      const totalRecords = +result.total || 0
      const totalPage = Math.ceil(totalRecords / filter.limit)
      const currentPage = +result.page || 1
      let listData = result.data
      if (isGetInfoFromContract) {
        const provider = await getLibraryDefaultFlexible(web3.currentProvider, 'bsc')
        const list = []
        listData = await Promise.all(listData.map(async item => {
          const d = await getNftInfor(item, provider)
          item = d.item
          if (allowSetOneByOne) {
            list.push(item)
            const setData = {
              ...oldData,
              [type]: {
                ...oldTypeData,
                filter: { ...oldFilter, ...filter },
                total: totalRecords,
                currentPage,
                totalPage,
                currentList: list,
                data: {
                  ...(oldTypeData?.data || {}),
                  [currentPage]: list
                }
              }
            }
            dispatch({
              type: list.length < listData.length ? discoverMarketActions.LOADING : discoverMarketActions.SUCCESS,
              payload: { ...setData }
            })
          }
          return item
        }))
        if (allowSetOneByOne) return
      }

      const setData = {
        ...oldData,
        [type]: {
          ...oldTypeData,
          filter: { ...oldFilter, ...filter },
          total: totalRecords,
          currentPage,
          totalPage,
          currentList: listData,
          data: {
            ...(oldTypeData?.data || {}),
            [currentPage]: listData
          }
        }
      }
      dispatch({ type: discoverMarketActions.SUCCESS, payload: { ...setData } })

    } catch (error) {
      console.log('error', error)
      dispatch({ type: discoverMarketActions.FAILURE, payload: error })

    }
  }, [state])



  return {
    state,
    actions: {
      setDiscoverMarket
    }
  }
}


export default useMarketActivities
