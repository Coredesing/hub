import React from 'react'
import Image from 'next/image'
import { checkPathImage } from '@/utils/image'
import { formatPrice } from '@/utils'
import Link from 'next/link'
import { nFormatter } from '@/components/Pages/Hub/utils'
import ImageLoader from '@/components/Base/ImageLoader'
import get from 'lodash.get'
import { useScreens } from '@/components/Pages/Home/utils'
import { WrapperItem } from '../HubHome/StyleElement'
import Tippy from '@tippyjs/react'
import styles from '../HubList/hubList.module.scss'
import { PriceChangeBg } from './PriceChange'

function handleWidth (screens: { mobile: any; tablet: any; md?: boolean; lg: any; xl?: boolean }) {
  switch (true) {
  case screens.mobile:
  case screens.tablet:
    return {
      minWidth: '210px'
    }
  default:
    return { width: 'calc(20% - 13px)' }
  }
}

export default function ItemCarousel ({ item, index }: any) {
  const { rate, verticalThumbnail, mobileThumbnail, name, totalViews, totalFavorites, slug, tokenomic, shortDesc, categories } = item
  const icon = get(tokenomic, 'icon.data.attributes', {})
  const style = handleWidth(useScreens())

  return (
    <WrapperItem key={index} className="w-full mr-4 last:mr-0 h-full" style={style}>
      <div className="rounded p-px h-full">
        <div className='h-full rounded relative flex flex-col group'>
          <div
            className="z-10 absolute h-1/3 w-full items-start top-0 left-0 pt-2 pr-2 pl-5 flex justify-between"
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
          </div>
          <Link href={`/hub/${slug}`} passHref>
            <div className=" cursor-pointer relative w-full h-[272px] sm:h-[250px] xl:h-[309px] overflow-hidden">
              <div
                className="absolute h-1/3 w-full items-start top-0 left-0 pt-2 pr-2 pl-5 opacity-90 flex justify-between group-hover:h-full group-hover:transition-[height] duration-0 group-hover:duration-1000"
                style={{ background: 'linear-gradient(180deg, #15171E 0%, rgba(21, 23, 30, 0) 100%)' }}
              ></div>
              <div className="bg-black flex items-center justify-center w-full h-full" style={{ aspectRatio: '1' }}>
                <ImageLoader src={checkPathImage(verticalThumbnail.url)} className="w-full h-full object-contain" />
              </div>
            </div>
          </Link>
          <div className="w-full pt-2 pb-2 flex flex-col flex-1 justify-between font-casual">
            <div className="mb-2">
              <Tippy
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
                      src={checkPathImage(get(mobileThumbnail, 'data.[0].attributes.url', '/'))}
                      alt={name || 'game'}
                      className={`${styles.banner} hover:cursor-pointer`} />
                    <div className="px-3 pt-2">
                      <div className="mb-3 line-clamp-1">
                        {categories?.data?.map(v => (
                          <div key={v?.attributes?.slug} className={`${styles.cardLink} mr-2 mb-2 bg-gamefiDark-500 hover:bg-gamefiDark-300 text-white px-4 py-1 inline-block rounded font-normal`}>
                            {v?.attributes?.name}
                          </div>
                        ))}
                      </div>
                      <div className="truncate uppercase font-bold text-lg mb-2">{name}</div>
                      <div className="flex-none font-casual text-sm w-20 xl:w-48">
                        <p className="font-medium inline-flex items-center text-base mb-3">
                          {formatPrice(get(tokenomic, 'currentPrice', '-'))}
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
