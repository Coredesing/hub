import { useReducer } from 'react'
import { marketActivitiesActions } from './constant'
import tiersReducer from './reducer'
import axios from '@/utils/axios'
import { BigNumber, Contract } from 'ethers'
import ERC721ABI from 'components/web3/abis/Erc721.json'
import ERC20ABI from 'components/web3/abis/ERC20.json'
import { getNetworkByAlias, getLibrary } from 'components/web3'
import { networkConnector } from 'components/web3/connectors'
import { Web3Provider } from '@ethersproject/providers'
import { currencyNative, currencyStable } from 'components/web3/utils'

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

export default useMarketActivities
