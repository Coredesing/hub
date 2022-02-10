/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { DocumentCopyIcon, SolanaIcon, TerraIcon } from 'components/Base/Icon'
import styles from './Profile.module.scss'
import clsx from 'clsx'
import { useAppContext } from '@/context/index'
import { useMyWeb3 } from '@/components/web3/context'
import axios from '@/utils/axios'
import toast from 'react-hot-toast'
import useWalletSignature from 'hooks/useWalletSignature'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { useRouter } from 'next/router'

const Profile = () => {
  const tiers = useAppContext()?.$tiers
  const { account } = useMyWeb3()
  const [isEdit, setIsEdit] = useState(false)
  const [newTwitter, setNewTwitter] = useState('')
  const [newTelegram, setnewTelegram] = useState('')
  const [newSolanaWallet, setNewSolanaWallet] = useState('')
  const [newTerraWallet, setNewTerraWallet] = useState('')
  const [signature, setSignature] = useState('')
  const { signMessage } = useWalletSignature()

  const router = useRouter()

  useEffect(() => {
    if (account) {
      tiers.actions.getUserTier(account)
    }
  }, [account])

  const [userInfo, setUserInfo] = useState<any>()
  const [loadingUserInfo, setLoadingUserInfo] = useState(false)
  useEffect(() => {
    if (!account) return
    const getUserInfo = async () => {
      const response = await axios.get(`/user/profile?wallet_address=${account}`)
      setUserInfo(response.data.data?.user || {})
    }
    getUserInfo().catch(console.debug).finally(() =>
      setLoadingUserInfo(false)
    )
  }, [account])

  const onCopy = (val: any) => {
    navigator.clipboard.writeText(val)
  }

  const handleEdit = async () => {
    const data = await signMessage()
    if (!data) return
    setSignature(data.toString())

    setIsEdit(true)
    setNewTwitter(userInfo?.user_twitter || '')
    setnewTelegram(userInfo?.user_telegram || '')
    setNewSolanaWallet(userInfo?.solana_address || '')
  }

  const handleSave = async () => {
    let solanaSignature
    // if (newSolanaWallet) {
    //   solanaSignature = await solanaSign()
    // }

    const httpConfig = {
      headers: {
        msgSignature: process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signature,
        wallet_address: account,
        user_twitter: newTwitter,
        user_telegram: newTelegram
        // solana_address: solanaSignature?.publicKey ?? '',
        // solana_signature: solanaSignature?.signature ?? ''
      }),
      method: 'PUT'
    }

    const response = await fetcher(`${API_BASE_URL}/user/update-profile`, httpConfig as any)

    if (response.data) {
      if (response.data.status === 200 || response.data.user) {
        setIsEdit(false)
        toast.success('Update Profile Successfully')
        router.reload()
        return
      }
      toast.error(response.data.message || 'Update failed')
    }
  }

  const solanaSign = async () => {
    const encodedMessage = new TextEncoder().encode(process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE)
    try {
      // @ts-ignore
      const signedMessage = await window?.solana.request({
        method: 'signMessage',
        params: {
          message: encodedMessage,
          display: 'utf8'
        }
      })
      return signedMessage
    } catch (e: any) {
      toast.error(e?.message)
    }
  }

  const getSolanaProvider = () => {
    if ('solana' in window) {
      // @ts-ignore
      const provider = window?.solana
      if (provider.isPhantom) {
        return provider
      }
    }
  }

  const handleSolanaDisconnect = () => {
    // @ts-ignore
    if (!window.solana) {
      return
    }
    // @ts-ignore
    window.solana.request({ method: 'disconnect' })
    setNewSolanaWallet('')
  }

  const handleSolanaConnect = async () => {
    const provider = getSolanaProvider()
    if (!provider) {
      toast.error('Phantom extension is not installed!')
      return
    }
    try {
      let resp
      resp = await provider.connect()
      if (!resp) {
        resp = await provider.request({ method: 'connect' })
      }
      setNewSolanaWallet(resp.publicKey.toString())
    } catch (err) {
      toast.error('User rejected the request!')
    }
  }

  const loadingTier = tiers?.state?.data === null || tiers?.state.loading
  const isStaked = +tiers?.state?.data?.tier > 0
  const isKyc = !loadingUserInfo && userInfo?.is_kyc === 1

  return <div className='py-10 px-9'>
    <div className='flex items-center justify-between'>
      <h3 className='uppercase font-bold text-2xl mb-7'>My Profile</h3>
      {isEdit
        ? <div className="flex">
          <button className='flex gap-2 items-center' onClick={() => setIsEdit(false)}>
            <span className='uppercase font-bold text-13px text-gamefiRed outline-none focus:outline-none'>Cancel</span>
          </button>
          <button className='flex gap-2 items-center ml-3 bg-gamefiGreen-700 px-8 py-2 rounded-sm clipped-t-r' onClick={() => handleSave()}>
            <span className='uppercase font-bold text-13px text-gamefiDark-900 outline-none focus:outline-none'>Save</span>
          </button>
        </div>
        : <button className='flex gap-2 items-center' onClick={() => handleEdit()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L13 6" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 1L15 4L5 14L1 15L2 11L12 1Z" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className='uppercase font-bold text-13px text-gamefiGreen-700 outline-none focus:outline-none'>Edit profile</span>
        </button>}
    </div>
    <div className='w-full flex xl:flex-row flex-col gap-5 mb-16'>
      <div className={clsx(styles.box, 'xl:w-2/3 w-full p-7 rounded-sm')}>
        <h3 className='font-bold text-base mb-2 uppercase'>Wallet Addresses</h3>
        <div className='font-casual text-sm mb-7'>
          Your wallets linked to GameFi are listed below.
          Please click "Edit Profile" to connect / disconnect the sub-wallets, which will be used based on the pool's network.
        </div>
        <div className='mb-7'>
          <h4 className='text-base font-bold mb-1 uppercase'>MAIN wallet Address</h4>
          <div className={clsx(styles.walletBox, 'py-3 pl-2 pr-4 rounded-sm flex items-center')}>
            <div className={clsx(styles.mainWalletIcons, 'flex items-center mr-4')}>
              <div className='w-8 h-8 rounded-full'>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="17" cy="17" r="16" fill="#546BC7" stroke="#282A33" strokeWidth="2" />
                  <path d="M17.1092 8.6875L17 9.07713V20.3833L17.1092 20.4978L22.1072 17.3956L17.1092 8.6875Z" fill="white" fillOpacity="0.3" />
                  <path d="M17 8.6875L11.8928 17.3955L17 20.4978V15.0101V8.6875Z" fill="white" fillOpacity="0.5" />
                  <path d="M17.0621 21.3416L17 21.4198V25.4179L17.0621 25.6052L22.1072 18.2637L17.0621 21.3416Z" fill="white" fillOpacity="0.3" />
                  <path d="M17 25.6052V21.3416L11.8928 18.2637L17 25.6052Z" fill="white" fillOpacity="0.5" />
                  <path d="M17 20.4976L22.1072 17.4301L17 15.0713V20.4976Z" fill="white" fillOpacity="0.6" />
                  <path d="M11.8928 17.4301L17 20.4976V15.0713L11.8928 17.4301Z" fill="white" fillOpacity="0.3" />
                </svg>
              </div>
              <div className='w-8 h-8 rounded-full'>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="17" cy="17" r="16" fill="#FFD22A" stroke="#282A33" strokeWidth="2" />
                  <path d="M13.7314 15.6582L17 12.3896L20.2701 15.6597L22.1719 13.7578L17 8.58594L11.8296 13.7563L13.7314 15.6581L13.7314 15.6582ZM8.58474 17.0012L10.4866 15.099L12.3884 17.0008L10.4865 18.9027L8.58474 17.0012ZM13.7314 18.3443L17 21.6127L20.27 18.3428L22.1729 20.2436L22.1719 20.2446L17 25.4164L11.8296 20.2461L11.827 20.2434L13.7316 18.3441L13.7314 18.3443ZM21.6115 17.002L23.5134 15.1001L25.4152 17.0019L23.5133 18.9038L21.6115 17.002Z" fill="black" />
                  <path d="M18.9291 17.0002H18.9299L17.0002 15.0703L15.5739 16.4963L15.41 16.6602L15.0721 16.9982L15.0694 17.0008L15.0721 17.0036L17.0002 18.932L18.9301 17.0022L18.931 17.0011L18.9293 17.0002" fill="black" />
                </svg>
              </div>
              <div className='w-8 h-8 rounded-full'>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="17" cy="17" r="16" fill="#AA83EB" stroke="#282A33" strokeWidth="2" />
                  <path d="M21.399 14.6044C21.2395 14.5196 21.0615 14.4752 20.8807 14.4752C20.7 14.4752 20.522 14.5196 20.3625 14.6044L17.9441 16.0252L16.3031 16.9293L13.9279 18.35C13.7684 18.4348 13.5904 18.4792 13.4097 18.4792C13.2289 18.4792 13.0509 18.4348 12.8914 18.35L11.0345 17.2306C10.8767 17.1378 10.7459 17.0057 10.6551 16.8471C10.5642 16.6886 10.5163 16.5091 10.5162 16.3265V14.1739C10.5176 13.9915 10.566 13.8126 10.6567 13.6542C10.7475 13.4959 10.8776 13.3635 11.0345 13.2698L12.8914 12.1934C13.0509 12.1086 13.2289 12.0643 13.4097 12.0643C13.5904 12.0643 13.7684 12.1086 13.9279 12.1934L15.7849 13.3128C15.9426 13.4056 16.0734 13.5378 16.1642 13.6963C16.2551 13.8549 16.303 14.0343 16.3031 14.2169V15.6377L17.9441 14.6905V13.2267C17.9428 13.0443 17.8944 12.8654 17.8036 12.7071C17.7129 12.5487 17.5828 12.4163 17.4259 12.3226L13.9711 10.2991C13.8116 10.2143 13.6336 10.1699 13.4528 10.1699C13.2721 10.1699 13.0941 10.2143 12.9346 10.2991L9.39341 12.3656C9.23476 12.4463 9.10205 12.5698 9.01042 12.7221C8.91879 12.8743 8.87193 13.0492 8.87519 13.2267V17.2737C8.87656 17.4561 8.92495 17.635 9.0157 17.7933C9.10645 17.9517 9.23652 18.0841 9.39341 18.1778L12.8914 20.2013C13.0509 20.2861 13.2289 20.3305 13.4097 20.3305C13.5904 20.3305 13.7684 20.2861 13.9279 20.2013L16.3031 18.8236L17.9441 17.8764L20.3193 16.4987C20.4788 16.4139 20.6568 16.3696 20.8376 16.3696C21.0183 16.3696 21.1963 16.4139 21.3558 16.4987L23.2128 17.5751C23.3705 17.6679 23.5013 17.8001 23.5921 17.9586C23.683 18.1172 23.7309 18.2966 23.731 18.4792V20.6319C23.7296 20.8142 23.6812 20.9931 23.5905 21.1515C23.4997 21.3098 23.3696 21.4422 23.2128 21.536L21.399 22.6123C21.2395 22.6971 21.0615 22.7415 20.8807 22.7415C20.7 22.7415 20.522 22.6971 20.3625 22.6123L18.5055 21.536C18.3478 21.4432 18.217 21.311 18.1262 21.1524C18.0353 20.9939 17.9874 20.8145 17.9873 20.6319V19.2541L16.3463 20.2013V21.6221C16.3476 21.8044 16.396 21.9834 16.4868 22.1417C16.5775 22.3 16.7076 22.4324 16.8645 22.5262L20.3625 24.5497C20.522 24.6345 20.7 24.6789 20.8807 24.6789C21.0615 24.6789 21.2395 24.6345 21.399 24.5497L24.897 22.5262C25.0547 22.4334 25.1855 22.3012 25.2764 22.1427C25.3673 21.9841 25.4151 21.8047 25.4152 21.6221V17.532C25.4138 17.3497 25.3655 17.1707 25.2747 17.0124C25.1839 16.8541 25.0539 16.7217 24.897 16.6279L21.399 14.6044Z" fill="white" />
                </svg>

              </div>
            </div>
            <div className='flex justify-between gap-2 w-full items-center'>
              <span className='font-casual text-13px text-white/80 break-words break-all text-ellipsis'>{account}</span>
              <span className='cursor-pointer' onClick={() => onCopy(account)}>
                <DocumentCopyIcon />
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className='text-base font-bold mb-1 flex items-center'><span className='uppercase'>Sub-Wallet Address</span>&nbsp;<span className='font-casual text-sm font-normal text-white/60'>(Optional)</span></h4>
          <div className={clsx(styles.walletBox, 'flex gap-2 items-center mb-2 py-3 pl-2 pr-4 rounded-sm')}>
            <div className='w-8 h-8 rounded-full bg-black'>
              <SolanaIcon />
            </div>
            {
              isEdit
                ? <div className='flex justify-between gap-2 w-full items-center'>
                  <div className='grid'>
                    <span className='font-bold text-xs uppercase text-white/50'>Solana Wallet</span>
                    {
                      newSolanaWallet
                        ? <span className='font-casual text-13px text-white/80 break-words break-all text-ellipsis'>{newSolanaWallet}</span>
                        : <span className='text-white/40 italic text-13px font-casual'>Not connected</span>
                    }
                  </div>
                  {newSolanaWallet
                    ? <span className='cursor-pointer text-gamefiRed' onClick={() => handleSolanaDisconnect()}>
                      Disconnect
                    </span>
                    : <span className='cursor-pointer text-gamefiGreen-700' onClick={() => handleSolanaConnect()}>
                      Connect
                    </span>
                  }
                </div>
                : <div className='flex justify-between gap-2 w-full items-center'>
                  <div className='grid'>
                    <span className='font-bold text-xs uppercase text-white/50'>Solana Wallet</span>
                    {
                      userInfo?.solana_address
                        ? <span className='font-casual text-13px text-white/80 break-words break-all text-ellipsis'>{userInfo?.solana_address}</span>
                        : <span className='text-white/40 italic text-13px font-casual'>Not connected</span>
                    }
                  </div>
                  {userInfo?.solana_address &&
                    <span className='cursor-pointer' onClick={() => onCopy(userInfo?.solana_address)}>
                      <DocumentCopyIcon />
                    </span>
                  }
                </div>
            }
          </div>
          <div className={clsx(styles.walletBox, 'flex gap-2 items-center mb-2 py-3 pl-2 pr-4 rounded-sm')}>
            <div className='w-8 h-8 rounded-full bg-black'>
              <TerraIcon />
            </div>
            <div className='flex justify-between gap-2 w-full items-center'>
              <div className='grid'>
                <span className='font-bold text-xs uppercase text-white/50'>Terra Wallet</span>
                {
                  userInfo?.terra_address
                    ? <span className='font-casual text-13px text-white/80 break-words break-all text-ellipsis'>{userInfo?.terra_address}</span>
                    : <span className='text-white/40 italic text-13px font-casual'>Not connected</span>
                }
              </div>
              {userInfo?.terra_address &&
                <span className='cursor-pointer' onClick={() => onCopy(userInfo?.terra_address)}>
                  <DocumentCopyIcon />
                </span>
              }
            </div>
          </div>
        </div>
      </div>
      <div className={clsx(styles.box, 'xl:w-1/3 w-ful rounded-sm p-7 h-fit')}>
        <h3 className='font-bold text-base mb-4 uppercase'>Wallet Addresses</h3>
        <div className='grid grid-cols-2 items-center justify-between gap-2 mb-4'>
          <label className='text-sm font-casual' htmlFor="">KYC Status</label>
          {/* {
            notVerifyKyc && <div className='flex gap-2 justify-end items-center'>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.7 0.3C13.3 -0.1 12.7 -0.1 12.3 0.3L7 5.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L5.6 7L0.3 12.3C-0.1 12.7 -0.1 13.3 0.3 13.7C0.5 13.9 0.7 14 1 14C1.3 14 1.5 13.9 1.7 13.7L7 8.4L12.3 13.7C12.5 13.9 12.8 14 13 14C13.2 14 13.5 13.9 13.7 13.7C14.1 13.3 14.1 12.7 13.7 12.3L8.4 7L13.7 1.7C14.1 1.3 14.1 0.7 13.7 0.3Z" fill="#DE4343" />
              </svg>
              <span className={clsx(styles.notKyc, 'uppercase text-sm font-semibold font-casual')}>UNVERIFIED</span>
            </div>
          } */}
          {
            isStaked && isKyc && <div className='flex gap-2 justify-end items-center'>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1.6L15.2 0C8.3 2 4.8 6.4 4.8 6.4L1.6 4L0 5.6L4.8 12C8.5 5.1 16 1.6 16 1.6Z" fill="#6CDB00" />
              </svg>
              <span className='uppercase text-sm text-gamefiGreen-700 font-semibold font-casual'>VERIFIED</span>
            </div>
          }
          {
            isStaked && !isKyc && <div className={clsx(styles.btnclippart, 'bg-gamefiGreen-700 py-2 px-5 text-black uppercase font-bold text-13px rounded-sm text-center')}>KYC Now</div>
          }
        </div>
        {
          userInfo?.user_telegram && <div className='grid grid-cols-2 items-center justify-between mb-4'>
            <label className='text-sm font-casual' htmlFor="">Twitter Account</label>
            {isEdit
              ? <input
                type="text"
                className="bg-gamefiDark-900 text-sm rounded-sm border-none outline-none focus:outline-none focus:border-none"
                value={newTwitter}
                onChange={(e) => setNewTwitter(e?.target?.value)}
              ></input>
              : <div className='text-sm font-casual text-white/50 text-right'>{userInfo?.user_telegram}</div>}
          </div>
        }
        {
          userInfo?.user_twitter && <div className='grid grid-cols-2 items-center justify-between mb-4'>
            <label className='text-sm font-casual' htmlFor="">Telegram Account</label>
            {isEdit
              ? <input
                type="text"
                className="bg-gamefiDark-900 text-sm rounded-sm border-none outline-none focus:outline-none focus:border-none"
                value={newTelegram}
                onChange={(e) => setnewTelegram(e?.target?.value)}
              ></input>
              : <div className='text-sm font-casual text-white/50 text-right'>{userInfo?.user_twitter}</div>}
          </div>
        }
        {
          !isStaked && !loadingTier && <div>
            <div className='font-casual mb-8 text-sm text-white/80'>You must stake $GAFI to achieve min Rank before KYC.</div>
            <button className={clsx(styles.btnclippart, 'bg-gamefiGreen-700 uppercase text-13px w-full text-center py-2 px-2 text-black font-bold mb-6')}>
              Stake Now
            </button>
            <a href="" className={clsx(styles.link, 'text-sm font-bold text-center block font-casual')}>Learn about Ranking System</a>
          </div>
        }
      </div>
    </div>
    <div>
      <h3 className='font-bold text-2xl uppercase mb-2'>Basic steps to get started with <a href="">GameFi.org</a></h3>
      <div className='text-sm font-casual text-white/80 mb-6'>Follow these steps to join IGO / INO pools on GameFi.org launchpad</div>
      <div className={clsx(styles.steps)}>
        <div className={clsx(styles.step)}>
          <div className={clsx(styles.index, 'text-2xl font-bold rounded-full grid place-items-center')}>1</div>
          <h5 className='font-bold text-base uppercase mb-2'>Stake $GAFI to upgrade your Rank</h5>
          <div className='text-sm text-white/80 font-casual mb-6'>
            Check out GameFi's ranking system: Legend, Pro, Elite, Rookie. <a href='https://faq.gamefi.org/#1.2.-stake' rel='noreferrer' target={'_blank'} className={clsx(styles.link, 'font-bold text-sm font-casual')}>Read more</a>
          </div>
          <button className={clsx(styles.btnclippart, 'bg-gamefiGreen-700 text-black uppercase py-2 px-3 w-28 text-13px font-bold rounded-sm')}>Stake Now</button>
        </div>
        <div className={clsx(styles.step)}>
          <div className={clsx(styles.index, 'text-2xl font-bold rounded-full grid place-items-center')}>2</div>
          <h5 className='font-bold text-base uppercase mb-2'>Complete KYC</h5>
          <div className='text-sm text-white/80 font-casual mb-6'>
            You must complete KYC on Blockpass to be able to join IGO/INO pools.
          </div>
          <a className={clsx(styles.link, 'font-bold text-sm font-casual')} href='https://faq.gamefi.org/#_1-3-kyc' rel='noreferrer' target={'_blank'}>How to KYC via Blockpass</a>
        </div>
        <div className={clsx(styles.step)}>
          <div className={clsx(styles.index, 'text-2xl font-bold rounded-full grid place-items-center')}>3</div>
          <h5 className='font-bold text-base uppercase mb-2'>Apply Whitelist or Join Competition</h5>
          <div className='text-sm text-white/80 font-casual mb-6'>
            Apply Whitelist or complete Gleam tasks to join IGO/Community pools
          </div>
          <a href='https://faq.gamefi.org/#i.-how-to-join-igos' rel='noreferrer' target={'_blank'} className={clsx(styles.link, 'font-bold text-sm font-casual')}>How to join IGO/INO pools</a>
        </div>
      </div>
    </div>
  </div>
}

export default Profile
