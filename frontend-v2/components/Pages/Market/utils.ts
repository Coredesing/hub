import { useState, useEffect, useMemo } from 'react'
import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'
import { API_BASE_URL } from 'constants/api'

import { Contract } from '@ethersproject/contracts'
import ERC721Abi from 'components/web3/abis/Erc721.json'
import { useLibraryDefaultFlexible } from 'components/web3/utils'

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
  const [data, setData] = useState<AxiosResponse | null>(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  const controller = useMemo(() => {
    return new AbortController()
  }, [])
  const fetcher = async url => await axios.get(url, {
    baseURL: API_BASE_URL,
    timeout: timeout
  })

  const { data: fetchResponse, error: fetchError } = useSWR(`https://hub.gamefi.org/api/v1${url}`, fetcher)

  useEffect(() => {
    let unmounted = false
    if (!unmounted) {
      setLoading(true)
      setData(fetchResponse)
      if (fetchResponse?.data) {
        setLoading(false)
      }

      if (fetchError) {
        setError(true)
        setErrorMessage(fetchError.message)
        setLoading(false)
        if (axios.isCancel(fetchError)) {
          console.log(`request cancelled:${fetchError.message}`)
        } else {
          console.log('another error happened:' + (fetchError.message as string))
        }
      }
    }

    return function () {
      setLoading(false)
      unmounted = true
    }
  }, [url, timeout, fetchResponse, fetchError, controller])

  return { data, loading, error, errorMessage }
}

export const useNFTInfos = (listData: any[]) => {
  const { provider } = useLibraryDefaultFlexible()
  const [data, setData] = useState<AxiosResponse[]>([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const controller = useMemo(() => {
    return new AbortController()
  }, [])

  useEffect(() => {
    let unmounted = false
    setLoading(true)
    const list = []
    listData && listData.map(async item => {
      const tokenAddress = item?.token_address
      const erc721Contract = new Contract(tokenAddress, ERC721Abi, provider)
      if (!erc721Contract) return null
      const tokenURI = await erc721Contract.functions?.tokenURI(item.id).then(res => res[0]).catch(e => console.log(e?.message))
      tokenURI && axios.get(tokenURI, {
        signal: controller.signal
      })
        .then(a => {
          console.log('aaa', a)
          list.push(a.data)
        }).catch(function (e) {
          if (!unmounted) {
            setError(true)
            setErrorMessage(e.message)
            setLoading(false)
            if (axios.isCancel(e)) {
              console.log(`request cancelled:${e.message}`)
            } else {
              console.log('another error happened:' + (e.message as string))
            }
          }
        })
    })

    console.log(unmounted)

    if (!unmounted) setData(list)
    setLoading(false)

    return function () {
      setLoading(false)
      if (unmounted) {
        controller.abort()
      }
      unmounted = true
    }
  }, [controller, provider, listData, listData.length])

  return { data, error, loading, errorMessage }
}
