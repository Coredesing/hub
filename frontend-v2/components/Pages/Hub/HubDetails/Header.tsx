import { useState, useEffect } from 'react'
import useConnectWallet from '@/hooks/useConnectWallet'
import toast from 'react-hot-toast'
import get from 'lodash.get'
import clsx from 'clsx'
import isEmpty from 'lodash.isempty'
import { fetcher, gtagEvent } from '@/utils'
import useHubProfile from '@/hooks/useHubProfile'
import styles from './Carousel.module.scss'
import Link from 'next/link'
import { useHubDetailContext } from '@/components/Pages/Hub/HubDetails/utils'
import { nFormatter } from '@/components/Pages/Hub/utils'
import { useRouter } from 'next/router'

function Header ({ callApi, name, id, className, isVerified = false, slug, viewDetail = false } : any) {
  const [loading, setLoading] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [pinHeader, setPinHeader] = useState(false)
  const { hubData } = useHubDetailContext()
  const [totalLocalFavorites, setTotalLocalFavorites] = useState<number>(+(hubData?.totalFavorites) || 0)

  const { connectWallet } = useConnectWallet()
  const { accountHub } = useHubProfile()
  const router = useRouter()
  useEffect(() => {
    function handleScroll () {
      const layoutBodyHubElm = document.getElementById('layoutBodyHub')
      const hubDetailHeaderFixedElm = document.getElementById('HubDetailHeaderFixed')
      const appSideBarElm = document.getElementById('AppSideBar')
      const hubDetailContentElm = document.getElementById('HubDetailContent')
      const elm = document.getElementById('HubDetailHeader')
      if (!elm) return

      const { offsetTop, clientHeight } = elm

      if (layoutBodyHubElm.scrollTop >= (offsetTop + clientHeight + 24)) {
        setPinHeader(true)
        hubDetailHeaderFixedElm.style.width = `calc(100vw - ${appSideBarElm.clientWidth}px)`
        hubDetailHeaderFixedElm.style.left = `${appSideBarElm.clientWidth}px`
        hubDetailHeaderFixedElm.style.paddingRight = `calc((100vw - ${hubDetailContentElm.clientWidth + appSideBarElm.clientWidth}px) / 2)`
        hubDetailHeaderFixedElm.style.paddingLeft = `calc((100vw - ${hubDetailContentElm.clientWidth + appSideBarElm.clientWidth}px) / 2)`
        return
      }
      setPinHeader(false)
    }

    const layoutBodyHubElm = document.getElementById('layoutBodyHub')
    if (!layoutBodyHubElm) return

    layoutBodyHubElm.addEventListener('scroll', handleScroll)

    return () => {
      layoutBodyHubElm && layoutBodyHubElm.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(accountHub)) {
      if (callApi) getFavoriteByUser()
    } else setFavorite(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHub?.walletAddress, router.query.slug])
  const getFavoriteByUser = () => {
    setLoading(true)
    setFavorite(false)
    fetcher('/api/hub/favorite/getFavoriteByUserId', { method: 'POST', body: JSON.stringify({ variables: { walletAddress: accountHub?.walletAddress, aggregatorId: id } }) }).then((result) => {
      setLoading(false)
      const v = get(result, 'data.favorites.data')
      if (!isEmpty(v)) {
        setFavorite(true)
      } else setFavorite(false)
    }).catch((err) => {
      setLoading(false)
      console.debug('err', err)
    })
  }

  const handleLike = () => {
    setLoading(true)
    connectWallet().then((res: any) => {
      if (res.error) {
        setLoading(false)
        console.debug(res.error)
        toast.error('Could not like')
        return
      }
      const { walletAddress, signature } = res
      fetch('/api/hub/favorite/handleFavorite', {
        method: 'POST',
        body: JSON.stringify({ objectID: id, type: 'aggregator', favorite: !favorite }),
        headers: {
          'X-Signature': signature,
          'X-Wallet-Address': walletAddress
        }
      }).then(res => {
        if (res?.status === 429) {
          return {
            err: {
              status: 429
            }
          }
        }

        return res.json()
      }).then(({ err }) => {
        setLoading(false)
        if (err?.status === 429) {
          toast.error('You reached the request limit. Please try again later!')
          return
        }
        if (err) {
          toast.error('Could not like')
          return
        }
        setFavorite(!favorite)
        router.replace(router.asPath)
        if (favorite) {
          if (totalLocalFavorites) setTotalLocalFavorites(totalLocalFavorites - 1)
          gtagEvent('unlike', { game: slug })
          return
        }
        setTotalLocalFavorites(totalLocalFavorites + 1)
        gtagEvent('like', { game: slug })
      }).catch((err) => {
        setLoading(false)
        toast.error('Failed to like!')
        console.debug('err', err)
      })
    }).catch(err => {
      setLoading(false)
      console.debug(err)
      // toast.error(err?.toString() || 'Could not sign the authentication message')
    })
  }
  return (
    <div id='HubDetailHeader' className={`md:items-center mb-6 justify-between bg-transparent ${className || ''}`}>
      <div className='flex w-full md:w-8/12 items-center justify-between'>
        <div className="uppercase font-bold text-2xl md:text-[32px] mr-auto flex gap-4 items-center">
          {
            isVerified
              ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0ZM10.5 17.1L5.4 12L7.5 9.9L10.5 12.9L16.5 6.9L18.6 9L10.5 17.1Z" fill="#6CDB00" />
              </svg>
              : null
          }
          {name}</div>
        <div>
          {viewDetail
            ? <Link
              href={{
                pathname: '/hub/[slug]',
                query: { slug: slug }
              }}>
              <a className="hidden md:flex items-center uppercase overflow-hidden py-2.5 px-8 bg-white/10 font-bold text-[13px] hover:opacity-95 cursor-pointer w-full md:w-auto rounded-sm clipped-b-l">
                <div className="flex items-center mr-2">
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.8625 11.8617L7.0875 10.6367L3.325 6.87422H14V5.12422H3.325L7.0875 1.36172L5.8625 0.136719L0 5.99922L5.8625 11.8617Z" fill="white" />
                  </svg>
                </div>
                <div className='uppercase'>Back To Overview</div>
              </a>
            </Link>
            : <Link href={`/hub/${slug}/info`} passHref>
              <a className="hidden md:flex items-center uppercase overflow-hidden py-2.5 px-8 bg-white/10 font-bold text-[13px] hover:opacity-95 cursor-pointer w-full md:w-auto rounded-sm clipped-b-l">
                <div className='uppercase'>More Information</div>
              </a>
            </Link>
          }
        </div>

      </div>
      <button
        onClick={handleLike}
        className={clsx(favorite ? 'bg-[#FF5959]/10' : 'bg-[#DE4343]', ' w-36 clipped-t-r p-px rounded cursor-pointer disabled:cursor-not-allowed')}
        disabled={loading}
      >
        <div className={clsx(favorite ? 'bg-[#FF5959]/10' : '', 'flex items-center justify-center  clipped-t-r py-2 px-6 rounded leading-5')}>
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.91671 0.583984C8.69171 0.583984 7.64171 1.22565 7.00004 2.15898C6.35837 1.22565 5.30837 0.583984 4.08337 0.583984C2.15837 0.583984 0.583374 2.15898 0.583374 4.08398C0.583374 7.58398 7.00004 12.834 7.00004 12.834C7.00004 12.834 13.4167 7.58398 13.4167 4.08398C13.4167 2.15898 11.8417 0.583984 9.91671 0.583984Z" fill={favorite ? '#ff5959' : '#ffffff'} stroke={favorite ? '#ff5959' : '#ffffff'} />
          </svg>
          <span className="pl-2 font-bold text-[13px]">{favorite ? nFormatter(totalLocalFavorites) : 'LIKE'}</span>
        </div>
      </button>

      <div id='HubDetailHeaderFixed' className={clsx(styles.headerBar, 'fixed bg-gamefiDark-900 w-full z-50 transition-all duration-300 flex md:items-center py-6 justify-between', pinHeader ? 'top-0' : '-top-[84px]', 'invisible lg:visible')}>
        <div className='flex w-full md:w-8/12 items-center justify-between'>
          <div className="uppercase font-bold text-2xl md:text-[32px] mr-auto flex gap-4 items-center">
            {
              isVerified
                ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0ZM10.5 17.1L5.4 12L7.5 9.9L10.5 12.9L16.5 6.9L18.6 9L10.5 17.1Z" fill="#6CDB00" />
                </svg>
                : null
            }
            {name}</div>
        </div>
        <div className='flex gap-[10px]'>
          <div>
            {viewDetail
              ? <Link
                href={{
                  pathname: '/hub/[slug]',
                  query: { slug: slug }
                }}>
                <a className="hidden md:flex items-center uppercase overflow-hidden py-2.5 px-8 bg-white/10 font-bold text-[13px] hover:opacity-95 cursor-pointer w-full md:w-auto rounded-sm clipped-b-l">
                  <div className="flex items-center mr-2">
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.8625 11.8617L7.0875 10.6367L3.325 6.87422H14V5.12422H3.325L7.0875 1.36172L5.8625 0.136719L0 5.99922L5.8625 11.8617Z" fill="white" />
                    </svg>
                  </div>
                  <div className='uppercase'>Back To Overview</div>
                </a>
              </Link>
              : <Link href={`/hub/${slug}/info`} passHref>
                <a className="hidden md:flex items-center uppercase overflow-hidden py-2.5 px-8 bg-white/10 font-bold text-[13px] hover:opacity-95 cursor-pointer w-full md:w-auto rounded-sm clipped-b-l">
                  <div className='uppercase'>More Information</div>
                </a>
              </Link>
            }
          </div>
          <button
            onClick={handleLike}
            className={clsx(favorite ? 'bg-[#FF5959]/10' : 'bg-[#DE4343]', ' w-36  clipped-t-r p-px rounded cursor-pointer h-9 disabled:cursor-not-allowed')}
            disabled={loading}
          >
            <div className={clsx(favorite ? 'bg-[#FF5959]/10' : '', 'flex items-center justify-center clipped-t-r py-2 px-6 rounded leading-5')}>
              <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.91671 0.583984C8.69171 0.583984 7.64171 1.22565 7.00004 2.15898C6.35837 1.22565 5.30837 0.583984 4.08337 0.583984C2.15837 0.583984 0.583374 2.15898 0.583374 4.08398C0.583374 7.58398 7.00004 12.834 7.00004 12.834C7.00004 12.834 13.4167 7.58398 13.4167 4.08398C13.4167 2.15898 11.8417 0.583984 9.91671 0.583984Z" fill={favorite ? '#ff5959' : '#ffffff'} stroke={favorite ? '#ff5959' : '#ffffff'} />
              </svg>
              <span className="pl-2 font-bold text-[13px]">{favorite ? nFormatter(totalLocalFavorites) : 'LIKE'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
