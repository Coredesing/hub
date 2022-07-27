import { useCallback, useEffect, useState, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Tippy from '@tippyjs/react'
import { useGuildDetailContext } from './utils'
import { fetcher, printNumber } from '@/utils'
import useConnectWallet from '@/hooks/useConnectWallet'
import useHubProfile from '@/hooks/useHubProfile'
import { BackIcon } from '@/components/Base/Icon'
import { Spinning } from '@/components/Base/Animation'
import { useMyWeb3 } from '@/components/web3/context'
import ReviewRatingAction from '@/components/Base/Review/Rating/Action'

const HeaderProfile = ({ totalFavorites, setTotalFavorites, currentRate, setCurrentRate, loading, setLoading }) => {
  const router = useRouter()
  const { guildData } = useGuildDetailContext()
  const { accountHub } = useHubProfile()
  const { account } = useMyWeb3()
  const [favorite, setFavorite] = useState(false)
  const [loadingFavorite, setLoadingFavorite] = useState(false)

  const visibleRating = router.query.tab !== 'reviews'

  const handleSetCurrentRate = (rate, v: SetStateAction<number>) => () => {
    setCurrentRate(v)
    setLoading(true)
    connectWallet().then((res: any) => {
      if (res.error) {
        console.debug(res.error)
        toast.error('Could not rate')
        return
      }
      handleCreateRate(res, rate)
    }).catch(err => {
      setLoading(false)
      console.debug(err)
    })
  }

  const handleCreateRate = (response, rate) => {
    const { walletAddress, signature } = response
    fetcher('/api/hub/reviews/createRate', {
      method: 'POST',
      body: JSON.stringify({
        guild: guildData?.id,
        rate
      }),
      headers: {
        'X-Signature': signature,
        'X-Wallet-Address': walletAddress
      }
    }).then(({ err }) => {
      setLoading(false)
      if (err) {
        toast.error('Could not create rate')
      } else {
        setCurrentRate(rate)
        router.replace(router.asPath)
      }
    }).catch((err) => {
      setLoading(false)
      toast.error('Could not create rate')
      console.debug('err', err)
    })
  }

  const getFavoriteByUserId = useCallback(async () => {
    await fetcher('/api/hub/guilds/getFavoriteByUserId', {
      method: 'POST',
      body: JSON.stringify({
        variables: {
          walletAddress: account,
          objectID: guildData?.id?.toString(),
          type: 'guild'
        }
      })
    }).then((response) => {
      const result = response?.data?.favorites?.data

      setFavorite(result.length > 0)
    }).catch((err) => {
      console.debug('err', err)
    })
  }, [account, guildData?.id])

  useEffect(() => {
    if (accountHub) {
      getFavoriteByUserId()
    }
  }, [accountHub, getFavoriteByUserId])
  const { connectWallet } = useConnectWallet()

  const handleFavorite = useCallback(() => {
    connectWallet().then((res: any) => {
      setLoadingFavorite(true)
      if (!res) {
        toast.error('User not found!')
        setLoadingFavorite(false)
        return
      }

      const { walletAddress, signature } = res

      fetch('/api/hub/favorite/handleFavorite', {
        method: 'POST',
        body: JSON.stringify({
          objectID: guildData?.id?.toString(),
          type: 'guild',
          favorite: !favorite
        }),
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
        setLoadingFavorite(false)
        if (err?.status === 429) {
          toast.error('You reached the request limit. Please try again later!')
          return
        }
        if (err) {
          toast.error(err || 'Could not like')
          return
        }
        setFavorite(!favorite)
        if (favorite) {
          setTotalFavorites((prevTotalFavorites: number) => prevTotalFavorites - 1)
        } else {
          setTotalFavorites((prevTotalFavorites: number) => prevTotalFavorites + 1)
        }
      }).catch((err) => {
        setLoadingFavorite(false)
        toast.error('Failed to like!')
        console.debug('err', err)
      })
    }).catch(e => {
      // toast.error(e?.message || 'Something went wrong!')
      console.debug(e)
      setLoadingFavorite(false)
    })
  }, [connectWallet, favorite, guildData?.id, router])

  return (
    <div className="container mx-auto px-4 lg:px-16">
      <div className="absolute top-0 left-0 right-0 z-0">
        <div className="w-full lg:h-[310px] relative" style={{
          WebkitMaskImage: 'linear-gradient(180deg, #24262F 0%, rgba(36, 38, 47, 0) 100%)',
          maskImage: 'linear-gradient(180deg, #24262F 0%, rgba(36, 38, 47, 0) 100%)'
        }}>
          <div className="absolute bg-black top-0 bottom-0 left-0 right-0 opacity-70"></div>
          <img className="object-cover h-[500px] lg:h-full lg:w-full" src={guildData?.banner?.url} alt=""></img>
        </div>
      </div>
      <div className="container mx-auto px-4 xl:px-16 mt-28 relative">
        <a
          className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer"
          onClick={() => { router.push('/guilds') }}
        >
          <BackIcon/>
          Back
        </a>
        <div className="w-full flex flex-col lg:flex-row gap-8">
          <div className="w-[180px] h-[180px] rounded shadow overflow-hidden">
            <img src={guildData?.logo?.url} alt="" className="object-cover w-full h-full"></img>
          </div>
          <div className="flex-1 gap-4">
            <div className="flex gap-2 flex-col lg:flex-row lg:justify-between w-full">
              <div className="text-2xl uppercase font-bold lg:mb-2 tracking-wide">{guildData?.name || 'Unknown'}</div>
              <p className="inline-flex gap-5">
                {guildData?.website && <a href={guildData?.website} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="currentColor" />
                  </svg>
                </a>}

                {guildData?.telegramANN && <a href={guildData?.telegramANN} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="currentColor" />
                  </svg>
                </a>}

                {guildData?.telegramGlobalChat && <a href={guildData?.telegramGlobalChat} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="currentColor" />
                  </svg>
                </a>}

                {guildData?.twitter && <a href={guildData?.twitter} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="currentColor" />
                  </svg>
                </a>}

                {guildData?.medium && <a href={guildData?.medium} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="currentColor" />
                  </svg>
                </a>}
              </p>
            </div>
            <div className="font-semibold flex my-4 lg:mb-8"><span className="bg-gamefiDark-600 px-2 py-1 rounded-sm">{printNumber(guildData?.scholarship || 0)}+ Scholars</span></div>
            <div className="flex gap-2">
              {guildData?.projects?.map((game, index) => index < 5 && <div key={`supported-${index}`}>
                <Tippy key={`game-logo-${game.id}`} content={game.name}>
                  <img src={game.logo?.url} className="w-9 h-9 rounded object-cover" alt="" />
                </Tippy>
              </div>)}
              {
                guildData?.projects?.length > 5 && <div className="w-9 h-9 rounded bg-gamefiDark-600 flex items-center justify-center font-medium">+{guildData?.projects?.length - 5}</div>
              }
            </div>
            <div className="mt-8 md:mt-4 flex justify-end flex-col md:flex-row">
              { visibleRating &&
              <div className="sm:w-72 w-full bg-gamefiDark-700 clipped-b-l p-px rounded cursor-pointer mr-3 h-9  hover:opacity-95 disabled:cursor-not-allowed flex px-6 py-[10px] justify-between">
                <p className="text-sm text-white uppercase font-semibold">Rate this guild</p>
                <ReviewRatingAction rate={currentRate} callBack={handleSetCurrentRate} disabled={loading} extraClass="w-4 h-4" />
              </div>
              }
              {favorite
                ? <button onClick={handleFavorite} className="mt-4 lg:mt-0 w-full cursor-pointer lg:w-[146px] h-[36px] clipped-t-r p-px bg-[#FF5959]/10 rounded-sm flex items-center justify-center">
                  <div className="w-full h-full bg-[#FF5959]/10 hover:opacity-95 rounded-sm flex justify-center items-center gap-2 font-bold uppercase text-sm clipped-t-r">
                    {
                      loadingFavorite
                        ? <Spinning className="w-6 h-6"/>
                        : <>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.91671 0.583984C8.69171 0.583984 7.64171 1.22565 7.00004 2.15898C6.35837 1.22565 5.30837 0.583984 4.08337 0.583984C2.15837 0.583984 0.583374 2.15898 0.583374 4.08398C0.583374 7.58398 7.00004 12.834 7.00004 12.834C7.00004 12.834 13.4167 7.58398 13.4167 4.08398C13.4167 2.15898 11.8417 0.583984 9.91671 0.583984Z" fill="#FF5959"/>
                          </svg>
                          {totalFavorites}
                        </>
                    }
                  </div>
                </button>
                : <button onClick={handleFavorite} className="float-right mt-4 lg:mt-0 w-full cursor-pointer lg:w-[146px] h-[36px] clipped-t-r p-px bg-[#DE4343] rounded-sm flex items-center justify-center">
                  <div className="w-full h-full hover:opacity-95 rounded-sm flex justify-center items-center gap-2 font-bold uppercase text-sm clipped-t-r">
                    {
                      loadingFavorite
                        ? <Spinning className="w-6 h-6"/>
                        : <>
                          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.91671 0.583984C8.69171 0.583984 7.64171 1.22565 7.00004 2.15898C6.35837 1.22565 5.30837 0.583984 4.08337 0.583984C2.15837 0.583984 0.583374 2.15898 0.583374 4.08398C0.583374 7.58398 7.00004 12.834 7.00004 12.834C7.00004 12.834 13.4167 7.58398 13.4167 4.08398C13.4167 2.15898 11.8417 0.583984 9.91671 0.583984Z" fill={favorite ? '#ff5959' : '#ffffff'} stroke={favorite ? '#ff5959' : '#ffffff'} />
                          </svg>
                        Like
                        </>
                    }
                  </div>
                </button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderProfile
