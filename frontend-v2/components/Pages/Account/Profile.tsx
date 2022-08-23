/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo, useState, useCallback } from 'react'
import { DocumentCopyIcon, SolanaIcon, TerraIcon } from 'components/Base/Icon'
import { useAppContext } from '@/context'
import { useMyWeb3 } from '@/components/web3/context'
import toast from 'react-hot-toast'
import LoadingOverlay from '@/components/Base/LoadingOverlay'
import useWalletSignature, { MESSAGE_SIGNATURE } from 'hooks/useWalletSignature'
import { fetcher, useProfile } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import Link from 'next/link'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import { normalize } from '@/graphql/utils'
import { COMMENT_PAGE_SIZE, REVIEW_PAGE_SIZE, REVIEW_STATUS } from '@/components/Pages/Account/Review/TabReviews'

import { useRouter } from 'next/router'
import UserProfile from '@/components/Pages/Account/Review/UserProfile'
import HubProvider, { useHubContext } from '@/context/hubProvider'
import { IS_TESTNET } from '@/components/web3/connectors'
import copy from 'copy-to-clipboard'

const LIST_SOCIAL = [
  'twitter',
  'telegram',
  'discord',
  'youtube',
  'facebook'
]

const Component = () => {
  const [data, setData] = useState({})
  const { accountHub } = useHubContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { account } = useMyWeb3()
  const blockpassURL = IS_TESTNET ? process.env.NEXT_PUBLIC_BLOCKPASS_97 : process.env.NEXT_PUBLIC_BLOCKPASS_56
  const { profile, loading: loadingProfile, load: loadProfile, errorMessage } = useProfile(account)
  const { tierMine, loadMyStaking } = useAppContext()

  const { signMessage } = useWalletSignature()
  const [editing, setEditing] = useState(false)
  const [signature, setSignature] = useState('')
  const [loadingSocial, setLoadingSocial] = useState(true)
  const [userRankAndQuests, setUserRankAndQuests] = useState({})
  const { social }: any = userRankAndQuests || {}
  const [telegram] = useState('')
  const [email, setEmail] = useState(accountHub?.email || '')
  const [twitter] = useState('')
  const [walletSolana, setWalletSolana] = useState('')
  const [walletTerra, setWalletTerra] = useState('')

  const _status = useMemo(() => {
    const { status = REVIEW_STATUS.PUBLISHED } = router.query
    const _queryStatus = Array.isArray(status) ? status[0] : status
    const isValidStatus = Object.values(REVIEW_STATUS).includes(_queryStatus)
    return isValidStatus ? status : REVIEW_STATUS.PUBLISHED
  }, [router.query])
  useEffect(() => {
    if (accountHub?.email) {
      setEmail(accountHub?.email)
    }
  }, [accountHub?.email])

  useEffect(() => {
    loadMyStaking()
  }, [loadMyStaking])

  useEffect(() => {
    if (account) {
      fetcher('/api/account/ranks/getUserRankAndQuests', {
        method: 'POST',
        body: JSON.stringify({ walletId: account })
      })
        .then((res) => {
          setLoadingSocial(false)
          setUserRankAndQuests(res.data)
        })
        .catch(() => setLoadingSocial(false))
    }
  }, [account])

  useEffect(() => {
    setLoading(true)
    const { id } = accountHub || {}
    if (!id) {
      setLoading(false)
      setData({})
      return
    }

    fetcher('/api/hub/reviews', {
      method: 'POST',
      body: JSON.stringify({
        variables: {
          reviewFilterValue: {
            author: { id: { eq: id } },
            status: { eq: _status }
          },
          reviewPagination: {
            pageSize: REVIEW_PAGE_SIZE
          },
          commentFilterValue: {
            user: { id: { eq: id } },
            review: {
              id: {
                ne: null
              }
            }
          },
          commentPagination: {
            pageSize: COMMENT_PAGE_SIZE
          },
          userId: id
        },
        query: 'GET_REVIEWS_AND_COMMENTS_BY_USER'
      })
    }).then((res) => {
      setData(normalize(res.data))
    }).catch(() => { })
      .finally(() => setLoading(false))
  }, [accountHub, _status, router])

  useEffect(() => {
    if (editing) {
      setWalletSolana(profile.solana_address || '')
      setWalletTerra(profile.terra_address || '')
      return
    }

    setWalletSolana('')
    setWalletTerra('')
  }, [editing, profile])

  const wSolana = useMemo(() => {
    if (loadingProfile) {
      return 'Loading...'
    }

    if (!editing) {
      return profile.solana_address || ''
    }

    return walletSolana || ''
  }, [editing, walletSolana, profile, loadingProfile])
  const wTerra = useMemo(() => {
    if (loadingProfile) {
      return 'Loading...'
    }

    if (!editing) {
      return profile.terra_address || ''
    }

    return walletTerra || ''
  }, [editing, walletTerra, profile, loadingProfile])

  const handleEdit = useCallback(() => {
    if (signature) {
      setEditing(true)
      return
    }

    signMessage().then(data => {
      if (!data) {
        return
      }

      setSignature(data.toString())
      setEditing(true)
    }).catch(err => {
      console.debug(err)
      toast.error('Could not sign the authentication message')
    })
  }, [signMessage, setEditing, signature])

  const handleSave = useCallback(async () => {
    const response = await fetcher(`${API_BASE_URL}/user/update-profile`, {
      headers: {
        msgSignature: MESSAGE_SIGNATURE,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signature,
        wallet_address: account,
        solana_address: walletSolana ?? undefined,
        terra_address: walletTerra ?? undefined,
        user_telegram: telegram || undefined,
        user_twitter: twitter || undefined
      }),
      method: 'PUT'
    })

    if (!response) {
      toast.error('Could not update your profile')
      return
    }

    if (response.status !== 200) {
      toast.error('Could not update your profile')
      return
    }

    toast.success('Update profile successfully')
    loadProfile()
    setEditing(false)
  }, [signature, account, loadProfile, walletSolana, walletTerra, telegram, twitter])

  const published = get(data, 'publishedReview.meta.pagination.total', 0)
  const draft = get(data, 'draftReview.meta.pagination.total', 0)
  const pending = get(data, 'pendingReview.meta.pagination.total', 0)
  const declined = get(data, 'declinedReview.meta.pagination.total', 0)
  const totalReviewOfAllStatus = Number(published) + Number(draft) + Number(pending) + Number(declined)
  const userData = get(data, 'user') || {}

  const renderVerifyStatus = () => {
    let element: any
    switch (true) {
    case !!profile.verified:
      element = <>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1.6L15.2 0C8.3 2 4.8 6.4 4.8 6.4L1.6 4L0 5.6L4.8 12C8.5 5.1 16 1.6 16 1.6Z" fill="#6CDB00" />
        </svg>
        <span className="uppercase text-xs lg:text-sm font-semibold font-casual text-gamefiGreen-700">{profile.verifiedStatus}</span>
      </>
      break

    case !!tierMine?.id:
      element = (<>
        <a href={blockpassURL} target="_blank" className="block w-full cursor-pointer clipped-t-r bg-gamefiGreen-700 py-2 px-5 text-black uppercase font-bold text-13px rounded-sm text-center" rel="noreferrer">Verify Now</a>
      </>)
      break

    default:
      element = <>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.7 0.3C13.3 -0.1 12.7 -0.1 12.3 0.3L7 5.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L5.6 7L0.3 12.3C-0.1 12.7 -0.1 13.3 0.3 13.7C0.5 13.9 0.7 14 1 14C1.3 14 1.5 13.9 1.7 13.7L7 8.4L12.3 13.7C12.5 13.9 12.8 14 13 14C13.2 14 13.5 13.9 13.7 13.7C14.1 13.3 14.1 12.7 13.7 12.3L8.4 7L13.7 1.7C14.1 1.3 14.1 0.7 13.7 0.3Z" fill="#DE4343" />
        </svg>
        <span className="uppercase text-xs lg:text-sm font-semibold font-casual text-red-500">{profile.verifiedStatus}</span>
      </>
      break
    }
    return element
  }

  return (
    <div className='py-10 px-4 xl:px-9 2xl:pr-32'>
      {loading
        ? <div className="">
          <LoadingOverlay loading />
        </div>
        : !isEmpty(data) && <div className="mb-10"><UserProfile editable data={userData} email={email} totalReviewOfAllStatus={totalReviewOfAllStatus} tierMine={tierMine} /></div>
      }
      <div className="">
        <div className="flex items-center mb-6">
          <h3 className='hidden lg:block uppercase font-bold text-2xl mr-4'>Wallet Info</h3>
          {profile
            ? <>{editing
              ? <div className="flex">
                <button className='flex gap-2 items-center' onClick={() => setEditing(false)}>
                  <span className='uppercase font-bold text-13px outline-none focus:outline-none'>Cancel</span>
                </button>
                <button className='flex gap-2 items-center ml-3 bg-gamefiGreen-700 px-6 py-1 rounded-sm clipped-t-r' onClick={() => {
                  handleSave()
                }}>
                  <span className='uppercase font-bold text-13px text-gamefiDark-900 outline-none focus:outline-none'>Save</span>
                </button>
              </div>
              : <button className='flex gap-2 items-center' onClick={handleEdit}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L13 6" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 1L15 4L5 14L1 15L2 11L12 1Z" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className='uppercase font-bold text-13px text-gamefiGreen-700 outline-none focus:outline-none hover:underline'>Edit info</span>
              </button>
            }</>
            : null
          }
        </div>
        <div className='w-full flex lg:flex-row flex-col gap-5 mb-16'>
          <div className="lg:w-2/3 w-full rounded-sm p-4 xl:p-7 flex-1 bg-gamefiDark-800 clipped-t-r">
            <h3 className='font-bold text-base mb-2 uppercase'>Wallet Addresses</h3>
            <div className='font-casual text-sm mb-7'>
              Your wallets connected to GameFi.org are listed below.
              In case you want to modify your sub-wallets, please click <strong>Edit Profile</strong>.
            </div>
            <div className='mb-7'>
              <h4 className='text-base font-bold mb-1 uppercase'>MAIN wallet Address</h4>
              <div className="bg-gamefiDark-700 py-3 pl-2 pr-4 rounded-sm flex items-center">
                <div className="flex items-center mr-4">
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
                  <div className='w-8 h-8 rounded-full -ml-1.5'>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="17" cy="17" r="16" fill="#FFD22A" stroke="#282A33" strokeWidth="2" />
                      <path d="M13.7314 15.6582L17 12.3896L20.2701 15.6597L22.1719 13.7578L17 8.58594L11.8296 13.7563L13.7314 15.6581L13.7314 15.6582ZM8.58474 17.0012L10.4866 15.099L12.3884 17.0008L10.4865 18.9027L8.58474 17.0012ZM13.7314 18.3443L17 21.6127L20.27 18.3428L22.1729 20.2436L22.1719 20.2446L17 25.4164L11.8296 20.2461L11.827 20.2434L13.7316 18.3441L13.7314 18.3443ZM21.6115 17.002L23.5134 15.1001L25.4152 17.0019L23.5133 18.9038L21.6115 17.002Z" fill="black" />
                      <path d="M18.9291 17.0002H18.9299L17.0002 15.0703L15.5739 16.4963L15.41 16.6602L15.0721 16.9982L15.0694 17.0008L15.0721 17.0036L17.0002 18.932L18.9301 17.0022L18.931 17.0011L18.9293 17.0002" fill="black" />
                    </svg>
                  </div>
                  <div className='w-8 h-8 rounded-full -ml-1.5'>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="17" cy="17" r="16" fill="#AA83EB" stroke="#282A33" strokeWidth="2" />
                      <path d="M21.399 14.6044C21.2395 14.5196 21.0615 14.4752 20.8807 14.4752C20.7 14.4752 20.522 14.5196 20.3625 14.6044L17.9441 16.0252L16.3031 16.9293L13.9279 18.35C13.7684 18.4348 13.5904 18.4792 13.4097 18.4792C13.2289 18.4792 13.0509 18.4348 12.8914 18.35L11.0345 17.2306C10.8767 17.1378 10.7459 17.0057 10.6551 16.8471C10.5642 16.6886 10.5163 16.5091 10.5162 16.3265V14.1739C10.5176 13.9915 10.566 13.8126 10.6567 13.6542C10.7475 13.4959 10.8776 13.3635 11.0345 13.2698L12.8914 12.1934C13.0509 12.1086 13.2289 12.0643 13.4097 12.0643C13.5904 12.0643 13.7684 12.1086 13.9279 12.1934L15.7849 13.3128C15.9426 13.4056 16.0734 13.5378 16.1642 13.6963C16.2551 13.8549 16.303 14.0343 16.3031 14.2169V15.6377L17.9441 14.6905V13.2267C17.9428 13.0443 17.8944 12.8654 17.8036 12.7071C17.7129 12.5487 17.5828 12.4163 17.4259 12.3226L13.9711 10.2991C13.8116 10.2143 13.6336 10.1699 13.4528 10.1699C13.2721 10.1699 13.0941 10.2143 12.9346 10.2991L9.39341 12.3656C9.23476 12.4463 9.10205 12.5698 9.01042 12.7221C8.91879 12.8743 8.87193 13.0492 8.87519 13.2267V17.2737C8.87656 17.4561 8.92495 17.635 9.0157 17.7933C9.10645 17.9517 9.23652 18.0841 9.39341 18.1778L12.8914 20.2013C13.0509 20.2861 13.2289 20.3305 13.4097 20.3305C13.5904 20.3305 13.7684 20.2861 13.9279 20.2013L16.3031 18.8236L17.9441 17.8764L20.3193 16.4987C20.4788 16.4139 20.6568 16.3696 20.8376 16.3696C21.0183 16.3696 21.1963 16.4139 21.3558 16.4987L23.2128 17.5751C23.3705 17.6679 23.5013 17.8001 23.5921 17.9586C23.683 18.1172 23.7309 18.2966 23.731 18.4792V20.6319C23.7296 20.8142 23.6812 20.9931 23.5905 21.1515C23.4997 21.3098 23.3696 21.4422 23.2128 21.536L21.399 22.6123C21.2395 22.6971 21.0615 22.7415 20.8807 22.7415C20.7 22.7415 20.522 22.6971 20.3625 22.6123L18.5055 21.536C18.3478 21.4432 18.217 21.311 18.1262 21.1524C18.0353 20.9939 17.9874 20.8145 17.9873 20.6319V19.2541L16.3463 20.2013V21.6221C16.3476 21.8044 16.396 21.9834 16.4868 22.1417C16.5775 22.3 16.7076 22.4324 16.8645 22.5262L20.3625 24.5497C20.522 24.6345 20.7 24.6789 20.8807 24.6789C21.0615 24.6789 21.2395 24.6345 21.399 24.5497L24.897 22.5262C25.0547 22.4334 25.1855 22.3012 25.2764 22.1427C25.3673 21.9841 25.4151 21.8047 25.4152 21.6221V17.532C25.4138 17.3497 25.3655 17.1707 25.2747 17.0124C25.1839 16.8541 25.0539 16.7217 24.897 16.6279L21.399 14.6044Z" fill="white" />
                    </svg>

                  </div>
                </div>
                <div className='flex justify-between gap-2 w-full items-center'>
                  <span className='font-casual text-13px text-white/80 break-words break-all text-ellipsis'>{account}</span>
                  <span className='cursor-pointer' onClick={() => copy(account)}>
                    <DocumentCopyIcon />
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-base font-bold mb-1 flex items-center'><span className='uppercase'>Sub-Wallet Address</span>&nbsp;<span className='font-casual text-sm font-normal text-white/60'>(Optional)</span></h4>
              <div className="bg-gamefiDark-700 flex gap-2 items-center mb-2 py-3 pl-2 pr-4 rounded-sm">
                <div className='w-8 h-8 rounded-full bg-black flex-none'>
                  <SolanaIcon />
                </div>
                <div className="flex items-center w-full">
                  <div className="w-full">
                    <div className='font-bold text-xs uppercase text-white/70'>Solana Wallet</div>
                    <input type="text" value={!editing && !wSolana ? 'Not Connected' : wSolana} disabled={!editing} className={`font-casual text-xs leading-4 w-full py-1 border-0 border-b border-dashed ${!wSolana ? 'text-white/40 italic' : 'text-white/80'} ${editing ? 'bg-gamefiDark-800 border-white px-1' : 'bg-transparent border-transparent px-0'}`} onChange={e => setWalletSolana(e.target.value)} placeholder="Enter your Solana wallet address" />
                  </div>
                  {!editing && wSolana && <div className="ml-4 cursor-pointer flex items-center" onClick={() => copy(profile?.solana_address)}><DocumentCopyIcon /></div>}
                </div>
              </div>
              <div className="bg-gamefiDark-700 flex gap-2 items-center mb-2 py-3 pl-2 pr-4 rounded-sm">
                <div className='w-8 h-8 rounded-full bg-black flex-none'>
                  <TerraIcon />
                </div>
                <div className="flex items-center w-full">
                  <div className="w-full">
                    <span className='font-bold text-xs uppercase text-white/70'>Terra Wallet</span>
                    <input type="text" value={!editing && !wTerra ? 'Not Connected' : wTerra} disabled={!editing} className={`font-casual text-xs leading-4 w-full py-1 border-0 border-b border-dashed ${!wTerra ? 'text-white/40 italic' : 'text-white/80'} ${editing ? 'bg-gamefiDark-800 border-white px-1' : 'bg-transparent border-transparent px-0'}`} onChange={e => setWalletTerra(e.target.value)} placeholder="Enter your Terra wallet address" />
                  </div>
                  {!editing && wTerra && <div className="ml-4 cursor-pointer flex items-center" onClick={() => copy(profile?.terra_address)}><DocumentCopyIcon /></div>}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 w-full rounded-sm p-4 xl:p-7 h-fit lg:max-w-sm bg-gamefiDark-800 clipped-t-r">
            <h3 className='font-bold text-base mb-4 uppercase'>Account Information</h3>
            {!account
              ? <div className='font-casual mt-4 text-sm text-white/60'>Please connect your wallet</div>
              : <>
                <div className='flex items-center justify-between gap-x-2 gap-y-4 mb-4'>
                  <label className='text-xs lg:text-sm font-casual leading-7 lg:leading-7'>Verification Status</label>
                  <div className='flex gap-2 justify-end items-center'>
                    {loadingProfile && <span className="uppercase text-xs lg:text-sm font-semibold font-casual">{errorMessage || 'Loading...'}</span>}
                    {!loadingProfile && <>
                      {renderVerifyStatus()}
                    </>
                    }
                  </div>
                </div>
                {/* <div className='flex items-center justify-between gap-x-2 gap-y-4 mb-4'>
                  <label className='text-xs lg:text-sm font-casual leading-7 lg:leading-7'>Your Rank</label>
                  <div className='flex gap-2 justify-end items-center'>
                    <span className={`uppercase text-xs lg:text-sm font-semibold font-casual ${!tierMine?.id ? 'text-yellow-300' : ''}`}>{tierMine?.name || 'Loading...'}</span>
                  </div>
                </div> */}

                {/* {!loadingProfile && !profile.verified && !!tierMine?.id && <>
                  <a href={blockpassURL} target="_blank" className="block w-full cursor-pointer clipped-t-r bg-gamefiGreen-700 py-2 px-5 text-black uppercase font-bold text-13px rounded-sm text-center" rel="noreferrer">KYC Now</a>
                  <div className='font-casual mt-4 text-xs text-white/60'>If you submitted your verification, please wait while we are reviewing it</div>
                </>
                } */}
                {!loadingProfile && !tierMine?.id &&
                  <>
                    <div className="mb-8 text-sm font-casual text-white/80">
                      You must stake $GAFI to achieve min Rank before KYC.
                    </div>
                    <Link href="/staking" passHref={true}><a className="mb-6 block w-full cursor-pointer clipped-t-r bg-gamefiGreen-700 py-2 px-5 text-black uppercase font-bold text-13px rounded-sm text-center" rel="noreferrer">Stake Now</a></Link>
                    <div className="text-center mb-6">
                      <a href='https://faq.gamefi.org/#1.2.-stake' rel='noreferrer' target="_blank" className="font-semibold text-xs md:text-sm font-casual text-gamefiGreen-700 hover:text-gamefiGreen-500 hover:underline mt-6">Learn about Ranking System</a>
                    </div>
                  </>
                }
                {(!!account && !loadingSocial) &&
                  <div className="">
                    <div className="flex justify-between mb-3 items-center">
                      <div className="text-xs lg:text-sm font-casual leading-7 lg:leading-7 capitalize mr-10 xl:mr-12">Email</div>
                      <input
                        className="disabled:cursor-not-allowed bg-[#303035] border border-[#3C3C42] placeholder-white placeholder-opacity-30 font-casual text-sm rounded-sm px-4 py-1.5 w-full focus-visible:border-gamefiDark-350"
                        name="email"
                        disabled={accountHub?.confirmed}
                        type="email"
                        placeholder="Your email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {LIST_SOCIAL.map(v => {
                      const value = !isEmpty(social) && (social[v]?.username || social[v]?.id)
                      return <div className="flex justify-between mb-3" key={v}>
                        <div className="text-xs lg:text-sm font-casual leading-7 lg:leading-7 capitalize">{v}</div>
                        {value
                          ? <div className="text-xs lg:text-sm font-casual leading-7 lg:leading-7 text-white/50">{value}</div>
                          : <div className="">
                            <Link href="/account/gxp">
                              <a target="_blank" className="block w-full cursor-pointer clipped-t-r bg-[#303035] py-2 px-5 text-[#7BF404] uppercase font-bold text-13px rounded-sm text-center" rel="noreferrer">Sync Account</a>
                            </Link>
                          </div>
                        }
                      </div>
                    })}
                  </div>
                }
                {/* {profile?.user_twitter && <div className='flex items-center justify-between gap-x-2 gap-y-4 mt-4'>
                  <label className='text-xs lg:text-sm font-casual leading-7 lg:leading-7 truncate'>Twitter <span className="hidden xl:inline">Account</span></label>
                  <div className='flex gap-2 justify-end items-center'>
                    {!editing && <span className="text-xs lg:text-sm font-semibold font-casual">{profile?.user_twitter}</span>}
                    {editing && <input type="text" className="text-xs lg:text-sm font-casual bg-gamefiDark-700 rounded w-32 border-gamefiDark-600 py-1 px-2" placeholder="@your.name" value={twitter} onChange={e => setTwitter(e.target.value)} />}
                  </div>
                </div>}
                {profile?.user_telegram && <div className='flex items-center justify-between gap-x-2 gap-y-4 mt-4'>
                  <label className='text-xs lg:text-sm font-casual leading-7 lg:leading-7 truncate'>Telegram <span className="hidden xl:inline">Account</span></label>
                  <div className='flex gap-2 justify-end items-center'>
                    {!editing && <span className="text-xs lg:text-sm font-semibold font-casual">{profile?.user_telegram}</span>}
                    {editing && <input type="text" className="text-xs lg:text-sm font-casual bg-gamefiDark-700 rounded w-32 border-gamefiDark-600 py-1 px-2" placeholder="@your.name" value={telegram} onChange={e => setTelegram(e.target.value)} />}
                  </div>
                </div>} */}
              </>}
          </div>
        </div>

        <div>
          <h3 className='font-bold text-2xl uppercase mb-2'>Basic steps to get started with GameFi.org</h3>
          <div className='text-sm font-casual text-white/80 mb-6'>Follow these steps to join IGO / INO pools on GameFi.org launchpad</div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="p-5 bg-gamefiDark-800 rounded clipped-t-r flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-700 mb-6 text-2xl font-bold rounded-full">1</div>
              <h5 className='font-bold text-base uppercase mb-2'>Stake $GAFI to upgrade your Rank</h5>
              <div className='text-sm text-white/80 font-casual'>
                Check out GameFi.org's ranking system: Legend, Pro, Elite, Rookie.
              </div>
              <a href='https://faq.gamefi.org/#1.2.-stake' rel='noreferrer' target="_blank" className="font-semibold text-xs md:text-sm font-casual text-gamefiGreen-700 hover:text-gamefiGreen-500 hover:underline mt-6">Read more</a>
            </div>
            <div className="p-5 bg-gamefiDark-800 rounded clipped-t-r flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-700 mb-6 text-2xl font-bold rounded-full">2</div>
              <h5 className='font-bold text-base uppercase mb-2'>Complete KYC</h5>
              <div className='text-sm text-white/80 font-casual '>
                You must complete KYC on Blockpass to be able to join IGO/INO pools.
              </div>
              <a className="font-semibold text-xs md:text-sm font-casual text-gamefiGreen-700 hover:text-gamefiGreen-500 hover:underline mt-auto" href='https://faq.gamefi.org/#_1-3-kyc' rel='noreferrer' target="_blank">How to KYC via Blockpass</a>
            </div>
            <div className="p-5 bg-gamefiDark-800 rounded clipped-t-r flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-700 mb-6 text-2xl font-bold rounded-full">3</div>
              <h5 className='font-bold text-base uppercase mb-2'>Apply Whitelist or Join Competition</h5>
              <div className='text-sm text-white/80 font-casual'>
                Apply Whitelist or complete Gleam tasks to join IGO/Community pools
              </div>
              <a href='https://faq.gamefi.org/#i.-how-to-join-igos' rel='noreferrer' target="_blank" className="font-semibold text-xs md:text-sm font-casual text-gamefiGreen-700 hover:text-gamefiGreen-500 hover:underline mt-auto">How to join IGO/INO pools</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Profile = () => {
  return (
    <HubProvider>
      <Component />
    </HubProvider>
  )
}

export default Profile
