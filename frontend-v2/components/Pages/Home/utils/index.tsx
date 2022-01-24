import { useState, useEffect, useMemo } from 'react'
import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'
import { API_BASE_URL } from 'constants/api'
import { useMediaQuery } from 'react-responsive'

export const useScreens = () => {
  const screens = {
    mobile: useMediaQuery({ maxWidth: '700px' }),
    tablet: useMediaQuery({ minWidth: '701px', maxWidth: '1023px' }),
    md: useMediaQuery({ minWidth: '1024px', maxWidth: '1367px' }),
    lg: useMediaQuery({ minWidth: '1368px', maxWidth: '1919px' }),
    xl: useMediaQuery({ minWidth: '1920px' })
  }
  return screens
}
export const useAxiosFetch = (url: string, timeout?: number) => {
  const [response, setResponse] = useState<AxiosResponse | null>(null)
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

  const { data: fetchHotCollectionsResponse, error: fetchHotCollectionsError } = useSWR(url, fetcher)

  useEffect(() => {
    let unmounted = false
    if (!unmounted) {
      setLoading(true)
      setResponse(fetchHotCollectionsResponse)
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

  return { response, loading, error, errorMessage }
}
