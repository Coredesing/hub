import { useState, useEffect, useMemo } from 'react'
import axios, { AxiosResponse } from 'axios'
import useSWR, { SWRResponse } from 'swr'
import { API_BASE_URL } from 'constants/api'

import { Contract } from '@ethersproject/contracts'
import ERC721Abi from 'components/web3/abis/Erc721.json'
import { useLibraryDefaultFlexible } from 'components/web3/utils'
import { fetcher } from 'utils'
import { useMyWeb3 } from 'components/web3/context'

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

export const useFetch = (url: string, timeout?: number) => {
  const [response, setResponse] = useState<SWRResponse | null>(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  const { data: fetchResponse, error: fetchError } = useSWR(`https://hub.gamefi.org/api/v1${url}`, fetcher)

  useEffect(() => {
    setLoading(true)
    setResponse(fetchResponse)
    if (fetchResponse?.data) {
      setLoading(false)
    }

    if (fetchError) {
      setError(true)
      setErrorMessage(fetchError.message)
      setLoading(false)
    }

    return function () {
      setLoading(false)
    }
  }, [url, timeout, fetchResponse, fetchError])

  return { response, loading, error, errorMessage }
}

export const useNFTInfos = (listData: any[]) => {
  const { provider } = useLibraryDefaultFlexible('bsc', true)
  const [data, setData] = useState<AxiosResponse[]>([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const list = []
    const fetchDatas = async () => {
      for (let i = 0; i < listData?.length || 0; i++) {
        let item = listData[i]
        const tokenAddress = item?.token_address
        const erc721Contract = new Contract(tokenAddress, ERC721Abi, provider)
        if (!erc721Contract) return null
        const tokenURI = await erc721Contract.functions?.tokenURI(item.id).then(res => res[0]).catch(e => console.log(e?.message))
        if (!tokenURI) {
          return null
        }
        await fetcher(tokenURI)
          .then(data => {
            item = {
              token_info: data,
              ...item
            }
          }).catch(function (e) {
            setError(true)
            setErrorMessage(e.message)
            setLoading(false)
          })
        const collectionInfo = await fetcher(`${API_BASE_URL}/marketplace/collection/${item?.token_address}`).then(res => res?.data)
        item = {
          collection_info: collectionInfo,
          ...item
        }
        list.push(item)
      }
      setData(list)
      setLoading(false)
    }

    fetchDatas().catch(e => console.debug(e))
    return function () {
      setLoading(false)
    }
  }, [provider, listData])

  return { data, error, loading, errorMessage }
}
