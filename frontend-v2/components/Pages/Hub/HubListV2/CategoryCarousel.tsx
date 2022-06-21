import { useEffect, useRef, useState } from 'react'
import Flicking from '@egjs/react-flicking'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'
import arrowLeft from '@/assets/images/icons/arrow-left.png'
import arrowRight from '@/assets/images/icons/arrow-right.png'
import get from 'lodash.get'
import clsx from 'clsx'
import { CMC_ASSETS_DOMAIN_CHART } from '@/utils/constants'
import { printNumber } from '@/utils'
import { AutoPlay, Sync } from '@egjs/flicking-plugins'
import { useScreens } from '@/components/Pages/Home/utils'

export const DropIcon = ({
  fillColor = 'currentColor',
  size = '8px',
  className = ''
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 8 6"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.00053 6C4.16353 6 4.31653 5.9205 4.41003 5.7865L7.91003 0.7865C8.01703 0.634 8.02903 0.4345 7.94403 0.269C7.85753 0.1035 7.68703 0 7.50053 0H0.499533C0.313033 0 0.142533 0.1035 0.0560328 0.269C-0.0289672 0.4345 -0.0169672 0.634 0.0900328 0.7865L3.59003 5.7865C3.68353 5.9205 3.83653 6 3.99953 6C4.00003 6 4.00003 6 4.00053 6C4.00003 6 4.00003 6 4.00053 6Z"
      fill={fillColor}
    />
  </svg>
)

const CategoryCarousel = ({ top5Aggregators, defaultTop5Aggregators }) => {
  const [plugins, setPlugins] = useState([])
  const [isMobileAndTablet, setIsMobileAndTablet] = useState(false)

  const refSlider = useRef(null)
  const screens = useScreens()

  useEffect(() => {
    setIsMobileAndTablet(screens.mobile || screens.tablet)
  }, [screens.mobile, screens.tablet])

  useEffect(() => {
    setPlugins([
      new Sync({
        type: 'index',
        synchronizedFlickingOptions: [
          {
            flicking: refSlider.current,
            isSlidable: true
          }
        ]
      }),
      new AutoPlay({ duration: 5000, direction: 'NEXT', stopOnHover: true })
    ])
  }, [])

  const prev = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.prev().catch(() => {})
  }
  const next = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.next().catch(() => {})
  }

  const onErrorChartImage = (id) => {
    const elm = document.getElementById(id) as HTMLImageElement
    if (!elm) return

    elm.replaceWith('')
    return true
  }

  const onTokenIconError = (id) => {
    const elm = document.getElementById(id) as HTMLImageElement
    if (!elm) return

    elm.replaceWith('')
    return true
  }

  return (
    <div className="mt-4">
      {isMobileAndTablet && (
        <div className="flex flex-col w-full">
          <Flicking
            circular={true}
            className="w-full"
            align="center"
            ref={refSlider}
            interruptable={true}
            plugins={plugins}
          >
            {(top5Aggregators?.length ? top5Aggregators : defaultTop5Aggregators).map((e) => {
              const currentPrice = get(e, 'project.tokenomic.currentPrice') || ''
              const cmcId = get(e, 'project.tokenomic.cmcId')
              const tokenomicIcon = get(e, 'project.tokenomic.icon.url')
              const priceChange7d = get(e, 'project.tokenomic.priceChange7d')
              return (
                <div className="flex flex-col w-full" key={`game_${e.id}`}>
                  <div className={clsx('w-full')}>
                    <img
                      className="w-full object-cover h-[210px]"
                      src={get(e, 'gallery[0].url')}
                      alt="game_img"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6 bg-black">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-2 mb-[10px]">
                        {tokenomicIcon && <img
                          id={`token_icon_${e.id}`}
                          className="w-[22px] h-[22px] rounded-full"
                          src={tokenomicIcon}
                          alt="token_icon"
                          onError={() => onTokenIconError(`token_icon_${e.id}`)}
                        />}
                        <a href={`/hub/${get(e, 'slug')}`}>
                          <div className="font-mechanic font-bold text-base leading-[100%] uppercase text-white cursor-pointer hover:underline">
                            {get(e, 'name')}
                          </div>
                        </a>
                      </div>
                      <div className="text-ellipsis whitespace-nowrap overflow-hidden font-casual font-normal text-[13px] leading-[150%] text-white">
                        {get(e, 'project.shortDesc') || ''}
                      </div>
                    </div>
                    <div className="flex w-full justify-between items-center mt-4 mb-2">
                      <div className="flex flex-col gap-2">
                        <div className="uppercase font-mechanic font-bold text-[13px] tracking-[0.04em] text-white opacity-50">
                          Token Price
                        </div>
                        <div className="flex gap-3">
                          <div className="font-casual font-medium text-[15px] leading-[150%] text-white">
                            {currentPrice > 0
                              ? `$${printNumber(currentPrice, 5)}`
                              : '-'}
                          </div>
                          {(priceChange7d > 0 || priceChange7d < 0)
                            ? (
                              <div
                                className={clsx(
                                  'flex rounded-sm px-[6px] items-center text-[11px] leading-[150%]',
                                  priceChange7d > 0
                                    ? 'bg-[#6CDB00] text-black'
                                    : 'bg-[#DE4343] text-white'
                                )}
                              >
                                {
                                  <DropIcon
                                    className={clsx(
                                      'mr-1',
                                      priceChange7d > 0
                                        ? 'rotate-180'
                                        : ''
                                    )}
                                  />
                                }
                                {Math.abs(priceChange7d).toFixed(2)}%
                              </div>
                            )
                            : null}
                        </div>
                      </div>
                      {cmcId && <img
                        id={`chart_cmc_${cmcId}`}
                        src={`https://${CMC_ASSETS_DOMAIN_CHART}/generated/sparklines/web/7d/usd/${cmcId}.svg`}
                        alt={`CoinMarketCap ${get(
                          e,
                          'project.tokenomic.name'
                        )}`}
                        className={
                          parseFloat(
                            get(e, 'project.tokenomic.priceChange7d') || 0
                          ) > 0
                            ? 'hue-rotate-90'
                            : '-hue-rotate-60 -saturate-150 contrast-150 brightness-75'
                        }
                        onError={() => onErrorChartImage(`chart_cmc_${cmcId}`)}
                      ></img>}
                    </div>
                  </div>
                </div>
              )
            })}
          </Flicking>
        </div>
      )}
      {!isMobileAndTablet && (
        <div className="flex mt-8 gap-8 px-4 2xl:px-[84px]">
          <div className="hidden sm:block">
            <img
              src={arrowLeft.src}
              alt=""
              className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none"
              onClick={prev}
            />
          </div>
          <Flicking
            circular={true}
            className="flex-1"
            align="center"
            ref={refSlider}
            interruptable={true}
            plugins={plugins}
          >
            {(top5Aggregators?.length ? top5Aggregators : defaultTop5Aggregators).map((e) => {
              const countGalleryUrl = e?.gallery?.length || 0
              let image2Class = 'row-span-2 col-span-2'
              let image3Class = 'row-span-2 col-span-2'

              if (countGalleryUrl === 2) {
                image2Class = 'col-span-4 row-span-4'
              }
              if (countGalleryUrl === 3) {
                image3Class = 'row-span-2 col-span-4'
                image2Class = 'row-span-2 col-span-4'
              }
              if (countGalleryUrl === 4) {
                image2Class = 'row-span-2 col-span-4'
              }
              const currentPrice = get(e, 'project.tokenomic.currentPrice') || ''
              const cmcId = get(e, 'project.tokenomic.cmcId')
              const tokenomicIcon = get(e, 'project.tokenomic.icon.url')
              const priceChange7d = get(e, 'project.tokenomic.priceChange7d')
              return (
                <div className="flex flex-col w-full" key={`game_${e.id}`}>
                  <div className="grid grid-flow-col grid-cols-9 grid-rows-4 w-full flex-1 gap-[2px]">
                    <div
                      className={clsx(
                        'row-span-4 col-span-5 ',
                        countGalleryUrl === 1 ? 'col-span-full' : ''
                      )}
                    >
                      <img
                        className="w-full h-full object-cover max-h-[340px]"
                        src={get(e, 'gallery[0].url')}
                        alt="game_img"
                      />
                    </div>
                    {countGalleryUrl >= 2 && (
                      <div className={clsx(image2Class, '')}>
                        <img
                          className="w-full h-full object-cover max-h-[169px]"
                          src={get(e, 'gallery[1].url')}
                          alt="game_img"
                        />
                      </div>
                    )}
                    {countGalleryUrl >= 3 && (
                      <div className={clsx(image3Class, '')}>
                        <img
                          className="w-full h-full object-cover max-h-[169px]"
                          src={get(e, 'gallery[2].url')}
                          alt="game_img"
                        />
                      </div>
                    )}
                    {countGalleryUrl >= 4 && (
                      <div className="row-span-2 col-span-2 ">
                        <img
                          className="w-full h-full object-cover max-h-[169px]"
                          src={get(e, 'gallery[3].url')}
                          alt="game_img"
                        />
                      </div>
                    )}
                    {countGalleryUrl >= 5 && (
                      <div className="row-span-2 col-span-2 ">
                        <img
                          className="w-full h-full object-cover max-h-[169px]"
                          src={get(e, 'gallery[4].url')}
                          alt="game_img"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between py-[28px] px-[32px] bg-black">
                    <div className="flex flex-col w-7/12">
                      <div className="flex items-center gap-2 mb-[10px]">
                        {
                          tokenomicIcon && <img
                            id={`token_icon_${e.id}`}
                            className="w-[22px] h-[22px] rounded-full"
                            src={tokenomicIcon}
                            alt="token_icon"
                            onError={() => onTokenIconError(`token_icon_${e.id}`)}
                          />
                        }
                        <a href={`/hub/${get(e, 'slug')}`}>
                          <div className="font-mechanic font-bold text-2xl leading-[100%] uppercase text-white cursor-pointer hover:underline">
                            {get(e, 'name')}
                          </div>
                        </a>
                      </div>
                      <div className="text-ellipsis whitespace-nowrap overflow-hidden font-casual font-normal text-sm leading-[150%] text-white">
                        {get(e, 'project.shortDesc') || ''}
                      </div>
                    </div>
                    <div className="flex w-4/12 justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <div className="uppercase font-mechanic font-bold text-[13px] tracking-[0.04em] text-white opacity-50">
                          Token Price
                        </div>
                        <div className="flex gap-3">
                          <div className="font-casual font-medium text-[15px] leading-[150%] text-white">
                            {currentPrice > 0
                              ? `$${printNumber(currentPrice, 5)}`
                              : '-'}
                          </div>
                          {(priceChange7d > 0 || priceChange7d < 0)
                            ? (
                              <div
                                className={clsx(
                                  'flex rounded-sm px-2 items-center',
                                  priceChange7d > 0
                                    ? 'bg-[#6CDB00] text-black'
                                    : 'bg-[#DE4343] text-white'
                                )}
                              >
                                {
                                  <DropIcon
                                    className={clsx(
                                      'mr-1',
                                      priceChange7d > 0
                                        ? 'rotate-180'
                                        : ''
                                    )}
                                  />
                                }
                                {Math.abs(priceChange7d).toFixed(2)}%
                              </div>
                            )
                            : ''}
                        </div>
                      </div>
                      <img
                        id={`chart_cmc_${cmcId}`}
                        src={`https://${CMC_ASSETS_DOMAIN_CHART}/generated/sparklines/web/7d/usd/${cmcId}.svg`}
                        alt={`CoinMarketCap ${get(
                          e,
                          'project.tokenomic.name'
                        )}`}
                        className={
                          parseFloat(
                            get(e, 'project.tokenomic.priceChange7d') || 0
                          ) > 0
                            ? 'hue-rotate-90'
                            : '-hue-rotate-60 -saturate-150 contrast-150 brightness-75'
                        }
                        onError={() => onErrorChartImage(`chart_cmc_${cmcId}`)}
                      ></img>
                    </div>
                  </div>
                </div>
              )
            })}
          </Flicking>
          <div className="hidden sm:block">
            <img
              src={arrowRight.src}
              alt=""
              className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none"
              onClick={next}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryCarousel
