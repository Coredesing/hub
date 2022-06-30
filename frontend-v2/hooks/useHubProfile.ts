import { useMyWeb3 } from '@/components/web3/context'
import { fetcher } from '@/utils'
import { useState, useEffect } from 'react'

const useHubProfile = () => {
  const [accountHub, setCountHub] = useState(null)
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

      fetcher(`/api/guilds/profile/${account}`, {
        method: 'GET'
      })
        .then((response) => {
          const { data, error } = response
          if (error) {
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
        .then((result) => setCountHub(result))
        .catch((err) => {
          setCountHub(null)
          console.debug('err', err)
        })
    } else setCountHub(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return {
    hubProfileId,
    accountHub
  }
}

export default useHubProfile
