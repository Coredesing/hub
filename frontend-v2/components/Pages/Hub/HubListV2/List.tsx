import clsx from 'clsx'
import { printNumber } from '@/utils'
import { CMC_ASSETS_DOMAIN_CHART } from '@/utils/constants'
import get from 'lodash.get'
import { useScreens } from '@/components/Pages/Home/utils'
import { nFormatter } from '@/components/Pages/Hub/utils'
import { useRouter } from 'next/router'
import { getNetworkByAlias } from '@/components/web3'
import Image from 'next/image'
import isEmpty from 'lodash.isempty'
import { format } from 'date-fns'
import { SORT_ALIAS } from '@/components/Pages/Hub/HubListV2/Filter'
import { networks as networkConfig } from '@/components/Pages/Hub/HubDetails'

type TblHeaderAlign = 'left' | 'center' | 'right' | 'justify' | 'char'

export const HEADERS = [
  { field: 'name', text: 'Game', align: 'left' as TblHeaderAlign, className: '' },
  { field: 'project.tokenomic.totalHolders', text: 'Player', align: 'left' as TblHeaderAlign, className: '' },
  { field: 'roi', text: 'TOKEN ROI', align: 'left' as TblHeaderAlign, className: 'px-1' },
  { field: 'project.tokenomic.volume24h', text: 'Volume 24h', align: 'left' as TblHeaderAlign, className: 'px-1' },
  { field: '', text: 'Network', align: 'center' as TblHeaderAlign, className: '' },
  { field: 'project.tokenomic.currentPrice', text: 'Price', align: 'right' as TblHeaderAlign, className: 'px-3' },
  { field: '', text: 'Last 7d activity', align: 'center' as TblHeaderAlign, className: '' }
]

export const DropIcon = ({ fillColor = 'currentColor', size = '8px', className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 8 6"
    // fill=""
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.00053 6C4.16353 6 4.31653 5.9205 4.41003 5.7865L7.91003 0.7865C8.01703 0.634 8.02903 0.4345 7.94403 0.269C7.85753 0.1035 7.68703 0 7.50053 0H0.499533C0.313033 0 0.142533 0.1035 0.0560328 0.269C-0.0289672 0.4345 -0.0169672 0.634 0.0900328 0.7865L3.59003 5.7865C3.68353 5.9205 3.83653 6 3.99953 6C4.00003 6 4.00003 6 4.00053 6C4.00003 6 4.00003 6 4.00053 6Z"
      fill={fillColor}
    />
  </svg>
)

export default function ListAggregatorV2 ({ data, sortedField, setSortedField }) {
  const router = useRouter()
  const screens = useScreens()

  const handleClickSortableHeader = (header) => {
    if (!header.field) return
    if (sortedField && sortedField.field === header.field) {
      if (sortedField.order === 'asc') {
        return setSortedField(null)
      }
      return setSortedField({ field: header.field, order: 'asc' })
    }

    return setSortedField({ field: header.field, order: 'desc' })
  }

  const onErrorChartImage = (id) => {
    const elm = document.getElementById(id) as HTMLImageElement
    if (!elm) return

    elm.replaceWith('')
    return true
  }

  return (
    (screens.mobile || screens.tablet)
      ? <div className='bg-[#242732] p-[10px]'>
        {(get(data, 'aggregators') || []).map((e) => {
          const totalViews = get(e, 'totalViews')
          const networksAlias = (get(e, 'project.tokenomic.network') || []).map(e => e.name)
          const networks = networksAlias.map(alias => getNetworkByAlias(alias)).filter(Boolean)
          const aggregatorName = get(e, 'name') || '-'
          const totalHolders = get(e, 'project.tokenomic.totalHolders')
          const createdAt = get(e, 'createdAt')
          const releaseDate = get(e, 'releaseDate')
          const totalFavorites = get(e, 'totalFavorites')
          const roi = get(e, 'roi')
          const rate = get(e, 'rate')

          let txtRate = printNumber(rate, 1)
          if (txtRate?.length === 1) {
            txtRate = `${txtRate}.0`
          }

          const openGameDetail = () => {
            const aggregatorSlug = get(e, 'slug')
            if (!aggregatorSlug) return
            router.push('/hub/[slug]', `/hub/${aggregatorSlug}`)
          }

          const sort = router.query.sort as string || ''
          const [field] = sort.split(':')
          let valueShow = '-'
          switch (field) {
          case 'createdAt':
            valueShow = createdAt ? format(new Date(createdAt), 'd LLL, yyyy') : '-'
            break
          case 'totalHolders':
            valueShow = nFormatter(totalHolders, 2)
            break
          case 'topReleased':
            valueShow = releaseDate ? format(new Date(releaseDate), 'd LLL, yyyy') : '-'
            break
          case 'totalViews':
            valueShow = ''
            break
          case 'totalFavorites':
            valueShow = nFormatter(totalFavorites, 2)
            break
          case 'roi':
            valueShow = roi > 0 ? `${roi}x` : '-'
            break
          case 'rate':
            valueShow = txtRate
            break
          default:
            valueShow = '-'
            break
          }

          return (
            <div key={e.id} className='flex py-[10px] last:pb-0 items-center gap-1 first:border-0 border-t-[1px] border-t-[#3B3E4A]' onClick={openGameDetail}>
              <img
                className="w-[46px] h-[46px] object-cover rounded-tl-sm rounded-bl-sm"
                src={get(e, 'rectangleThumbnail.url')}
                alt="game_img"
              />
              <div className='flex flex-col gap-1 w-full'>
                <div className='flex justify-between w-full'>
                  <div className='font-casual font-medium text-[13px] leading-[100%] text-white'>{aggregatorName}</div>
                  <div className='flex items-center gap-1'>
                    {field === 'rate' && <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.1441 5.43697L10.8281 4.80997L8.8971 0.898969C8.5591 0.215969 7.4411 0.215969 7.1031 0.898969L5.1731 4.80997L0.856096 5.43697C0.0390965 5.55597 -0.291904 6.56397 0.302096 7.14397L3.4261 10.188L2.6891 14.487C2.5501 15.301 3.4061 15.926 4.1401 15.541L8.0001 13.512L11.8611 15.542C12.5891 15.923 13.4521 15.308 13.3121 14.488L12.5751 10.189L15.6991 7.14497C16.2921 6.56397 15.9611 5.55597 15.1441 5.43697Z" fill="#FFB800" />
                    </svg>
                    }
                    <div className='font-casual font-semibold text-[13px] leading-[100%] text-white'>{valueShow}</div>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='flex min-w-[14px] items-center gap-1'>
                      {
                        !isEmpty(networks)
                          ? networks.map(e => <Image
                            key={`network_${e.id}`}
                            width={14}
                            height={14}
                            src={e.image}
                            alt=""
                          />)
                          : ''
                      }
                    </div>
                    <div className='w-[3px] h-[3px] rounded-full bg-[#7C7D84]'></div>

                    <div className='flex items-center gap-[6px] font-casual font-normal text-[12px] leading-[18px] text-[#D4D7E1]'>
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.9998 9.5C8.6998 9.5 10.7998 7.175 11.6998 5.825C12.0748 5.3 12.0748 4.625 11.6998 4.1C10.7998 2.825 8.6998 0.5 5.9998 0.5C3.2998 0.5 1.1998 2.825 0.299805 4.175C-0.0751953 4.7 -0.0751953 5.375 0.299805 5.825C1.1998 7.175 3.2998 9.5 5.9998 9.5ZM5.9998 2.75C7.2748 2.75 8.24981 3.725 8.24981 5C8.24981 6.275 7.2748 7.25 5.9998 7.25C4.7248 7.25 3.7498 6.275 3.7498 5C3.7498 3.725 4.7248 2.75 5.9998 2.75Z" fill="currentColor" />
                      </svg>
                      {totalViews ? printNumber(totalViews) : ''}
                    </div>
                  </div>

                  {/* <div>
                    {
                      priceChange7d && <div
                        className={clsx(
                          'flex items-center font-casual text-[10px] leading-[100%]',
                          priceChange7d > 0
                            ? 'text-[#6CDB00]'
                            : 'text-[#DE4343]'
                        )}
                      >
                        {
                          <DropIcon size='4px' className={clsx('mr-1', priceChange7d > 0 ? 'rotate-180' : '')}/>
                        }
                        {Math.abs(priceChange7d).toFixed(2)}%
                      </div>
                    }
                  </div> */}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      : <table className="table-auto w-full">
        <thead>
          <tr>
            {HEADERS.map((e, i) => {
              const isSorting = sortedField?.field === e.field
              const { sort: sortQuery } = router.query
              const existSortFilter = sortQuery
                ? (sortQuery as string).split(',').some(q => {
                  const [field] = q.split(':')
                  const fieldAlias = Object.entries(SORT_ALIAS).find(([key, value]) => {
                    return value === field
                  })
                  if (fieldAlias) {
                    return fieldAlias[0] === e.field
                  }
                  return field === e.field
                })
                : false
              const sortQueryLength = (sortQuery as string || '').split(',').length
              return (
                <th
                  key={`header_${i}`}
                  className={clsx(
                    'font-mechanic font-bold text-[13px] leading-[150%] tracking-[0.04em] uppercase text-white opacity-50 py-4',
                    e.className
                  )}
                  align={e.align}
                >
                  <div
                    className={clsx('flex w-fit items-center gap-1', (e.field && !existSortFilter) || (existSortFilter && sortQueryLength > 1) ? 'cursor-pointer' : '')}
                    onClick={() => (!existSortFilter || (existSortFilter && sortQueryLength > 1)) && handleClickSortableHeader(e)}
                  >
                    {e.text}
                    {isSorting && <DropIcon className={clsx(sortedField.order === 'asc' ? 'rotate-180' : '')} />}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {(get(data, 'aggregators') || []).map((e) => {
            const cmcId = get(e, 'project.tokenomic.cmcId')
            const currentPrice = get(e, 'project.tokenomic.currentPrice') || ''
            const priceChange7d = get(e, 'project.tokenomic.priceChange7d')
            const totalViews = get(e, 'totalViews')
            const rate = get(e, 'rate')
            const totalFavorites = get(e, 'totalFavorites')
            const networksAlias = (get(e, 'project.tokenomic.network') || []).map(e => e.name)
            const networks = networksAlias.map(alias => networkConfig.find(network => network.alias === alias))
            const totalHolders = get(e, 'project.tokenomic.totalHolders')
            const volume24h = get(e, 'project.tokenomic.volume24h')
            const roi = get(e, 'roi')
            let txtRate = printNumber(rate, 1)
            if (txtRate?.length === 1) {
              txtRate = `${txtRate}.0`
            }
            return (
              <tr
                key={e.id}
                className="border-b-4 border-gamefiDark-900 bg-gamefiDark-650 hover:bg-gamefiDark-600 cursor-pointer rounded overflow-hidden"
              // onClick={openGameDetail}
              >
                <td>
                  <a className="flex" href={`/hub/${get(e, 'slug')}`}>
                    <div className='w-[90px] h-[90px] '>
                      <img
                        className="w-full h-full object-cover"
                        src={get(e, 'rectangleThumbnail.url')}
                        alt="game_img"
                      />
                    </div>
                    <div className="flex flex-col gap-[10px] px-[18px] py-6">
                      <div className="font-casual font-semibold text-sm leading-[100%] text-white">
                        {get(e, 'name') || ''}
                      </div>
                      <div className="flex gap-2">
                        {
                          <div className="w-[52px] flex items-center gap-[6px] font-casual font-normal text-[12px] leading-[18px] text-[#D4D7E1]">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.3581 4.08066L8.12107 3.61041L6.67282 0.677156C6.41932 0.164906 5.58082 0.164906 5.32732 0.677156L3.87982 3.61041L0.642072 4.08066C0.0293224 4.16991 -0.218928 4.92591 0.226572 5.36091L2.56957 7.64391L2.01682 10.8682C1.91257 11.4787 2.55457 11.9474 3.10507 11.6587L6.00007 10.1369L8.89582 11.6594C9.44182 11.9452 10.0891 11.4839 9.98407 10.8689L9.43132 7.64466L11.7743 5.36166C12.2191 4.92591 11.9708 4.16991 11.3581 4.08066Z" fill="#FFB800" />
                            </svg>

                            {txtRate}
                          </div>
                        }
                        <div className="w-[80px] flex items-center gap-[6px] font-casual font-normal text-[12px] leading-[18px] text-[#D4D7E1]">
                          <svg
                            width="12"
                            height="10"
                            viewBox="0 0 12 10"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.9998 9.5C8.6998 9.5 10.7998 7.175 11.6998 5.825C12.0748 5.3 12.0748 4.625 11.6998 4.1C10.7998 2.825 8.6998 0.5 5.9998 0.5C3.2998 0.5 1.1998 2.825 0.299805 4.175C-0.0751953 4.7 -0.0751953 5.375 0.299805 5.825C1.1998 7.175 3.2998 9.5 5.9998 9.5ZM5.9998 2.75C7.2748 2.75 8.24981 3.725 8.24981 5C8.24981 6.275 7.2748 7.25 5.9998 7.25C4.7248 7.25 3.7498 6.275 3.7498 5C3.7498 3.725 4.7248 2.75 5.9998 2.75Z"
                              fill="currentColor"
                            />
                          </svg>

                          {totalViews ? printNumber(totalViews) : ''}
                        </div>
                        <div className="flex items-center gap-[6px] font-casual font-normal text-[12px] leading-[18px] text-[#D4D7E1]">
                          <svg
                            width="12"
                            height="10"
                            viewBox="0 0 12 10"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.25024 0.500015C7.82321 0.498838 7.40098 0.590136 7.01259 0.767633C6.62419 0.945131 6.27883 1.20462 6.00024 1.52827C5.72165 1.20462 5.37629 0.945131 4.98789 0.767633C4.5995 0.590136 4.17727 0.498838 3.75024 0.500015C3.16118 0.500927 2.58543 0.675234 2.09478 1.0012C1.60414 1.32716 1.22031 1.79036 0.991168 2.33302C0.762027 2.87568 0.697712 3.47379 0.806246 4.05276C0.91478 4.63173 1.19136 5.16594 1.60149 5.58877L5.73249 9.81052C5.7674 9.84613 5.80906 9.87442 5.85503 9.89374C5.90101 9.91306 5.95037 9.92301 6.00024 9.92302C6.05029 9.92301 6.09983 9.91299 6.14594 9.89354C6.19205 9.87409 6.23381 9.8456 6.26874 9.80977L10.255 5.71926C10.7068 5.31473 11.0249 4.78243 11.1672 4.19294C11.3095 3.60345 11.2693 2.98463 11.0519 2.41853C10.8344 1.85243 10.4501 1.3658 9.9497 1.02316C9.44934 0.680531 8.85666 0.498084 8.25024 0.500015Z"
                              fill="currentColor"
                            />
                          </svg>

                          {totalFavorites ? printNumber(totalFavorites) : ''}
                        </div>
                      </div>
                    </div>
                  </a>
                </td>
                <td style={{ verticalAlign: 'bottom', paddingBottom: '24px' }}>
                  <a href={`/hub/${get(e, 'slug')}`} className="font-casual font-normal text-sm leading-[100%] text-white text-left">
                    {nFormatter(totalHolders)}
                  </a>
                </td>
                <td style={{ verticalAlign: 'bottom', paddingBottom: '24px' }}>
                  <a href={`/hub/${get(e, 'slug')}`} className="font-casual font-normal text-sm leading-[100%] text-white text-left px-1">
                    {roi ? `${printNumber(roi)}x` : '-'}
                  </a>
                </td>
                <td style={{ verticalAlign: 'bottom', paddingBottom: '24px' }}>
                  <a href={`/hub/${get(e, 'slug')}`} className="font-casual font-normal text-sm leading-[100%] text-white text-left px-1">
                    {volume24h > 0 ? nFormatter(volume24h) : '-'}
                  </a>
                </td>
                <td style={{ verticalAlign: 'bottom', paddingBottom: '24px' }}>
                  <a href={`/hub/${get(e, 'slug')}`} className='flex min-w-[22px] items-center justify-center gap-1'>
                    {
                      !isEmpty(networks)
                        ? networks.map(e => <Image
                          key={`network_${e.id}`}
                          width={22}
                          height={22}
                          src={e.image}
                          alt=""
                        />)
                        : ''
                    }
                  </a>
                </td>
                <td align="right" style={{ verticalAlign: 'bottom', paddingBottom: '24px' }}>
                  <a href={`/hub/${get(e, 'slug')}`} className="flex flex-col w-full gap-3 px-3">
                    <div className="font-casual font-medium text-[15px] leading-[150%] text-white">
                      {+currentPrice ? `$${printNumber(currentPrice, 5)}` : '-'}
                    </div>
                    {(priceChange7d > 0 || priceChange7d < 0) && (
                      <div
                        className={clsx(
                          'font-casual flex items-center justify-end text-[10px] font-medium leading-[100%]',
                          priceChange7d > 0
                            ? 'text-[#6CDB00]'
                            : 'text-[#DE4343]'
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
                    )}
                  </a>
                </td>
                <td align="right">
                  {cmcId && (
                    <a href={`/hub/${get(e, 'slug')}`} className='pr-[18px] block'>
                      <img
                        id={`chart_cmc_${cmcId}`}
                        src={`https://${CMC_ASSETS_DOMAIN_CHART}/generated/sparklines/web/7d/usd/${cmcId}.svg`}
                        alt={`CMC ${get(e, 'project.tokenomic.cmcId')}`}
                        className={
                          parseFloat(
                            get(e, 'project.tokenomic.priceChange7d') || 0
                          ) > 0
                            ? 'hue-rotate-90'
                            : '-hue-rotate-60 -saturate-150 contrast-150 brightness-75'
                        }
                        onError={() => onErrorChartImage(`chart_cmc_${cmcId}`)}
                      />
                    </a>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
  )
}
