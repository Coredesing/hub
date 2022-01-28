import { useState, useEffect, useMemo } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { API_BASE_URL } from 'constants/api'
import { useMediaQuery } from 'react-responsive'
import { fetcher } from 'utils'

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
export const useFetch = (url: string, timeout?: number) => {
  const [response, setResponse] = useState<SWRResponse | null>(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  console.log(url)
  const { data: fetchResponse, error: fetchError } = useSWR(`${API_BASE_URL}/${url}`, fetcher)

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
