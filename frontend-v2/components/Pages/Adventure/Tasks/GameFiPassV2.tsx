import { useMyWeb3 } from '@/components/web3/context'
import { fetcher, shorten } from '@/utils'
import Tippy from '@tippyjs/react'
import { useCallback, useEffect, useState } from 'react'
import SocialItem from './SocialItem'
import { useHubContext } from '@/context/hubProvider'
import { Spinning } from '@/components/Base/Animation'
import toast from 'react-hot-toast'
import useConnectWallet from '@/hooks/useConnectWallet'
import { useRouter } from 'next/router'
import styles from './tasks.module.scss'
import useWalletSignature from '@/hooks/useWalletSignature'

const GameFiPassV2 = ({ listSocial, loadingSocial, accountEligible, fetchEligible }) => {
  const { account } = useMyWeb3()
  const [inputEmail, setInputEmail] = useState('')

  const [loading, setLoading] = useState(false)
  const [disableVerify, setDisableVerify] = useState(false)
  const { accountHub } = useHubContext()

  const { connectWallet } = useConnectWallet()

  const router = useRouter()
  const { signMessage } = useWalletSignature()

  const updateEligible = useCallback(async () => {
    if (!accountHub || !listSocial?.length) {
      return
    }
    if (listSocial.every((v: { isCompleted: any }) => v.isCompleted) && accountHub?.confirmed) {
      await fetcher('/api/adventure/updateEligible', {
        method: 'post',
        body: JSON.stringify({
          walletAddress: account
        })
      })

      fetchEligible && fetchEligible()
    }
  }, [listSocial, accountHub?.confirmed, accountHub?.walletAddress, accountEligible, account, fetchEligible])

  useEffect(() => {
    if (!account || accountEligible) return
    updateEligible()
  }, [account, accountEligible, updateEligible])

  useEffect(() => {
    if (accountHub && accountHub.email) {
      setInputEmail(accountHub.email)
    }
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
    setDisableVerify(true)
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
          toast.error(response?.err?.message || 'Something went Wrong')
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
          })
        }
        setLoading(false)
        if (responseSendMail?.error) {
          toast.error('Something went Wrong')
        } else {
          router.replace(router.asPath)
          toast.success('send successfully')
        }
      } catch (err) {
        setLoading(false)
        toast.error(err.message || 'Something went Wrong')
      }
    }).catch(err => {
      setLoading(false)
      toast.error(err?.toString() || 'Could not sign the authentication message')
    })
  }, [connectWallet, disableVerify, getEmail, inputEmail, loading, router])

  return <div
    className={`w-full h-[500px] md:h-64 overflow-hidden rounded-[4px] pl-6 sm:pl-10 pr-6 md:pl-[280px] xl:pl-80 md:pr-2 pt-6 md:pt-20 relative max-w-[1180px] mx-auto ${styles.gamefiPass}`}
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // style={{ backgroundImage: `url(${require('@/assets/images/adventure/meowo.png').default.src})`, backgroundSize: 'cover', backgroundPosition: 'top left', backgroundRepeat: 'no-repeat' }}
  >
    <div className="flex items-center gap-1">
      <div className="text-2xl uppercase font-medium mr-2">{accountEligible ? 'Your' : 'Register'} <span className="font-bold">GameFi Pass</span></div>
      <Tippy content={<span>GameFi Pass is an identity card for GameFi.org users.</span>} className="font-casual text-sm leading-5 p-3">
        <button><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689" />
        </svg></button>
      </Tippy>
    </div>
    {
      account
        ? <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full m-auto col-span-8 md:col-span-5 mb-5 md:mb-0">
            <div className="flex gap-[16px] mt-4">
              {/* <div className="w-24 h-24 lg:w-32 lg:h-32">
            <Image src={accountHub?.avatar?.url || require('@/assets/images/avatar2.png')} alt="avatar"/>
          </div> */}
              <div className="flex justify-center flex-col flex-1 text-sm">
                <div className="">
                  <div className="mb-1 md:mb-5 flex items-center">
                    <div className="w-12 text-sm mr-3 xl:mr-7 font-casual font-semibold">
                  Wallet
                    </div>
                    <div className="text-sm font-casual">{shorten(accountHub?.walletAddress || account)}</div>
                  </div>
                  <div className="mb-1 flex items-center">
                    <div className="w-12 text-sm mr-3 xl:mr-7 font-casual font-semibold">
                  Email
                    </div>
                    {
                      accountHub?.confirmed
                        ? <div className="text-sm font-casual">{accountHub?.email}</div>
                        : <div className="flex">
                          <input
                            placeholder='Enter your email'
                            name="email"
                            value={inputEmail}
                            onChange={e => { setInputEmail(e?.target?.value || '') }}
                            className="bg-transparent w-full py-2 rounded-sm font-casual text-sm focus:border-none focus:ring-0 border-none ring-0"
                          ></input>
                        </div>
                    }
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 text-sm mr-3 xl:mr-7"></div>
                    {
                      accountHub?.confirmed
                        ? <div className="text-gamefiDark-300 cursor-text font-semibold text-sm flex items-center gap-1">
                          Verified
                          <div>
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 0C3.15 0 0 3.15 0 7C0 10.85 3.15 14 7 14C10.85 14 14 10.85 14 7C14 3.15 10.85 0 7 0ZM6.125 9.975L3.15 7L4.375 5.775L6.125 7.525L9.625 4.025L10.85 5.25L6.125 9.975Z" fill="#5F5F6B" />
                            </svg>
                          </div>
                        </div>
                        : <button className={`${!disableVerify ? 'text-gamefiGreen-700' : 'text-gamefiDark-300 cursor-text'} font-semibold text-sm`} onClick={() => { handleVerifyEmail() }}>
                          {loading ? <Spinning className="w-6 h-6" /> : (disableVerify ? 'Please check your email to confirm' : 'Verify my email')}
                        </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div >
          <div className="w-full flex items-center">
            <div className="flex w-full md:w-auto justify-center flex-col relative min-h-[80px]">
              {loadingSocial
                ? <div className="text-gamefiGreen uppercase text-xl font-semibold">Loading...</div>
                : listSocial.map(v => (
                  <SocialItem data={v} key={v._id} />
                ))}
            </div>
          </div>
        </div>
        : <div className="w-full h-full flex flex-col items-center gap-4 mt-4 text-gamefiGreen text-lg font-casual">
          <div className="text-center">Please connect wallet to sync your account</div>
          <button className="text-sm font-medium text-gamefiDark-900 bg-gamefiGreen-700 rounded-sm px-6 py-2 clipped-t-r" onClick={() => { connectWallet().catch(e => { console.debug(e) }) }}>Connect Wallet</button>
        </div>
    }
  </div>
}

export default GameFiPassV2
