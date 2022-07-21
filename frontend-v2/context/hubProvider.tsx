/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useState,
  createContext,
  useRef,
  useContext
} from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import useWalletSignature from '@/hooks/useWalletSignature'
import { fetcher, debounce } from '@/utils'
import { useWalletContext } from '@/components/Base/WalletConnector/provider'
import Recaptcha from '@/components/Base/Recaptcha'

export const HubContext = createContext<{
  showCaptcha:(arg0: any, arg1: any) => void;
  resetToken: () => void;
  tokenCaptcha: string;
    }>({
      showCaptcha () { },
      resetToken () { },
      tokenCaptcha: ''
    })

export const useHubContext = () => useContext(HubContext)

const HubProvider = ({ children }) => {
  const [tokenCaptcha, setTokenCaptcha] = useState('')
  const { account } = useMyWeb3()
  const { setShowModal: showConnectWallet } = useWalletContext()
  const recaptchaRef: any = useRef()
  const { signMessage } = useWalletSignature()

  const onRefreshRecaptcha = debounce(() => {
    console.log('come')
    if (!tokenCaptcha) return
    console.log('come1')
    if (typeof recaptchaRef?.current?.resetCaptcha === 'function') {
      recaptchaRef.current.resetCaptcha()
    }
  }, 5000)

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
    <HubContext.Provider value={{ showCaptcha, tokenCaptcha, resetToken }}>
      {children}
      <Recaptcha
        className="w-full mb-3"
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
