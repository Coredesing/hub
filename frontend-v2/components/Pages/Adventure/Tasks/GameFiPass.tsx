import React, { useState, useEffect, useRef } from 'react'
import { fetcher, shorten, isValidEmail } from '@/utils'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { Spinning } from '@/components/Base/Animation'
import { useScreens } from '@/components/Pages/Home/utils'
import { useForm } from 'react-hook-form'
import useConnectWallet from '@/hooks/useConnectWallet'
import ReviewAvatar from '@/components/Base/Review/Avatar'
import { useHubContext } from '@/context/hubProvider'
import { useRouter } from 'next/router'
import Tippy from '@tippyjs/react'
import { useWalletContext } from '@/components/Base/WalletConnector/provider'
import Loading from '@/components/Pages/Hub/Loading'
import { useMyWeb3 } from '@/components/web3/context'
import Item from './SocialItem'
import styles from './tasks.module.scss'

export default function GameFiPass ({
  listSocial,
  loadingSocial,
  setAccountEligible
}) {
  const [loading, setLoading] = useState(false)
  const [firstCome, setFirstCome] = useState(true)
  const [isEligible, setIsEligible] = useState(false)
  const { accountHub: data } = useHubContext()
  const { connectWallet } = useConnectWallet()
  const [disableVerify, setDisableVerify] = useState(false)
  const { account } = useMyWeb3()
  const screens = useScreens()
  const { walletAddress, email, confirmed } = data || {}
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      email
    }
  })
  const router = useRouter()

  useEffect(() => {
    if (firstCome) {
      setFirstCome(false)
    }
    // if (!account) {
    //   delayTimer.current = setTimeout(() => {
    //     showConnectWallet(true)
    //   }, 2000)
    // } else clearTimeout(delayTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    if (!account) return
    if (isEmpty(data) || isEmpty(listSocial)) {
      setAccountEligible(false)
      return
    }
    if (
      listSocial.every((v: { isCompleted: any }) => v.isCompleted) &&
      confirmed
    ) {
      const handle = async () => {
        const response = await fetcher(`/api/adventure/${account}/checkEligible`).catch(() => {
          return {
            isEligible: false
          }
        })

        if (response.isEligible) return

        fetcher('/api/adventure/updateEligible', {
          method: 'post',
          body: JSON.stringify({
            walletAddress
          })
        }).then(() => {
          setAccountEligible(true)
        })
      }

      handle()
    } else setAccountEligible(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSocial, confirmed, walletAddress])

  const onSubmit = (dataSubmit: { email: any }) => {
    if (loading || disableVerify) return
    let { email } = dataSubmit
    if (email?.indexOf('*') > -1) {
      email = ''
    }
    setLoading(true)
    connectWallet(false, email)
      .then(async (res: any) => {
        if (res.error) {
          setLoading(false)
          toast.error(res?.error?.err?.message || 'Something went Wrong')
          return
        }
        try {
          const { walletAddress, signature, isRegister } = res
          const payload: any = {
            email
          }

          let response: { err: any }, responseSendMail
          if (!isRegister && email) {
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
              // body: JSON.stringify({ redirectUrl: `${window.location.hostname}${router.asPath}` }),
              body: JSON.stringify({}),
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
            setDisableVerify(true)
            router.replace(router.asPath)
            toast.success('send successfully')
          }
        } catch (err) {
          setLoading(false)
          toast.error(err.message || 'Something went Wrong')
        }
      })
      .catch((err) => {
        setLoading(false)
        toast.error(
          err?.toString() || 'Could not sign the authentication message'
        )
      })
  }

  const handleUpdate = (event) => {
    event.preventDefault()
    handleSubmit(onSubmit)()
  }
  return (
    <div
      className={clsx(
        loadingSocial ? 'hidden' : 'block',
        'w-full rounded-[4px] p-2 py-5 md:p-6 overflow-hidden relative bg-white max-w-[1180px] mx-auto'
      )}
    >
      <Tippy
        disabled
        content={<span>GAmeFi</span>}
        className="font-casual text-sm leading-5 p-3"
      >
        <div className="flex max-w-[250px] mb-5">
          <div className="text-2xl uppercase font-bold mr-2 text-[#15171E]">
            GAmeFi <span className="font-medium">Pass</span>
          </div>
          {/* <button className='ml-2'><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689" />
            </svg></button> */}
        </div>
      </Tippy>
      <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
        <form className="w-full m-auto col-span-8 md:col-span-5 mb-5 md:mb-0">
          <div className="flex gap-[16px]">
            <div className="">
              <div
                className={clsx(
                  styles.avatar,
                  'rounded-[3px] w-[60px] h-[60px] md:w-[164px] md:h-[164px] overflow-hidden'
                )}
              >
                <ReviewAvatar
                  size={!screens.mobile || !screens.tablet ? 164 : 64}
                  url={get(data, 'avatar.url', '')}
                />
              </div>
            </div>
            <div
              className={clsx(
                styles.info,
                'flex justify-center flex-col flex-1'
              )}
            >
              <div className="">
                <div className="mb-2 md:mb-5 flex items-center">
                  <div className="text-sm mr-3 xl:mr-7 font-casual font-semibold text-[#15171E]">
                    Wallet
                  </div>
                  <div className="text-sm font-casual text-[#15171E]">
                    {shorten(walletAddress || account)}
                  </div>
                </div>

                <div className="">
                  <div className="flex items-center">
                    <div className="text-sm mr-3 xl:mr-7 font-casual font-semibold text-[#15171E]">
                      Email
                    </div>
                    {confirmed
                      ? (
                        <div className="text-sm font-casual text-[#15171E]">
                          {email}
                        </div>
                      )
                      : (
                        <>
                          <input
                            className="bg-black/5 border placeholder-[#15171E]/50 placeholder-opacity-30 font-casual text-sm rounded-sm px-4 py-1.5 w-full text-[#15171E]"
                            name="email"
                            placeholder="Enter your email"
                            maxLength={100}
                            {...register('email', {
                              required: true,
                              validate: isValidEmail
                            })}
                            onChange={(e) => {
                              setValue('email', e.target.value)
                            }}
                          />
                          <button
                            className="disabled:cursor-not-allowed flex-none hidden md:block items-center justify-center overflow-hidden text-gamefiGreen-700 font-semibold font-casual text-[13px] hover:opacity-95 cursor-pointer w-[200px] "
                            onClick={handleUpdate}
                            type="submit"
                            disabled={loading || disableVerify}
                          >
                            {loading
                              ? (
                                <Spinning className="w-6 h-6" />
                              )
                              : disableVerify
                                ? (
                                  'Please check your email'
                                )
                                : (
                                  'Verify my email'
                                )}
                          </button>
                        </>
                      )}
                  </div>
                  {confirmed || (
                    <div className="md:hidden flex justify-end mt-2">
                      <button
                        className="disabled:cursor-not-allowed flex md:hidden items-center overflow-hidden text-gamefiGreen-700 font-semibold font-casual text-[13px] hover:opacity-95 cursor-pointer"
                        onClick={handleUpdate}
                        type="submit"
                        disabled={loading || disableVerify}
                      >
                        {loading
                          ? (
                            <Spinning className="w-6 h-6" />
                          )
                          : disableVerify
                            ? (
                              'Please check your email'
                            )
                            : (
                              'Verify my email'
                            )}
                      </button>
                    </div>
                  )}
                  {errors.email && (
                    <div className="mt-2 text-normal text-red-500 ">
                      Email is required
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="col-span-8 md:col-span-3 flex justify-center flex-col relative min-h-[80px]">
          {loadingSocial ||
            listSocial.map((v) => <Item data={v} key={v._id} />)}
          {loadingSocial && <Loading isPart className="text-gamefiGreen-700" />}
        </div>
      </div>
    </div>
  )
}
