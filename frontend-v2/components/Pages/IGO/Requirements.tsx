import { useMyWeb3 } from '@/components/web3/context'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { IconError, IconOK, IconWarning } from '@/components/Base/Icon'
import WalletConnector from '@/components/Base/WalletConnector'
import { useContext, useMemo, useCallback, useState, useEffect } from 'react'
import { useAppContext } from '@/context'
import { getTierById } from '@/utils/tiers'
import { fetcher, shorten, useProfile } from '@/utils'
import { IGOContext } from '@/pages/igo/[slug]'
import useWalletSignature, { MESSAGE_SIGNATURE } from '@/hooks/useWalletSignature'
import Modal from '@/components/Base/Modal'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { GAFI, switchNetwork } from '@/components/web3'
import { API_BASE_URL } from '@/utils/constants'

const SOCIAL_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  ERROR: 2,
  REJECTED: 3
}

const Requirements = () => {
  const { poolData, whitelistJoined, whitelistStatus, signature, setSignature, loadJoined, setFailedRequirements, now } = useContext(IGOContext)
  const { network: poolNetwork } = useLibraryDefaultFlexible(poolData?.network_available)
  const { library, account, network } = useMyWeb3()
  const { tierMine, tiers, tierMineLoading } = useAppContext()
  const { signMessage } = useWalletSignature()
  const { profile, setHeaders, loading: profileLoading } = useProfile(account)
  const [whitelistLoading, setWhitelistLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!signature) {
      return
    }

    setHeaders({
      msgSignature: MESSAGE_SIGNATURE || '',
      signature
    })
  }, [signature, setHeaders])

  useEffect(() => {
    setSignature(false)
    setShowModal(false)
  }, [account, setSignature])

  const poolNetworkInvalid = useMemo(() => {
    if (!account) {
      return true
    }

    return poolNetwork?.id !== network?.id
  }, [account, poolNetwork, network])
  const poolRank = useMemo(() => {
    return getTierById(poolData?.min_tier)
  }, [poolData])
  const poolRankInvalid = useMemo(() => {
    if (!poolRank?.id) {
      return false
    }

    return poolRank.id > tierMine?.id
  }, [poolRank, tierMine])
  const poolWhitelistTime = useMemo(() => {
    const start = poolData?.start_join_pool_time ? new Date(Number(poolData?.start_join_pool_time) * 1000) : undefined
    const end = poolData?.end_join_pool_time ? new Date(Number(poolData?.end_join_pool_time) * 1000) : undefined
    return {
      start,
      end
    }
  }, [poolData])
  const poolWhitelistOKTime = useMemo(() => {
    const { start: joinStart, end: joinEnd } = poolWhitelistTime
    return joinStart && joinEnd && poolData?.buy_type.toLowerCase() === 'whitelist' && joinStart <= now && joinEnd >= now
  }, [poolData, now, poolWhitelistTime])
  const poolWhitelistReady = useMemo(() => {
    return !whitelistJoined && poolWhitelistOKTime
  }, [poolWhitelistOKTime, whitelistJoined])
  const poolWhitelistSocialProblems = useMemo(() => {
    const props = {
      partner_channel: 'partner_channel_status',
      partner_group: 'partner_group_status',
      partner_twitter: 'partner_twitter_status',
      self_channel: 'self_channel_status',
      self_group: 'self_group_status',
      self_twitter: 'self_twitter_status'
    }

    return Object.entries(props).map(([k, v]) => {
      if (whitelistStatus?.[v] !== SOCIAL_STATUS.COMPLETED) {
        return {
          [k]: whitelistStatus?.[v]
        }
      }

      return {}
    }).reduce((acc, val) => {
      return {
        ...acc,
        ...val
      }
    }, {})
  }, [whitelistStatus])
  const poolWhitelistOKSocial = useMemo(() => {
    return poolData?.is_private === 3 || Object.keys(poolWhitelistSocialProblems).length === 0
  }, [poolData?.is_private, poolWhitelistSocialProblems])

  const [formData, setFormData] = useState({
    telegram: '',
    twitter: '',
    solana_address: '',
    terra_wallet: ''
  })
  const setTwitter = useCallback((v) => {
    setFormData({
      ...formData,
      twitter: v
    })
  }, [formData])
  const setTelegram = useCallback((v) => {
    setFormData({
      ...formData,
      telegram: v
    })
  }, [formData])
  const setSolana = useCallback((v) => {
    setFormData({
      ...formData,
      solana_address: v
    })
  }, [formData])
  const showApplyWhitelist = useCallback(() => {
    if (signature) {
      setShowModal(true)
      return
    }

    signMessage()
      .then((signature: string) => {
        if (!signature) {
          return
        }

        setSignature(signature)
        setShowModal(true)
      })
      .catch(() => {
        toast.error('Sign Message Failed!')
        return false
      })
  }, [setShowModal, signMessage, signature, setSignature])
  const handleApplyWhitelist = useCallback(async () => {
    if (!poolData || !account) {
      return
    }

    if (!poolWhitelistReady) {
      return
    }

    if (!signature) {
      return
    }

    setWhitelistLoading(true)

    const formApply = {
      wallet_address: account,
      user_twitter: formData.twitter,
      user_telegram: formData.telegram,
      solana_address: formData.solana_address,
      terra_address: formData.terra_wallet,
      signature
    }

    const submitFormResponse = await fetcher(`${API_BASE_URL}/user/apply-join-campaign/${poolData.id}`, {
      method: 'POST',
      headers: {
        msgSignature: MESSAGE_SIGNATURE || '',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(formApply)
    }).catch(e => console.debug(e?.message))
    setWhitelistLoading(false)

    if (submitFormResponse?.status !== 200) {
      toast.error(submitFormResponse?.message || 'Submit Whitelist Form Failed!')
      return
    }

    toast.success('Apply Whitelist Successfully')
    loadJoined()
  }, [poolData, account, poolWhitelistReady, formData, signature, loadJoined])

  useEffect(() => {
    if (poolData?.is_private === 3) {
      setFailedRequirements(false)
      return
    }
    setFailedRequirements(poolNetworkInvalid ||
      poolRankInvalid ||
      (!poolData?.kyc_bypass && !profile?.verified) ||
      !whitelistJoined || (poolData.airdrop_network === 'solana' &&
        !profile.solana_address))
  }, [poolData.airdrop_network, poolData?.is_private, poolData?.kyc_bypass, poolNetworkInvalid, poolRankInvalid, profile, setFailedRequirements, whitelistJoined])

  const columnPartner = useMemo(() => {
    return poolData?.socialRequirement?.partner_twitter && poolData?.socialRequirement?.partner_group && poolData?.socialRequirement?.partner_channel
  }, [poolData])

  return <>
    <div className="bg-gamefiDark-630 bg-opacity-30 p-4 xl:p-6 2xl:p-7 rounded">
      <h4 className="font-bold uppercase text-lg">Requirements</h4>
      <div className="table w-full font-casual text-sm">
        <div className="table-row">
          <div className="table-cell align-middle w-6">
            {poolNetworkInvalid ? <IconError className="w-4 h-4" /> : <IconOK className="w-4 h-4" />}
          </div>
          <div className="table-cell align-middle text-white/90">IGO Network</div>
          <div className="table-cell align-middle text-white/90"><strong className="tracking-wider">{poolNetwork?.name || 'Unknown'}</strong></div>
          <div className="table-cell align-middle h-10 w-32">
            {poolNetworkInvalid && <>
              {!account && <WalletConnector buttonClassName="!px-2 !py-1 font-mechanic !w-full"></WalletConnector>}
              {account &&
                <button
                  onClick={() => switchNetwork(library?.provider, poolNetwork?.id)}
                  className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r bg-gamefiGreen-500 text-gamefiDark-900 w-full'
                >
                  Switch Network
                </button>
              }
            </>
            }
          </div>
        </div>
        {poolData.airdrop_network && poolData.airdrop_network === 'solana' && <div className="table-row">
          <div className="table-cell align-middle w-6">
            {profile.solana_address ? <IconOK className="w-4 h-4" /> : <IconError className="w-4 h-4" />}
          </div>
          <div className="table-cell align-middle text-white/90 w-32 h-10">Solana Wallet</div>
          <div className="table-cell align-middle text-white/90 w-32">
            {
              profile.solana_address && shorten(profile.solana_address, 16)
            }
          </div>
          {!profile.solana_address && <div className="table-cell align-middle h-10 whitespace-nowrap">

            {(!account || poolNetworkInvalid || poolRankInvalid || !profile.verified) &&
              <Link href="/account" passHref={true}>
                <button className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiGreen-500 text-gamefiDark-900'>
                  Edit
                </button>
              </Link>
            }
          </div>}
        </div>}
        <div className="table-row">
          <div className="table-cell align-middle w-6">
            {poolRankInvalid ? <IconError className="w-4 h-4" /> : <IconOK className="w-4 h-4" />}
          </div>
          <div className="table-cell align-middle text-white/90">Min Rank</div>
          <div className="table-cell align-middle text-white/90"><strong className="tracking-wider">{poolRank?.name || 'Unknown'}</strong></div>
          <div className="table-cell align-middle h-10 w-32">
            {tierMineLoading && <button className="px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm clipped-t-r w-full bg-gamefiDark-400 text-black">Loading...</button>}
            {!tierMineLoading && poolRankInvalid && <>
              {(!account || poolNetworkInvalid) &&
                <button className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiDark-400 text-black'>
                  Stake
                </button>
              }

              {(account && !poolNetworkInvalid) &&
                <Link href="/staking" passHref={true}>
                  <a className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiGreen-500 text-gamefiDark-900 inline-block text-center'>
                    Stake
                  </a>
                </Link>
              }
            </>
            }
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell align-middle w-6">
            {!profile.verified ? (poolData?.is_private === 3 ? <IconOK className="w-4 h-4" /> : <IconError className="w-4 h-4" />) : <IconOK className="w-4 h-4" />}
          </div>
          <div className="table-cell align-middle text-white/90">KYC Status</div>
          <div className="table-cell align-middle text-white/90"><strong className="tracking-wider">{profile?.verified ? 'Verified' : (poolData?.is_private === 3 ? 'Not Required' : 'Unverified')}</strong></div>
          <div className="table-cell align-middle h-10 w-32">
            {profileLoading && <button className="px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm clipped-t-r w-full bg-gamefiDark-400 text-black">Loading...</button>}
            {!profileLoading && !poolData?.kyc_bypass && !profile?.verified && <>
              {(!account || poolNetworkInvalid || poolRankInvalid) &&
                <button className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiDark-400 text-black'>
                  Verify Now
                </button>
              }

              {(account && !poolNetworkInvalid && !poolRankInvalid) &&
                <Link href="/account/profile" passHref={true}>
                  <a className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiGreen-500 text-gamefiDark-900 inline-block text-center'>
                    Verify Now
                  </a>
                </Link>
              }
            </>
            }
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell align-middle w-6">
            {whitelistJoined ? (!poolWhitelistOKSocial ? <IconWarning className="w-4 h-4" /> : <IconOK className="w-4 h-4" />) : (poolData?.is_private === 3 ? <IconOK className="w-4 h-4" /> : <IconError className="w-4 h-4" />)}
          </div>
          <div className="table-cell align-middle text-white/90">Whitelist</div>
          <div className="table-cell align-middle text-white/90">
            {
              poolData?.is_private !== 3
                ? <strong className="tracking-wider">
                  {whitelistJoined && poolWhitelistOKSocial && 'Applied'}
                  {whitelistJoined && !poolWhitelistOKSocial && 'Incomplete'}
                  {!whitelistJoined && !poolWhitelistOKTime && new Date(now).getTime() < poolWhitelistTime?.start?.getTime() && 'Upcoming'}
                  {!whitelistJoined && !poolWhitelistOKTime && new Date(now).getTime() > poolWhitelistTime?.end?.getTime() && 'Closed'}
                  {poolWhitelistReady && 'Unapplied'}
                </strong>
                : <strong className="tracking-wider">
                  Not Required
                </strong>
            }
          </div>
          <div className="table-cell align-middle h-10 w-32">
            {poolData?.is_private !== 3 && poolWhitelistReady && <>
              {(!account || poolNetworkInvalid || poolRankInvalid || !profile.verified) &&
                <button className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiDark-400 text-black'>
                  Apply Whitelist
                </button>
              }

              {(account && !poolNetworkInvalid && !poolRankInvalid && profile.verified) &&
                <button className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiGreen-500 text-gamefiDark-900 inline-block text-center' onClick={showApplyWhitelist}>
                  Apply Whitelist
                </button>
              }
            </>
            }

            {
              poolData?.is_private !== 3 && !poolWhitelistReady && poolWhitelistOKTime && !poolWhitelistOKSocial &&
              <button className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiYellow-400 text-gamefiDark-900 inline-block text-center' onClick={showApplyWhitelist}>
                Review Submission
              </button>
            }

            {
              poolData?.is_private === 3 && poolWhitelistReady &&
              <a href={poolData?.socialRequirement?.gleam_link || '#'} target="_blank" className='px-2 py-1 font-bold font-mechanic text-[13px] uppercase rounded-sm hover:opacity-95 cursor-pointer clipped-t-r w-full bg-gamefiGreen-500 text-gamefiDark-900 inline-block text-center' rel="noreferrer">
                Join Competition
              </a>
            }
          </div>
        </div>
      </div>
    </div>

    <Modal show={showModal} toggle={setShowModal} onClose={() => { setSignature('') }} className='dark:bg-transparent fixed z-50 sm:!max-w-3xl'>
      <div className="bg-gamefiDark-700">
        <div className="p-4 xl:p-6 2xl:p-7 pt-11 font-casual w-full">
          <strong className="uppercase text-2xl font-mechanic">Welcome to {poolData?.title || ''} on GameFi.org</strong>
          <p className="mt-6 text-sm">In order to participate in the IGO, you must fulfill requirements as below.</p>
          <p className="mt-2 text-sm text-gamefiDark-100">{tiers.priority.map(x => x.name).join(', ')} are not required to do the social requirements. However, we recommend following our official Twitter and Telegram groups to stay up-to-date with important announcements.</p>
          <div className="mt-6 w-full text-sm inline-flex items-center font-medium">
            <span className="flex items-center justify-center mr-2 bg-black w-6 h-6 rounded-full font-bold">1</span>
            Provide social information
            <div className="flex gap-1 ml-auto">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L13 6" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 1L15 4L5 14L1 15L2 11L12 1Z" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className='uppercase font-bold text-[12px] lg:text-xs text-gamefiGreen-700 outline-none focus:outline-none hover:underline'>
                <Link href="/account" passHref={true}>Edit</Link>
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="w-full text-sm">
              <span className="text-[13px]"><span className="hidden sm:inline">Your</span> Twitter Account</span>
              <input
                type="text"
                value={profile.user_twitter || formData.twitter}
                onChange={e => setTwitter(e.target.value)}
                className="mt-2 w-full bg-gamefiDark-600 border-gamefiDark-400 rounded text-sm"
                disabled={!!profile.user_twitter}
                readOnly={!!profile.user_twitter}
              />
            </div>
            <div className="w-full text-sm">
              <span className="text-[13px]"><span className="hidden sm:inline">Your</span> Telegram Account</span>
              <input
                type="text"
                value={profile.user_telegram || formData.telegram}
                onChange={e => setTelegram(e.target.value)}
                className="mt-2 w-full bg-gamefiDark-600 border-gamefiDark-400 rounded text-sm"
                disabled={!!profile.user_telegram} readOnly={!!profile.user_telegram}
              />
            </div>
          </div>
          {
            poolData?.airdrop_network === 'solana'
              ? <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="w-full text-sm col-span-2">
                  <span className="text-[13px]"><span className="hidden sm:inline">Your</span> Solana Wallet</span>
                  <input
                    type="text"
                    value={profile.solana_address || formData.solana_address}
                    onChange={e => setSolana(e.target.value)}
                    className="mt-2 w-full bg-gamefiDark-600 border-gamefiDark-400 rounded text-sm"
                    disabled={!!profile.solana_address} readOnly={!!profile.solana_address}
                  />
                </div>
              </div>
              : ''
          }
          <p className="mt-6 text-sm inline-flex items-center font-medium">
            <span className="flex items-center justify-center mr-2 bg-black w-6 h-6 rounded-full font-bold">2</span>Follow and subscribe
          </p>
          <div className="lg:table w-full overflow-x-scroll font-casual text-sm mt-2 font-medium border-separate [border-spacing:0_0.4rem]">
            <div className="table-row">
              <div className="table-cell align-middle px-3 font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                Account
              </div>
              {columnPartner && <div className="table-cell align-middle px-3 font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                <img src={poolData?.token_images} className="inline-block w-6 h-6 object-contain mr-1" alt={poolData?.title} />
                {poolData?.title}
              </div>}
              <div className="table-cell align-middle px-3 font-mechanic font-bold uppercase text-[13px] text-gamefiDark-200">
                <img src={GAFI.image} className="inline-block w-6 h-6 object-contain mr-1" alt="GameFi.org" />
                GAMEFI
              </div>
            </div>

            <div className="table-row bg-gradient-to-r from-gamefiDark-900 via-gamefiDark-900">
              <div className="table-cell align-middle px-3 py-2 rounded">
                Official Twitter
              </div>
              {columnPartner && <div className="table-cell align-middle px-3 py-2">
                {poolData?.socialRequirement?.partner_twitter && <>
                  <a href={`https://twitter.com/${poolData?.socialRequirement?.partner_twitter}`} target="_blank" className="text-gamefiGreen-600 hover:text-gamefiGreen-500 hover:underline" rel="noreferrer">
                    @{poolData?.socialRequirement?.partner_twitter}
                  </a>
                  {whitelistJoined && <>
                    {poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.REJECTED && <IconError className="inline w-4 h-4 ml-2" ></IconError>}
                    {poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.COMPLETED && <IconOK className="inline w-4 h-4 ml-2" ></IconOK>}
                    {(poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.PENDING || poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.ERROR) && <IconWarning className="inline w-4 h-4 ml-2" ></IconWarning>}
                  </>}
                </>}
              </div>}
              <div className="table-cell align-middle px-3 py-2">
                <a href={`https://twitter.com/${poolData?.socialRequirement?.self_twitter}`} target="_blank" className="text-gamefiGreen-600 hover:text-gamefiGreen-500 hover:underline" rel="noreferrer">
                  @{poolData?.socialRequirement?.self_twitter}
                </a>
                {whitelistJoined && <>
                  {poolWhitelistSocialProblems.self_twitter === SOCIAL_STATUS.REJECTED && <IconError className="inline w-4 h-4 ml-2" ></IconError>}
                  {poolWhitelistSocialProblems.self_twitter === SOCIAL_STATUS.COMPLETED && <IconOK className="inline w-4 h-4 ml-2" ></IconOK>}
                  {(poolWhitelistSocialProblems.self_twitter === SOCIAL_STATUS.PENDING || poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.ERROR) && <IconWarning className="inline w-4 h-4 ml-2" ></IconWarning>}
                </>}
              </div>
            </div>

            <div className="table-row bg-gradient-to-r from-gamefiDark-900 via-gamefiDark-900">
              <div className="table-cell align-middle px-3 py-2 rounded">
                Community Group
              </div>
              {columnPartner && <div className="table-cell align-middle px-3 py-2">
                {poolData?.socialRequirement?.partner_group && <>
                  <a href={`https://t.me/${poolData?.socialRequirement?.partner_group}`} target="_blank" className="text-gamefiGreen-600 hover:text-gamefiGreen-500 hover:underline" rel="noreferrer">
                    @{poolData?.socialRequirement?.partner_group}
                  </a>
                  {whitelistJoined && <>
                    {poolWhitelistSocialProblems.partner_group === SOCIAL_STATUS.REJECTED && <IconError className="inline w-4 h-4 ml-2" ></IconError>}
                    {poolWhitelistSocialProblems.partner_group === SOCIAL_STATUS.COMPLETED && <IconOK className="inline w-4 h-4 ml-2" ></IconOK>}
                    {(poolWhitelistSocialProblems.partner_group === SOCIAL_STATUS.PENDING || poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.ERROR) && <IconWarning className="inline w-4 h-4 ml-2" ></IconWarning>}
                  </>}
                </>}
              </div>}
              <div className="table-cell align-middle px-3 py-2">
                <a href={`https://t.me/${poolData?.socialRequirement?.self_group}`} target="_blank" className="text-gamefiGreen-600 hover:text-gamefiGreen-500 hover:underline" rel="noreferrer">
                  @{poolData?.socialRequirement?.self_group}
                </a>
                {whitelistJoined && <>
                  {poolWhitelistSocialProblems.self_group === SOCIAL_STATUS.REJECTED && <IconError className="inline w-4 h-4 ml-2" ></IconError>}
                  {poolWhitelistSocialProblems.self_group === SOCIAL_STATUS.COMPLETED && <IconOK className="inline w-4 h-4 ml-2" ></IconOK>}
                  {(poolWhitelistSocialProblems.self_group === SOCIAL_STATUS.PENDING || poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.ERROR) && <IconWarning className="inline w-4 h-4 ml-2" ></IconWarning>}
                </>}
              </div>
            </div>

            <div className="table-row bg-gradient-to-r from-gamefiDark-900 via-gamefiDark-900">
              <div className="table-cell align-middle px-3 py-2 rounded">
                Announcement Channel
              </div>
              {columnPartner && <div className="table-cell align-middle px-3 py-2">
                {poolData?.socialRequirement?.partner_channel && <>
                  <a href={`https://t.me/${poolData?.socialRequirement?.partner_channel}`} target="_blank" className="text-gamefiGreen-600 hover:text-gamefiGreen-500 hover:underline" rel="noreferrer">
                    @{poolData?.socialRequirement?.partner_channel}
                  </a>
                  {whitelistJoined && <>
                    {poolWhitelistSocialProblems.partner_channel === SOCIAL_STATUS.REJECTED && <IconError className="inline w-4 h-4 ml-2" ></IconError>}
                    {poolWhitelistSocialProblems.partner_channel === SOCIAL_STATUS.COMPLETED && <IconOK className="inline w-4 h-4 ml-2" ></IconOK>}
                    {(poolWhitelistSocialProblems.partner_channel === SOCIAL_STATUS.PENDING || poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.ERROR) && <IconWarning className="inline w-4 h-4 ml-2" ></IconWarning>}
                  </>}
                </>}
              </div>}
              <div className="table-cell align-middle px-3 py-2">
                <a href={`https://t.me/${poolData?.socialRequirement?.self_channel}`} target="_blank" className="text-gamefiGreen-600 hover:text-gamefiGreen-500 hover:underline" rel="noreferrer">
                  @{poolData?.socialRequirement?.self_channel}
                </a>
                {whitelistJoined && <>
                  {poolWhitelistSocialProblems.self_channel === SOCIAL_STATUS.REJECTED && <IconError className="inline w-4 h-4 ml-2" ></IconError>}
                  {poolWhitelistSocialProblems.self_channel === SOCIAL_STATUS.COMPLETED && <IconOK className="inline w-4 h-4 ml-2" ></IconOK>}
                  {(poolWhitelistSocialProblems.self_channel === SOCIAL_STATUS.PENDING || poolWhitelistSocialProblems.partner_twitter === SOCIAL_STATUS.ERROR) && <IconWarning className="inline w-4 h-4 ml-2" ></IconWarning>}
                </>}
              </div>
            </div>
          </div>
          {poolData?.socialRequirement?.self_retweet_post && <>
            <p className="mt-6 text-sm inline-flex items-center font-medium">
              <span className="flex items-center justify-center mr-2 bg-black w-6 h-6 rounded-full font-bold">3</span>
              Like and retweet the
              <a className="ml-1 text-gamefiGreen-600 hover:text-gamefiGreen-500 hover:underline" target="_blank" href={poolData?.socialRequirement?.self_retweet_post} rel="noreferrer">{poolData?.title} announcement on GameFi’s Twitter
              </a>
            </p>
          </>}

          <div className="mt-6 text-sm flex items-center justify-end gap-6 font-mechanic text-[13px]">
            <button className="font-bold uppercase text-gamefiGreen-500 hover:text-white" onClick={() => setShowModal(false)}>Close</button>
            {!whitelistJoined && !whitelistLoading && <button className="font-bold uppercase clipped-t-r bg-gamefiGreen-600 hover:bg-gamefiGreen-500 text-black py-2 px-6 tracking-wider rounded-sm" onClick={() => { handleApplyWhitelist() }}>Apply Whitelist</button>}
            {whitelistLoading && <div className="font-bold uppercase clipped-t-r bg-gamefiGreen-600 hover:bg-gamefiGreen-500 text-black py-4 px-6 w-36 tracking-wider rounded-sm">
              <div className="dot-flashing mx-auto"></div>
            </div>}
          </div>
        </div>
      </div>
    </Modal>
  </>
}

export default Requirements
