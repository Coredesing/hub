import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

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

  useEffect(() => {
    let unmounted = false
    const source = axios.CancelToken.source()
    setLoading(true)
    axios.get(url, {
      baseURL: API_BASE_URL,
      cancelToken: source.token,
      timeout: timeout
    })
      .then(a => {
        if (!unmounted) {
          setData(a.data)
          setLoading(false)
        }
      }).catch(function (e) {
        if (!unmounted) {
          setError(true)
          setErrorMessage(e.message)
          setLoading(false)
          if (axios.isCancel(e)) {
            console.debug(`request cancelled:${e.message}`)
          } else {
            console.debug('another error happened:' + (e.message as string))
          }
        }
      })
    return function () {
      unmounted = true
      source.cancel('Cancelling in cleanup')
    }
  }, [url, timeout])

  return { data, loading, error, errorMessage }
}

export const isMysteryBox = (type: string) => {
  return type === 'box'
}

export const isAuctionBox = (type: string) => {
  return type === 'only-auction'
}
