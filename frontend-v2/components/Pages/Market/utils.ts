import { useState, useEffect, useMemo } from 'react'
import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'
import erc721ABI from 'components/web3/abis/Erc721.json'
import { API_BASE_URL } from 'constants/api'
import { getNetworkInfo } from 'components/web3/network'
import { getContractInstance } from 'components/web3'
import { Item } from './types'

type PaginatorInput = {
    current: number;
    last: number;
    betweenFirstAndLast?: number;
};

type Paginator = {
    first: number;
    current: number;
    last: number;
    pages: Array<number>;
    leftCluster: boolean;
    rightCluster: boolean;
};

type ObjectType<T> = { [k: string]: T };

export const networkImage = (network: string) => {
  switch (network) {
  case 'bsc': {
    return require('assets/images/networks/bsc.svg')
  }

  case 'eth': {
    return require('assets/images/networks/eth.svg')
  }

  case 'polygon': {
    return require('assets/images/networks/polygon.svg')
  }
  }
}

export const paginator = (options: PaginatorInput): Paginator | null => {
  const current = options.current
  const total = options.last
  const center = [current - 2, current - 1, current, current + 1, current + 2]
  const filteredCenter: number[] = center.filter((p) => p > 1 && p < total)
  const includeThreeLeft = current === 5
  const includeThreeRight = current === total - 4
  const includeLeftDots = current > 5
  const includeRightDots = current < total - 4

  if (includeThreeLeft) filteredCenter.unshift(2)
  if (includeThreeRight) filteredCenter.push(total - 1)

  let leftCluster = false; let rightCluster = false
  if (includeLeftDots) {
    leftCluster = true
  }

  if (includeRightDots) {
    rightCluster = true
  }

  return {
    current,
    first: 1,
    pages: filteredCenter,
    last: total,
    leftCluster,
    rightCluster
  }
}

export const useAxiosFetch = (url: string, timeout?: number) => {
  const [data, setData] = useState<AxiosResponse | null>(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  const controller = useMemo(() => {
    const a = new AbortController()
    return a
  }, [])
  const fetcher = url => axios.get(url, {
    baseURL: API_BASE_URL,
    signal: controller.signal,
    timeout: timeout
  })

  const { data: fetchHotCollectionsResponse, error: fetchHotCollectionsError } = useSWR(`https://hub.gamefi.org/api/v1${url}`, fetcher)

  useEffect(() => {
    let unmounted = false
    if (!unmounted) {
      setLoading(true)
      setData(fetchHotCollectionsResponse)
      if (fetchHotCollectionsResponse?.data) {
        setLoading(false)
      }

      if (fetchHotCollectionsError) {
        setError(true)
        setErrorMessage(fetchHotCollectionsError.message)
        setLoading(false)
        if (axios.isCancel(fetchHotCollectionsError)) {
          console.log(`request cancelled:${fetchHotCollectionsError.message}`)
        } else {
          console.log('another error happened:' + (fetchHotCollectionsError.message as string))
        }
      }
    }

    return function () {
      setLoading(false)
      unmounted = true
      controller.abort()
    }
  }, [url, timeout, fetchHotCollectionsResponse, fetchHotCollectionsError, controller])

  console.log(data)

  return { data, loading, error, errorMessage }
}

// export const getAllNFTInfo = async (listData: any[]) => {
//   try {
//     const connectorName = state.connector?.data
//     const listItems: ObjectType<any>[] = []
//     for (let i = 0, length = listData.length; i < length; i++) {
//       const item = listData[i]
//       const networkInfo = getNetworkInfo(item.network)
//       const projectAddress = item.token_address
//       let projectInfor = (getState().projectInfors?.data || {})?.[projectAddress]
//       const erc721Contract = getContractInstance(erc721ABI, projectAddress, networkInfo.id)
//       if (!projectInfor) {
//         const response = await axios.get(`/marketplace/collection/${projectAddress}`)
//         projectInfor = response.data.data
//         if (projectInfor) {
//           dispatch(setProjectInfor(projectAddress, projectInfor))
//         }
//       }
//       item.currencySymbol = (getState().currencies?.data || {})?.[item.currency]
//       if (!item.currencySymbol) {
//         item.currencySymbol = await getSymbolCurrency(item.currency, { appChainId: networkInfo.id, connectorName })
//         setCurrencyTokenAddress(item.currency, item.currencySymbol)
//       }
//       item.project = projectInfor || {}
//       item.value = !isNaN(+item.value) ? +item.value : ''
//       const useExternalUri = !!+projectInfor?.use_external_uri
//       let tokenInfor = (getState().tokenInfors?.data || {})?.[item.token_id]
//       if (!tokenInfor) {
//         tokenInfor = {}
//         try {
//           if (useExternalUri) {
//             const result = await axios.post(`/marketplace/collection/${projectAddress}/${item.token_id}`)
//             tokenInfor = result.data.data || {}
//           } else {
//             if (erc721Contract) {
//               const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call()
//               tokenInfor = (await axios.get(tokenURI)).data || {}
//             }
//           }
//         } catch (error) {
//           console.log('err', error)
//         }
//         dispatch && dispatch(setTokenInfor(item.token_id, tokenInfor))
//       }
//       Object.assign(item, tokenInfor)
//       listItems.push(item)
//     }
//     return listItems
//   } catch (error) {
//     console.log('er', error)
//     return []
//   }
// }
