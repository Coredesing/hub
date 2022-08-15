import {
  useState,
  createContext,
  useRef,
  useEffect,
  useContext
} from 'react'
import { fetcher } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import Recaptcha from '@/components/Base/Recaptcha'

export const HubContext = createContext<{
  showCaptcha:(arg0: any, arg1: any) => void;
  resetToken: () => void;
  tokenCaptcha: string;
  setAccountHub:(arg0: any) => void;
  accountHub: any;
    }>({
      showCaptcha () { },
      resetToken () { },
      tokenCaptcha: '',
      setAccountHub () { },
      accountHub: {}
    })

export const useHubContext = () => useContext(HubContext)

const HubProvider = ({ children }) => {
  const [tokenCaptcha, setTokenCaptcha] = useState('')
  const [accountHub, setAccountHub] = useState(null)
  const { account } = useMyWeb3()
  const recaptchaRef: any = useRef()

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

  const onChangeRecaptcha = (value: string | null) => {
    setTokenCaptcha(value)
  }

  const resetToken = () => {
    recaptchaRef?.current?.resetCaptcha()
    setTokenCaptcha('')
  }

  const onCaptchaWinnerLoad = () => {
    // recaptchaRef.current.execute();
  }

  const onExpire = () => {
    console.debug('hCaptcha Token Expiredsdsd')
  }

  const onError = (err: any) => {
    console.debug(`hCaptcha Error: ${err}`)
  }

  const showCaptcha = (callBack: (arg0: any) => void, reject: (arg0: Error) => void) => {
    recaptchaRef?.current?.execute({ async: true }).then(({ response }) => {
      callBack(response)
    })
      .catch((err: any) => {
        reject(new Error(''))
        console.debug('err1', err)
      })
  }

  return (
    <HubContext.Provider value={{ showCaptcha, tokenCaptcha, resetToken, accountHub, setAccountHub }}>
      {children}
      <Recaptcha
        className="w-full"
        onChange={onChangeRecaptcha}
        ref={recaptchaRef}
        onLoad={onCaptchaWinnerLoad}
        size="invisible"
        onError={onError}
        onExpire={onExpire}
        source="hub"
      />
    </HubContext.Provider>
  )
}

export default HubProvider
