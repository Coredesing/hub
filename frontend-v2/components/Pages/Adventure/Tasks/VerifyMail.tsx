import { useMyWeb3 } from '@/components/web3/context'
import { fetcher, gtagEvent } from '@/utils'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useConnectWallet from '@/hooks/useConnectWallet'
import { useRouter } from 'next/router'
import useWalletSignature from '@/hooks/useWalletSignature'
import { Spinning } from '@/components/Base/Animation'
import { useHubContext } from '@/context/hubProvider'

export default function VerifyMail () {
  const [inputEmail, setInputEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [disableVerify, setDisableVerify] = useState(false)
  const { accountHub } = useHubContext()
  const { connectWallet } = useConnectWallet()
  const { account } = useMyWeb3()

  const router = useRouter()
  const { signMessage } = useWalletSignature()

  useEffect(() => {
    if (accountHub?.email?.indexOf('*') > -1 && accountHub?.email?.endsWith('@gamefi.org')) {
      setInputEmail('')
      return
    }

    if (!accountHub?.email) {
      setInputEmail('')
      return
    }

    setInputEmail(accountHub.email)
  }, [accountHub])

  const getEmail = useCallback(async () => {
    return signMessage().then(data => {
      if (data) {
        return fetcher('/api/hub/profile/me', {
          method: 'GET',
          headers: {
            'X-Signature': data,
            'X-Wallet-Address': account
          }
        })
      }
    }).catch(e => console.debug(e))
  }, [account, signMessage])

  const handleVerifyEmail = useCallback(async () => {
    if (loading || disableVerify) return
    let emailToVerify = inputEmail
    if (inputEmail?.indexOf('*') > -1) {
      await getEmail().then(res => {
        if (res) {
          emailToVerify = res.email
        }
      }).catch(e => setLoading(false))
    }
    if (!emailToVerify) {
      setLoading(false)
      return
    }
    setLoading(true)
    connectWallet(false, emailToVerify).then(async (res: any) => {
      if (res.error) {
        setLoading(false)
        toast.error('Could not update info')
        return
      }
      try {
        const { walletAddress, signature, isRegister } = res
        const payload: any = {
          email: emailToVerify
        }

        let response: { err: any }, responseSendMail
        if (!isRegister && emailToVerify) {
          response = await fetcher('/api/hub/profile/update', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'X-Signature': signature,
              'X-Wallet-Address': walletAddress
            }
          })
        }
        if (response?.err) {
          toast.error(response?.err?.message || 'Something went wrong')
          setLoading(false)
          return
        } else {
          responseSendMail = await fetcher('/api/hub/emailValidation', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'X-Signature': signature,
              'X-Wallet-Address': walletAddress
            }
          }).catch(e => {
            setLoading(false)
          })
        }
        setLoading(false)
        if (responseSendMail?.error) {
          toast.error(responseSendMail?.err?.message || 'Something went wrong')
        } else {
          router.replace(router.asPath)
          setDisableVerify(true)
          toast.success('send successfully')
          gtagEvent('catventure_email_verify', { wallet: `${account}_`, email: emailToVerify })
        }
        setLoading(false)
      } catch (err) {
        setLoading(false)
        toast.error(err.message || 'Something went Wrong')
      }
    }).catch(err => {
      setLoading(false)
      toast.error(err?.toString() || 'Could not sign the authentication message')
    })
  }, [account, connectWallet, disableVerify, getEmail, inputEmail, loading, router])

  return (
    <div className="flex flex-wrap justify-end sm:justify-center items-center gap-3 sm:gap-6 mt-9">
      <input
        placeholder='Enter your email'
        name="newEmail"
        id="newEmail"
        value={inputEmail}
        onChange={e => { setInputEmail(e?.target?.value || '') }}
        className="bg-[#22252F] w-full sm:w-[400px] border rounded pl-6 border-[#303342] py-3 lg:py-3.5 font-casual text-sm focus:ring-0 ring-0"
      ></input>
      <button className={`${!disableVerify ? 'text-gamefiGreen-700' : 'text-gamefiDark-300 cursor-text'} font-semibold text-sm`} onClick={() => {
        handleVerifyEmail()
      }}>
        {loading ? <Spinning className="w-6 h-6" /> : (disableVerify ? 'Please check your email to confirm' : 'Verify my email')}
      </button>
    </div>
  )
}
