import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { printNumber, imageCMS } from '@/utils'
import PriceChange from '@/components/Pages/Hub/PriceChange'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'
import { useScreens } from '@/components/Pages/Home/utils'
import { WrapperSection, WrapperItem } from './StyleElement'
import { formatPriceHub } from '../utils'
import HubTitle from '../HubTitle'

function handleResponsive (screens: { mobile: any; tablet: any; md?: boolean; lg: any; xl?: boolean }) {
  let width: string
  switch (true) {
  case screens.mobile:
    width = '220px'
    break
  case screens.tablet:
    width = '195px'
    break
  case screens.lg:
    width = '180px'
    break
  case screens.xl:
    width = '180px'
    break
  default:
    width = '200px'
    break
  }
  return width
}

const Item = ({ item }) => {
  const screens = useScreens()
  const width = handleResponsive(screens)

  return (
    <WrapperItem style={{ minWidth: width }} className="pr-4 xl:pr-0 tracking-normal">
      <div className="rounded overflow-hidden p-px h-full group">
        <div className='h-full rounded relative flex flex-col'>
          <div className="pl-[1px] absolute z-10 h-[27px] w-1/2 inline-flex align-middle items-center uppercase text-xs text-left dark:bg-gamefiDark-900 clipped-b-r-full">
            <Image src={require('@/assets/images/icons/user.svg')} alt="user" width={12}></Image>
            <span className="ml-2 font-bold text-base">{printNumber(get(item, 'project.tokenomic.totalHolders'))}</span>
          </div>

          <Link href={`/hub/${item?.slug}`} passHref>
            <div className="cursor-pointer w-full h-[272px] sm:h-[250px] 2xl:h-[309px] overflow-y-hidden relative">
              <div className="bg-black flex items-center justify-center cursor-pointer w-full h-full" style={{ aspectRatio: '1' }}>
                <img className="w-full h-full object-cover" src={imageCMS(get(item, 'verticalThumbnail.url'))} alt="img" />
              </div>
              <div
                className="absolute h-full w-full items-start top-0 left-0 pt-2 pr-2 pl-5 opacity-90 flex justify-between group-hover:h-1/2 group-hover:transition-[height] duration-0 group-hover:duration-200"
                style={{ background: 'linear-gradient(180deg, #15171E 0%, rgba(21, 23, 30, 0) 100%)' }}
              ></div>
              {/* <div className="absolute h-1/3 w-full bottom-0 left-0 opacity-80" style={{ transform: 'rotate(-180deg)', background: 'linear-gradient(180deg, #15171E 0%, rgba(21, 23, 30, 0) 100%)' }} /> */}
            </div>
          </Link>

          <div className="w-full pt-2 pb-2 flex flex-col flex-1 justify-between font-casual">
            <div className="mb-2">
              <Link href={`/hub/${item?.slug}`} passHref>
                <a className="group-hover:text-gamefiGreen-700 font-semibold text-base cursor-pointer hover:underline">
                  {item.name}
                </a>
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 flex flex-row">
                <div className="flex align-middle items-center">
                  {get(item, 'project.tokenomic.icon.url') && (
                    <img
                      width={21}
                      height={21}
                      src={imageCMS(get(item, 'project.tokenomic.icon.url'))}
                      alt=""
                    />
                  )}
                  <p className="ml-2 text-[15px] font-normal">
                    {item?.currentPrice || '-'}
                  </p>
                </div>
              </div>
              <div>
                <PriceChange className="ml-2 text-[11px] font-casual font-medium" priceChange24h={get(item, 'project.tokenomic.priceChange24h')} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </WrapperItem>
  )
}

export default function TopPlayerHub ({ data: propData }) {
  const data = useMemo(() => {
    return propData?.map(e => {
      return { ...e, currentPrice: formatPriceHub(`${get(e, 'project.tokenomic.currentPrice') ?? ''}`) }
    })
  }, [propData])

  return (
    <WrapperSection>
      <HubTitle title="Most popular" source="player" />
      <div className="relative">
        <div className={'flex sm:hidden w-full overflow-x-auto hide-scrollbar'}>
          {!isEmpty(data)
            ? data.map((item, i) => (
              <Item key={`topPlayerHub-${i}`} item={item} />
            )
            )
            : <></>}
        </div>
        <div className={'hidden sm:grid sm:grid-cols-3-auto lg:grid-cols-3-auto xl:grid-cols-4-auto gap-2 lg:gap-4 justify-center'}>
          {!isEmpty(data)
            ? data.map((item, i) => (
              <Item key={`topPlayerHub-${i}`} item={item} />
            )
            )
            : <></>}
        </div>
      </div>
    </WrapperSection >
  )
}
