import React from 'react'
import Image from 'next/image'
import { imageCMS } from '@/utils'
import { nFormatter } from '@/components/Pages/Hub/utils'
import Link from 'next/link'
import ImageLoader from '@/components/Base/ImageLoader'
import get from 'lodash.get'
import { useScreens } from '@/components/Pages/Home/utils'
import { WrapperItem } from './StyleElement'

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
  const { rate, tokenomic, verticalThumbnail, name, totalViews, totalFavorites, slug } = item
  const icon = get(tokenomic, 'icon.data.attributes', {})
  const style = handleWidth(useScreens())

  return (
    <WrapperItem key={index} className="w-full mr-4 last:mr-0 h-full" style={style}>
      <div className="rounded overflow-hidden p-px h-full">
        <div className='h-full rounded relative flex flex-col group'>
          <Link href={`/hub/${slug}`} passHref>
            <div
              className="z-10 absolute h-1/3 w-full items-start top-0 left-0 pt-2 pr-2 pl-5 flex justify-between hover:cursor-pointer"
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
                      src={imageCMS(icon.url)}
                      alt={icon.name}
                    />
                  </div>
                )}
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
          <div className="w-full pt-2 pb-2 flex flex-col flex-1 justify-between font-casual">
            <div className="mb-2">
              <Link href={`/hub/${slug}`} passHref>
                <a className="group-hover:text-gamefiGreen-700 font-semibold text-base tracking-wide cursor-pointer hover:underline line-clamp-1">
                  {name}
                </a>
              </Link>
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
