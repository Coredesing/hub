import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { imageCMS, formatPrice, gtagEvent } from '@/utils'
import { nFormatter } from '@/components/Pages/Hub/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import useConnectWallet from '@/hooks/useConnectWallet'
import styles from './home.module.scss'
import ImageLoader from '@/components/Base/ImageLoader'
import get from 'lodash.get'
import stylesDetail from '@/components/Pages/Hub/HubList/hubList.module.scss'
import Tippy from '@tippyjs/react'
import { PriceChangeBg } from '@/components/Pages/Hub/HubDetails/PriceChange'

import { WrapperItem } from './StyleElement'

export default function ItemCarousel ({ item, index, showToolTip, defaultFavorite, disabled, setListFavorite, listFavorite }: any) {
  const [loading, setLoading] = useState(disabled)
  const [favorite, setFavorite] = useState(defaultFavorite)
  const { connectWallet } = useConnectWallet()

  useEffect(() => {
    setFavorite(defaultFavorite)
  }, [defaultFavorite])

  useEffect(() => {
    setLoading(disabled)
  }, [disabled])
  const { rate, tokenomic, verticalThumbnail, name, totalViews, totalFavorites, slug, shortDesc, categories, mobileThumbnail, id } = item
  const icon = get(tokenomic, 'icon.data.attributes', {})
  const handleLike = (e: { stopPropagation: () => void }) => {
    e?.stopPropagation()
    setLoading(true)
    connectWallet().then((v: any) => {
      if (v.error) {
        setLoading(false)
        console.debug(v.error)
        toast.error('Could not like')
        return
      }
      const { walletAddress, signature } = v
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
        const newListFavorite = { ...listFavorite }
        if (favorite) {
          delete newListFavorite[id]
        } else {
          newListFavorite[id] = id
        }
        setListFavorite(newListFavorite)
        if (favorite) {
          gtagEvent('unlike', { game: slug })
          return
        }

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
    <WrapperItem key={index} className={clsx(styles.itemCarousel, 'min-w-[210px] w-full mr-4 last:mr-0 h-full')}>
      <div className="rounded p-px h-full">
        <div className='h-full rounded relative flex flex-col group'>
          <Link href={`/hub/${slug}`} passHref>
            <div
              className="z-10 absolute h-1/3 w-full items-start top-0 left-0 pt-2 pr-2 pl-5 flex justify-between hover:cursor-pointer"
            >
              {
                rate
                  ? <Link href={`/hub/${slug}/reviews`} passHref><div className="inline-flex pt-3 font-casual">
                    <Image src={require('@/assets/images/icons/star.svg')} alt="star" />
                    <div className="ml-2 font-normal text-sm font-casual pt-0.5">{rate?.toFixed(1)}</div>
                  </div></Link>
                  : <div></div>
              }
              <div className="h-10 flex items-end">
                <button
                  onClick={handleLike}
                  className={clsx('cursor-pointer disabled:cursor-not-allowed p-3')}
                  disabled={loading}
                >
                  <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.91671 0.583984C8.69171 0.583984 7.64171 1.22565 7.00004 2.15898C6.35837 1.22565 5.30837 0.583984 4.08337 0.583984C2.15837 0.583984 0.583374 2.15898 0.583374 4.08398C0.583374 7.58398 7.00004 12.834 7.00004 12.834C7.00004 12.834 13.4167 7.58398 13.4167 4.08398C13.4167 2.15898 11.8417 0.583984 9.91671 0.583984Z" fill={favorite ? '#ff5959' : '#ffffff'} stroke={favorite ? '#ff5959' : '#ffffff'} />
                  </svg>
                </button>
              </div>
            </div>
          </Link>
          {/* <div
            className="absolute h-1/3 w-full items-start top-0 left-0 pt-2 pr-2 pl-5 flex justify-between group-hover:!bg-none group-hover:transition-[background-image] duration-0 group-hover:duration-1000"
            style={{ background: 'linear-gradient(180deg, #15171E 0%, rgba(21, 23, 30, 0) 100%)' }}
          >
            {
              rate
                ? <div className="inline-flex pt-3 font-casual">
                  <Image src={require('@/assets/images/icons/star.svg')} alt="star" />
                  <span className="ml-2 font-bold text-sm font-casual">{rate?.toFixed(1)}</span>
                </div>
                : <div></div>
            }
            <div className="h-10">
              {icon.url && (
                <div className="flex align-middle items-center">
                  <img
                    className="rounded-full"
                    width={40}
                    height={40}
                    src={checkPathImage(icon.url)}
                    alt={icon.name}
                  />
                </div>
              )}
            </div>
          </div> */}
          <Link href={`/hub/${slug}`} passHref>
            <div className="cursor-pointer relative w-full h-[272px] sm:h-[250px] xl:h-[266px] 2xl:h-[309px] overflow-hidden">
              <div
                className="absolute h-full w-full items-start top-0 left-0 pt-2 pr-2 pl-5 opacity-90 flex justify-between group-hover:h-1/2 group-hover:transition-[height] duration-0 group-hover:duration-200"
                style={{ background: 'linear-gradient(180deg, #15171E 0%, rgba(21, 23, 30, 0) 100%)' }}
              ></div>
              <div className="bg-black flex items-center justify-center w-full h-full" style={{ aspectRatio: '1' }}>
                <ImageLoader src={imageCMS(verticalThumbnail.url)} className="w-full h-full object-contain" />
                {/* <img src={token_info?.image || token_info?.icon || gamefiBox.src} alt={token_info?.title} className="w-full object-cover" /> */}
              </div>
            </div>
          </Link>
          <div className="w-full pt-3 pb-2 flex flex-col flex-1 justify-between font-casual">
            <div className="flex mb-2">
              {showToolTip
                ? <Tippy
                  duration={500}
                  theme="no-padding"
                  placement="right"
                  touch={false}
                  zIndex={999999}
                  interactive={true}
                  appendTo="parent"
                  arrow={false}
                  maxWidth={450}
                  content={<div className="container">
                    <div className="w-96 pb-6">
                      <img
                        width={384}
                        src={imageCMS(get(mobileThumbnail, 'data.[0].attributes.url', '/'))}
                        alt={name || 'game'}
                        className={`${stylesDetail.banner} hover:cursor-pointer`} />
                      <div className="px-3 pt-2">
                        <div className="mb-3 line-clamp-1">
                          {categories?.data?.map(v => (
                            <Link key={v?.attributes?.slug} href={`/hub/list?category=${v?.attributes?.slug}`} passHref>
                              <a className={`${stylesDetail.cardLink} mr-2 mb-2 bg-gamefiDark-500 hover:bg-gamefiDark-300 text-white px-4 py-1 inline-block rounded font-normal`}>
                                {v?.attributes?.name}
                              </a>
                            </Link>
                          ))}
                        </div>
                        <div className="truncate uppercase font-bold text-lg mb-2">{name}</div>
                        <div className="flex-none font-casual text-sm w-20 xl:w-48">
                          <p className="font-medium inline-flex items-center text-base mb-3">
                            {formatPrice(get(tokenomic, 'currentPrice', '-')) === '0' ? '-' : formatPrice(get(tokenomic, 'currentPrice', '-'))}
                            <PriceChangeBg className="ml-2 text-xs" priceChange24h={get(tokenomic, 'priceChange24h', '-')} />
                          </p>
                        </div>
                        <p className="font-casual text-sm line-clamp-3 text-gray-300">
                          {shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>}
                  className="font-casual text-sm leading-5 text-white bg-black opacity-100 p-3">
                  <div>
                    <Link href={`/hub/${slug}`} passHref>
                      <a className="group-hover:text-gamefiGreen-700 font-semibold text-base tracking-wide cursor-pointer hover:underline line-clamp-1">
                        {name}
                      </a>
                    </Link>
                  </div>
                </Tippy>
                : <Link href={`/hub/${slug}`} passHref>
                  <a className="group-hover:text-gamefiGreen-700 font-semibold text-base tracking-wide cursor-pointer hover:underline line-clamp-1">
                    <div className="flex items-center">
                      {icon.url && (
                        <div className="flex align-middle items-center mr-2">
                          <img
                            className="rounded-full"
                            width={25}
                            height={25}
                            src={imageCMS(icon.url)}
                            alt={icon.name}
                          />
                        </div>
                      )}
                      <div className="">
                        {name}
                      </div>
                    </div>
                  </a>
                </Link>}
            </div>
            <div className="text-sm flex text-gray-300 tracking-normal">
              {
                totalViews
                  ? <div className='flex items-center'>
                    <Image src={require('@/assets/images/icons/eye.svg')} alt="eye" />
                    <p className="ml-2 mr-4">
                      {nFormatter(totalViews)}
                    </p>
                  </div>
                  : null
              }
              {
                totalFavorites
                  ? <div className='flex items-center'>
                    <Image src={require('@/assets/images/icons/white-heart.svg')} alt="heart" />
                    <p className="ml-2 mr-4">
                      {nFormatter(totalFavorites)}
                    </p>
                  </div>
                  : null
              }
            </div>
          </div>
        </div>

      </div>
    </WrapperItem >
  )
}
