import { useCallback } from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import useWalletSignature from '@/hooks/useWalletSignature'
import { fetcher } from '@/utils'
import { useWalletContext } from '@/components/Base/WalletConnector/provider'
import { useHubContext } from '@/context/hubProvider'
import isEmpty from 'lodash.isempty'

const useConnectWallet = () => {
  const { account } = useMyWeb3()
  const { setShowModal: showConnectWallet } = useWalletContext()
  const { signMessage } = useWalletSignature()
  const { showCaptcha, tokenCaptcha, resetToken, accountHub, setAccountHub } =
    useHubContext()
  const connectWallet = useCallback(
    (needCaptcha?: boolean) => {
      return new Promise((resolve, reject) => {
        if (!account) {
          showConnectWallet(true)
          reject(new Error('Please connect wallet'))
          return
        }
        const handleCallback = (newCaptcha: string) => {
          signMessage()
            .then((data) => {
              if (!data) resolve({ error: 'Could not create account' })
              if (!isEmpty(accountHub)) {
                resolve({
                  walletAddress: accountHub.walletAddress,
                  captcha: newCaptcha || tokenCaptcha,
                  signature: data
                })
                return
              }
              fetcher('/api/hub/registerWallet', {
                method: 'POST',
                body: JSON.stringify({
                  walletAddress: account,
                  captcha: newCaptcha || tokenCaptcha
                }),
                headers: {
                  'X-Signature': data,
                  'X-Wallet-Address': account
                }
              })
                .then((response) => {
                  resetToken()
                  if (response.error) {
                    resolve({ error: response.error })
                  }

                  if (!response.data?.walletAddress) {
                    resolve({ error: 'Could not create account' })
                  }
                  setAccountHub(response.data)
                  resolve({
                    walletAddress: response.data?.walletAddress,
                    signature: data
                  })
                })
                .catch((err) => {
                  resetToken()
                  console.debug('err', err)
                })
            })
            .catch((error) => {
              resetToken()
              reject(error)
            })
        }
        if (needCaptcha || isEmpty(accountHub)) {
          // reject(new Error(''))
          showCaptcha(handleCallback, reject)
          return
        }
        handleCallback('')
      })
    },
    [
      account,
      accountHub,
      showConnectWallet,
      signMessage,
      tokenCaptcha,
      resetToken,
      setAccountHub,
      showCaptcha
    ]
  )

  return {
    connectWallet
  }
}

export default useConnectWallet
