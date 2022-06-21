import React, { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import { Pagination, AutoPlay } from '@egjs/flicking-plugins'
import { checkPathImage } from '@/utils/image'
import { format } from 'date-fns'
import clsx from 'clsx'
import { nFormatter } from '@/components/Pages/Hub/utils'
import styles from './home.module.scss'
import { getNetworkByAlias } from '@/components/web3'
import { useScreens } from '@/components/Pages/Home/utils'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'
import get from 'lodash.get'
import { WrapperSection } from './StyleElement'

const handleAspectRatio = (screens) => {
  let aspectRatio
  switch (true) {
  case screens.tablet:
    aspectRatio = '839/500'
    break
  case screens.md:
    aspectRatio = '839/520'
    break
  case screens.lg:
    aspectRatio = '839/460'
    break
  case screens.xl:
    aspectRatio = '839/401'
    break
  default:
    aspectRatio = '376/310'
    break
  }
  return aspectRatio
}

const GameBanner = ({ data }) => {
  const refSlider = useRef(null)
  const [plugins] = useState([
    new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[2px] w-[64px] bg-gamefiDark-400"></div>'
      }
    }),
    new AutoPlay({ duration: 3000, direction: 'NEXT', stopOnHover: true })
  ])

  const dataFormatted = useMemo(() => {
    return data?.map(e => {
      const firstNetwork = getNetworkByAlias(get(e, 'project.tokenomic.network.[0].name'))
      const pureCategories = get(e, 'project.categories')
      const categories = pureCategories?.slice(0, 3).reduce((t, item) => `${t ? `${t}, ` : ''}${item.name}`, '')

      return { ...e, banner: get(e, 'project.banner', {}), firstNetwork, categories: pureCategories?.length > 3 ? categories.concat('...') : categories }
    })
  }, [data])

  const prev = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.prev().catch(() => { })
  }
  const next = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.next().catch(() => { })
  }
  const screens = useScreens()
  const isMobile = screens.mobile
  return (
    <WrapperSection>
      <div className="group relative">
        {/* <div className="hidden group-hover:block absolute inset-y-2/4 left-2 z-10"> */}
        <div className="group-hover:xl:block absolute inset-y-2/4 left-2 z-10 hidden">
          <button
            onClick={prev}
            className={clsx(styles.arrow, 'bg-white/10 hover:bg-white w-7 h-7 group1  clipped-b-l p-px rounded cursor-pointer disabled:cursor-not-allowed')}
          // disabled={loading}
          >
            <div className={clsx('bg-white/10 flex items-center justify-center clipped-b-l py-2 px-2 rounded leading-5')}>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 13L1 7L7 1" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        </div>
        <Flicking circular={true} plugins={plugins} className="flex-1" ref={refSlider} align="center" interruptable={true}>
          {dataFormatted?.map(item => (
            <div key={`game-${item.slug}`} className="w-full relative pb-40 sm:pb-0">
              <div className="relative">
                <img
                  src={checkPathImage(item.banner.url)}
                  className="rounded"
                  alt={item.slug}
                  style={{ width: '100%', height: '472px', objectFit: 'cover', aspectRatio: handleAspectRatio(screens) }}
                />
                <div
                  className="hidden sm:block absolute bg-gamefiDark-900 right-[-15px] bottom-[-15px] w-[30px] h-[30px] rotate-45"
                >
                </div>
                <div className="hidden sm:block absolute right-0 bottom-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.68 8.32L16 0V16H0L7.68 8.32Z" fill="#6CDB00" />
                  </svg>
                </div>
                <div
                  className="sm:hidden absolute bottom-0 left-0 h-80 w-full"
                  style={{ background: 'linear-gradient(180deg, rgba(21, 23, 30, 0) 0%, #15171E 75.76%)' }}
                >
                </div>
              </div>
              < div
                className="absolute w-full lg:w-3/4 xl:w-2/3 bottom-0 sm:top-0 left-0 sm:h-full sm:pt-5 xl:pt-12 px-5 md:pl-5 xl:pl-12"
                style={{
                  background: isMobile ? '' : 'linear-gradient(90deg, #15171E 0%, rgba(21, 23, 30, 0.7) 68.75%, rgba(21, 23, 30, 0) 100%)'
                }}
              >
                <div className="col-span-12 mb-7 xl:mb-0 md:col-span-10 2xl:col-span-8">
                  <div className="flex justify-between mb-2 md:mb-3">
                    <div className="uppercase font-bold text-2xl xl:text-4xl">
                      {item.name}
                    </div>
                    {item.firstNetwork && (
                      <div className="flex align-middle items-center sm:hidden">
                        {item.firstNetwork.image && (
                          <Image
                            width={21}
                            height={21}
                            src={item.firstNetwork.image}
                            alt=""
                          />
                        )}
                        <p className="ml-2 tracking-widest text-gray-200 uppercase">
                          {item.firstNetwork.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex align-middle items-center w-full mb-5 xl:mb-5 text-sm md:text-base font-casual">
                    <div className="flex align-middle items-center flex-1 sm:flex-initial">
                      <Image src={require('@/assets/images/icons/star.svg')} alt="star" />
                      <p className="ml-2 text-gray-200">
                        {(item.rate || 0).toFixed(1)}{' '}
                        <span className="text-gray-400">({nFormatter(item.totalVotes || 0)} Rating{item.totalVotes > 1 ? 's' : ''})</span>
                      </p>
                    </div>
                    <div className="text-gamefiGreen-700 mx-3 md:mx-4 2xl:mx-9 flex-1 sm:flex-initial line-clamp-1">
                      {get(item, 'project.studio[0].name')}
                    </div>
                    {item.firstNetwork && (
                      <div className="align-middle items-center hidden sm:flex">
                        {item.firstNetwork.image && (
                          <Image
                            width={21}
                            height={21}
                            src={item.firstNetwork.image}
                            alt=""
                          />
                        )}
                        <p className="ml-2 tracking-widest text-gray-200 uppercase">
                          {item.firstNetwork.alias}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-5 xl:mb-5">
                    <p className="font-casual text-left leading-5 text-sm md:text-base max-h-32 2xl:max-h-64 overflow-y-scroll line-clamp-2 md:line-clamp-3">{item.project?.shortDesc}</p>
                  </div>

                  <div className="mb-4 xl:mb-5 text-sm font-casual">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4 md:col-span-3 font-semibold">Release Status:</div>
                      <div className="col-span-8 md:col-span-9 capitalize">{item.releaseStatus}</div>
                    </div>
                    {item.releaseDate && <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4 md:col-span-3 font-semibold">Release Date:</div>
                      <div className="col-span-8 md:col-span-9">{format(new Date(item.releaseDate), 'dd MMM,yyyy')}</div>
                    </div>}
                    {item.categories && <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4 md:col-span-3 font-semibold">Categories:</div>
                      <div className="col-span-8 md:col-span-9">{item.categories}</div>
                    </div>}
                  </div>
                  <div className="mb-3 xl:mb-5">
                    <Link href={`/hub/${item?.slug}`} passHref>
                      <div className="bg-gamefiGreen-700 text-gamefiDark-900 py-2.5 px-4 md:px-6 rounded-xs clipped-t-r hover:opacity-90 w-full md:w-36 cursor-pointer">
                        <a className="flex align-middle items-center justify-center">
                          <div className="mr-2 uppercase font-bold text-xs">READ MORE</div>
                        </a>
                      </div>
                    </Link>
                  </div>

                </div>
              </div >
            </div >
          ))}
          <ViewportSlot>
            <div className={clsx('flicking-pagination !relative flex items-center justify-center md:justify-start md:pl-5 xl:pl-12 gap-1', screens['2xl'] ? '!bottom-12' : 'xl:!bottom-5')}></div>
            <div></div>
          </ViewportSlot>
        </Flicking >
        <div className="group-hover:xl:block absolute inset-y-2/4 right-2 z-10 hidden">
          <button
            onClick={next}
            className={clsx(styles.arrow, 'bg-white/10 hover:bg-white w-7 h-7 group1  clipped-t-r p-px rounded cursor-pointer disabled:cursor-not-allowed')}
          // disabled={loading}
          >
            <div className={clsx('bg-white/10 flex items-center justify-center clipped-t-r py-2 px-2 rounded leading-5')}>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

            </div>
          </button>
        </div>
      </div>
    </WrapperSection >
  )
}

export default GameBanner
