import { useMyWeb3 } from '@/components/web3/context'
import { fetcher } from '@/utils'
import { useState, useEffect } from 'react'

const useHubProfile = () => {
  const [accountHub, setAccountHub] = useState(null)
  const { account } = useMyWeb3()

  const hubProfileId = () => {
    return new Promise((resolve, reject) => {
      if (!account) {
        reject(new Error('Please connect wallet'))
        return
      }

      const key = `HUB_PROFILE_${account}`

      if (window?.sessionStorage && window.sessionStorage.getItem(key)) {
        const profile = JSON.parse(window.sessionStorage.getItem(key))
        if (profile) {
          resolve(profile)
          return
        }
      }

      fetcher(`/api/hub/profile/${account}`, {
        method: 'GET'
      })
        .then((response) => {
          const { data, error, err } = response
          if (error) {
            console.debug('first2', error, err)
            if (err?.status === 403) {
              setAccountHub(null)
              sessionStorage.clear()
            }
            reject(error)
            return
          }

          if (!data) {
            reject(new Error('Not found user'))
            return
          }

          if (window?.sessionStorage) {
            window.sessionStorage.setItem(key, JSON.stringify(data))
          }

          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  useEffect(() => {
    if (account) {
      hubProfileId()
        .then((result) => setAccountHub(result))
        .catch((err) => {
          setAccountHub(null)
          console.debug('err', err)
        })
    } else setAccountHub(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return {
    hubProfileId,
    setAccountHub,
    accountHub
  }
}

export default useHubProfile
