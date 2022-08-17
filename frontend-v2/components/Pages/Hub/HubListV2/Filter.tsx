import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import get from 'lodash.get'
import { debounce, printNumber } from '@/utils'
import Pagination from '@/components/Pages/Market/Pagination'
import { useScreens } from '@/components/Pages/Home/utils'

const PAGE_SIZES = [10, 20, 50]
const DEFAULT_SORT = { field: 'project.tokenomic.totalHolders', order: 'desc' }
const IGO_STATUS = [{ text: 'Launched', value: 'launched' }, { text: 'Upcoming', value: 'upcoming' }]
const VERSION_RELEASED = [{ text: 'Official', value: 'official' }, { text: 'Testnet', value: 'testnet' }, { text: 'Upcoming', value: 'upcoming' }]
const VERIFY_STATUS = [{ text: 'Launched on GameFi.org', value: 'true' }]
const SORT_VALUES = [
  { text: 'Recently Added', field: 'createdAt', order: 'desc' },
  { text: 'Most Popular', field: 'project.tokenomic.totalHolders', order: 'desc' },
  { text: 'New Releases', field: 'topReleased', order: 'desc' },
  { text: 'Most Viewed', field: 'totalViews', order: 'desc' },
  { text: 'Top Trending', field: 'totalFavorites', order: 'desc' },
  { text: 'Top Rating', field: 'rate', order: 'desc' },
  { text: 'Token ROI', field: 'roi', order: 'desc' }
]

export const SORT_ALIAS = {
  'project.tokenomic.totalHolders': 'totalHolders',
  'project.tokenomic.volume24h': 'volume24h',
  'project.tokenomic.currentPrice': 'currentPrice'
}

const DEBOUNCE_TIME_SEARCH = 1000

const createHandleChangeArray = (arr, setArr) => elm => {
  if (arr.includes(elm)) {
    setArr(arr.filter(e => e !== elm))
  } else {
    setArr([...arr, elm])
  }
}

const joinArrayWithSuffix = (arr, suffix) => {
  return arr.reduce((acc, e) => {
    if (acc) {
      acc += ','
    }
    acc += ` ${e} ${suffix}`
    return acc
  }, '')
}

function SideBarFilter (props) {
  const { title, items = [], resetFilter, countLaunched, countUpcoming, igoStatuses, setIgoStatuses, versionReleases, setVersionReleases, countOfficial, countTestnet, countVersionUpcoming, verifyStatuses, setVerifyStatuses, countLaunchedStatus, countVerifiedStatus } = props
  const handleChangeIgoStatus = createHandleChangeArray(igoStatuses, setIgoStatuses)
  const handleChangeVersionRelease = createHandleChangeArray(versionReleases, setVersionReleases)
  const handleChangeVerifyStatus = createHandleChangeArray(verifyStatuses, setVerifyStatuses)

  return (
    <div className={props.className}>
      <div className='flex w-full items-end'>
        <label className='font-mechanic font-bold text-2xl leading-[100%] uppercase text-white'>Filters</label>
        <button className='ml-auto font-casual font-normal text-sm leading-[150%] text-[#6CDB00] capitalize' onClick={resetFilter}>Clear All</button>
      </div>

      <div className='flex items-center mt-8'>
        <label className='font-mechanic font-bold text-lg leading-[100%] uppercase text-white'>{title}</label>
        <button className='ml-auto font-casual font-normal text-sm leading-[150%] text-[#6CDB00]' onClick={() => props.setCategory('')}>Clear</button>
      </div>

      <div className='flex flex-col mt-6 max-h-[462px] overflow-y-scroll'>
        {
          items.map(e => {
            const checked = props.category === e.slug

            return (
              <button key={`option_${e.slug}`} className={clsx('flex items-center justify-between px-2 py-[14px]', checked ? 'bg-[#2B2D35] rounded-[3px]' : '')} onClick={() => props.setCategory(e.slug)}>
                <input type="radio" name="radio" className="hidden" checked={checked} onChange={() => props.setCategory(e.slug)} />
                <label htmlFor="category" className="flex items-center cursor-pointer">
                  <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink border-[#545763]"></span>
                  <div className='text-white flex font-casual font-normal text-sm leading-[100%]'>
                    {e.name}
                  </div>
                </label>
                <div className='font-casual text-sm leading-[100%] text-white opacity-[0.54]'>{get(e, 'totalGames')}</div>
              </button>
            )
          })
        }
      </div>

      <div className='mt-[46px]'>
        <div className='font-mechanic font-bold text-lg leading-[100%] uppercase text-white mb-4'>Igo Status</div>

        <div className='flex flex-col'>
          {
            IGO_STATUS.map(e => {
              const checked = igoStatuses?.includes(e.value)

              return (
                <div key={`igo_status_${e.value}`} className={clsx('flex items-center cursor-pointer px-2 py-[14px]', checked ? 'bg-[#2B2D35] rounded-[3px]' : '')} onClick={() => handleChangeIgoStatus(e.value)}>
                  <input
                    type="checkbox"
                    value={e.value}
                    checked={checked}
                    className="rounded-sm bg-transparent border-[#545763] checked:text-gamefiGreen-700 dark mr-2 cursor-pointer"
                    onChange={() => handleChangeIgoStatus(e.value)}
                  />
                  <div className='text-white flex font-casual font-normal text-sm leading-[100%]'>
                    {e.text}
                  </div>
                  <div className='ml-auto font-casual text-sm leading-[100%] text-white opacity-[0.54]'>{printNumber(e.value === 'launched' ? countLaunched : countUpcoming)}</div>
                </div>
              )
            })
          }
        </div>

        <div className='font-mechanic font-bold text-lg leading-[100%] uppercase text-white mb-4 mt-8'>Version Released</div>
        <div className='flex flex-col'>
          {
            VERSION_RELEASED.map(e => {
              const checked = versionReleases?.includes(e.value)

              let total = 0
              switch (e.value) {
              case 'official':
                total = countOfficial
                break
              case 'testnet':
                total = countTestnet
                break
              case 'upcoming':
                total = countVersionUpcoming
                break
              default:
                total = 0
                break
              }
              return (
                <div key={`igo_status_${e.value}`} className={clsx('flex items-center cursor-pointer px-2 py-[14px]', checked ? 'bg-[#2B2D35] rounded-[3px]' : '')} onClick={() => handleChangeVersionRelease(e.value)}>
                  <input
                    type="checkbox"
                    value={e.value}
                    checked={checked}
                    className="rounded-sm bg-transparent border-[#545763] checked:text-gamefiGreen-700 dark mr-2 cursor-pointer"
                    onChange={() => handleChangeVersionRelease(e.value)}
                  />
                  <div className='text-white flex font-casual font-normal text-sm leading-[100%]'>
                    {e.text}
                  </div>
                  <div className='ml-auto font-casual text-sm leading-[100%] text-white opacity-[0.54]'>{printNumber(total)}</div>
                </div>
              )
            })
          }
        </div>

        {/* <div className='font-mechanic font-bold text-lg leading-[100%] uppercase text-white mb-4 mt-8'>Verify status</div> */}
        <div className='flex flex-col mt-10'>
          {
            VERIFY_STATUS.map(e => {
              const checked = verifyStatuses.includes(e.value)

              return (
                <div key={`igo_status_${e.value}`} className={clsx('flex items-center cursor-pointer px-2 py-[14px]', checked ? 'bg-[#2B2D35] rounded-[3px]' : '')} onClick={() => handleChangeVerifyStatus(e.value)}>
                  <input
                    type="checkbox"
                    value={e.value}
                    checked={checked}
                    className="rounded-sm bg-transparent border-[#545763] checked:text-gamefiGreen-700 dark mr-2 cursor-pointer"
                    onChange={() => handleChangeVerifyStatus(e.value)}
                  />
                  <div className='text-white flex font-casual font-normal text-sm leading-[100%]'>
                    {e.text}
                  </div>
                  <div className='ml-auto font-casual text-sm leading-[100%] text-white opacity-[0.54]'>{printNumber(e.value === 'true' ? countLaunchedStatus : countVerifiedStatus)}</div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function PaginationOption ({ pageSize, setPageSize, sort, setSort, onSearch, isMobileAndTablet = false, searchValue, setSortedField }) {
  const defaultSortField = get(sort, '[1].field') || get(sort, '[0].field') || 'project.tokenomic.totalHolders'
  const defaultSortOrder = get(sort, '[1].order') || get(sort, '[0].order') || 'desc'

  const fieldAlias = Object.entries(SORT_ALIAS).find(alias => {
    const [, value] = alias
    return defaultSortField === value
  })

  const [_sort, _setSort] = useState<string>(`${fieldAlias ? fieldAlias[0] : defaultSortField}:${defaultSortOrder}`)
  const [showSelectSortMobile, setShowSelectSortMobile] = useState(false)
  const selectedSortMobile = SORT_VALUES.find(e => {
    const fieldAlias = Object.entries(SORT_ALIAS).find(alias => {
      const [, value] = alias
      return sort[0]?.field === value
    })

    if (fieldAlias) {
      const [key] = fieldAlias
      return e.field === key
    }

    return e.field === sort[0]?.field
  })

  const onChangePageSize = (e) => setPageSize(e.target.value)
  const onChangeSort = (e) => {
    const newSortValue = e.target.value
    _setSort(newSortValue)
    const [field, order] = newSortValue.split(':')
    const newSortValueField = SORT_ALIAS[field] || field
    setSort([{ field: newSortValueField, order }])
    setSortedField(null)
  }
  const onChangeSortMobile = (newSortValue) => {
    _setSort(newSortValue)
    const [field, order] = newSortValue.split(':')
    setSort([{ field, order }])
  }

  // Watch event reset filter
  useEffect(() => {
    if (sort?.length === 1 && sort[0].field === 'project.tokenomic.totalHolders' && sort[0].order === 'desc') {
      _setSort('project.tokenomic.totalHolders:desc')
    }
  }, [sort])

  return (
    <>
      {
        isMobileAndTablet
          ? <div
            className="flex justify-between px-[18px] py-[8px] w-full mt-4 bg-[#3B3E4A] items-center rounded-tl-sm rounded-tr-sm relative"
            onClick={() => setShowSelectSortMobile(!showSelectSortMobile)}
          >
            <div className="font-casual font-normal text-sm leading-[22px] text-white">
              Sort by: <strong>{selectedSortMobile?.text}</strong>
            </div>

            <svg
              width="13"
              height="8"
              viewBox="0 0 13 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.125 1.375L6.5 7L0.875 1.375"
                stroke="white"
                strokeWidth="1.4"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div
              className={clsx(
                'absolute z-10 top-10 w-full left-0 border border-gamefiDark-600 rounded shadow-lg bg-gamefiDark-800',
                showSelectSortMobile ? 'visible' : 'invisible'
              )}
            >
              {SORT_VALUES.map((e) => {
                const selected = sort.find(elm => {
                  const fieldAlias = Object.entries(SORT_ALIAS).find(alias => {
                    const [, value] = alias
                    return elm.field === value
                  })
                  if (fieldAlias) {
                    const [originField] = fieldAlias
                    return originField === elm.field && elm.order === e.order
                  }

                  return (elm.field === e.field) && elm.order === e.order
                })
                return (
                  <div key={e.field} className={clsx('p-4 text-center', selected ? 'bg-[#242732]' : '')} onClick={() => onChangeSortMobile(`${e.field}:${e.order}`)}>
                    {e.text}
                  </div>
                )
              })}
            </div>
          </div>
          : <div className="flex mb-[38px]">
            <div className="w-full sm:w-auto sm:mr-auto relative font-casual text-sm">
              <input
                id="hubListSearchInput"
                defaultValue={searchValue}
                onChange={onSearch}
                type="text"
                className="w-full md:w-80 border-none bg-[#242732] border-gamefiDark-600 rounded py-1.5 leading-6 shadow-lg pl-8"
                placeholder="Search"
              />
              <svg
                viewBox="0 0 13 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 absolute inset-y-0 left-2 top-2 mt-[3px]"
              >
                <path
                  d="M12.6092 12.1123L9.64744 9.03184C10.409 8.12657 10.8262 6.98755 10.8262 5.80178C10.8262 3.03135 8.57221 0.777344 5.80178 0.777344C3.03135 0.777344 0.777344 3.03135 0.777344 5.80178C0.777344 8.57222 3.03135 10.8262 5.80178 10.8262C6.84184 10.8262 7.83297 10.5125 8.68035 9.91702L11.6646 13.0208C11.7894 13.1504 11.9572 13.2218 12.1369 13.2218C12.3071 13.2218 12.4686 13.1569 12.5911 13.0389C12.8515 12.7884 12.8598 12.3729 12.6092 12.1123ZM5.80178 2.08807C7.84957 2.08807 9.5155 3.754 9.5155 5.80178C9.5155 7.84957 7.84957 9.5155 5.80178 9.5155C3.754 9.5155 2.08807 7.84957 2.08807 5.80178C2.08807 3.754 3.754 2.08807 5.80178 2.08807Z"
                  fill="white"
                ></path>
              </svg>
            </div>

            <p className="flex-1 font-casual text-sm text-right">
              <span className="opacity-60 hidden md:inline  mr-2">Show</span>
              <select
                value={pageSize}
                onChange={onChangePageSize}
                className="mr-2 font-casual text-sm w-full md:w-auto bg-gamefiDark-800 border-gamefiDark-600 rounded py-1 leading-6 shadow-lg"
              >
                {PAGE_SIZES.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <span className="opacity-60 hidden md:inline mr-[15px]">
                items per page
              </span>
            </p>
            <select
              value={_sort}
              onChange={onChangeSort}
              className="font-casual text-sm flex-1 sm:flex-none bg-gamefiDark-800 border-gamefiDark-600 rounded py-1 leading-6 shadow-lg"
            >
              {SORT_VALUES.map((e) => {
                return <option key={e.field} value={`${e.field}:${e.order}`}>
                  {e.text}
                </option>
              })}
            </select>
          </div>
      }
    </>
  )
}

function SearchAndFilterMobile ({
  className = '',
  searchValue,
  onSearch,
  categories,
  resetFilter,
  category,
  setCategory,
  igoStatuses,
  setIgoStatuses,
  versionReleases,
  setVersionReleases,
  verifyStatuses,
  setVerifyStatuses
}) {
  const [filterShown, setFilterShown] = useState(false)

  const handleChangeIgoStatus = createHandleChangeArray(igoStatuses, setIgoStatuses)
  const handleChangeVersionRelease = createHandleChangeArray(versionReleases, setVersionReleases)
  const handleChangeVerifyStatus = createHandleChangeArray(verifyStatuses, setVerifyStatuses)

  const handleSetFilterShown = (e) => {
    e.stopPropagation()
    setFilterShown(!filterShown)
  }

  const stopPropagation = (e: { stopPropagation: () => any }) =>
    e.stopPropagation()

  return (
    <div className={clsx(className, 'flex gap-2 h-10 w-full relative')}>
      <div className="flex flex-1 p-3 gap-3 bg-[#242732] rounded-sm items-center">
        <svg
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.6092 12.1123L9.64744 9.03184C10.409 8.12657 10.8262 6.98755 10.8262 5.80178C10.8262 3.03135 8.57221 0.777344 5.80178 0.777344C3.03135 0.777344 0.777344 3.03135 0.777344 5.80178C0.777344 8.57222 3.03135 10.8262 5.80178 10.8262C6.84184 10.8262 7.83297 10.5125 8.68035 9.91702L11.6646 13.0208C11.7894 13.1504 11.9572 13.2218 12.1369 13.2218C12.3071 13.2218 12.4686 13.1569 12.5911 13.0389C12.8515 12.7884 12.8598 12.3729 12.6092 12.1123ZM5.80178 2.08807C7.84957 2.08807 9.5155 3.754 9.5155 5.80178C9.5155 7.84957 7.84957 9.5155 5.80178 9.5155C3.754 9.5155 2.08807 7.84957 2.08807 5.80178C2.08807 3.754 3.754 2.08807 5.80178 2.08807Z"
            fill="white"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          defaultValue={searchValue}
          className="w-full px-0 bg-[transparent] border-none placeholder:font-casual placeholder:font-normal placeholder:text-sm placeholder:leading-[22px] placeholder:text-white placeholder:opacity-30 font-casual text-sm font-normal text-white h-[22px]"
          onChange={onSearch}
        />
      </div>
      <div className="bg-[#242732] rounded-sm w-[50px] h-10 flex justify-center items-center" onClick={handleSetFilterShown}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.9084 0.483875C13.7596 0.18725 13.4569 0 13.1252 0H0.874763C0.543125 0 0.240364 0.18725 0.0916078 0.483875C-0.0553978 0.7805 -0.0238966 1.13488 0.174736 1.4L5.24993 8.16638V13.125C5.24993 13.6089 5.64107 14 6.12497 14H7.87503C8.35893 14 8.75007 13.6089 8.75007 13.125V8.16638L13.8253 1.4C14.0239 1.13488 14.0554 0.7805 13.9084 0.483875Z"
            fill="white"
          />
        </svg>

        <div
          className={`z-50 origin-top-right top-[40px] absolute right-0 mt-2 min-w-max border border-gamefiDark-600 rounded shadow-lg bg-gamefiDark-800 ${filterShown ? 'visible' : 'invisible'}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
          onClick={stopPropagation}
        >
          <div
            className="p-4 text-base leading-6 h-[400px] sm:h-auto overflow-y-scroll"
            role="none"
          >
            <div className='flex justify-between'>
              <div className="uppercase font-bold text-2xl mb-6">Filters</div>
              <div className='font-casual font-normal text-[13px] leading-[2rem] text-[#6CDB00] capitalize' onClick={resetFilter}>Clear All</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-6">
              <div>
                <div className="uppercase font-bold text-lg">IGO Status</div>
                <div className="mb-6 font-casual text-sm">
                  {IGO_STATUS.map((e) => {
                    const checked = igoStatuses?.includes(e.value)
                    return (
                      <label
                        className="inline-flex items-center mr-4"
                        key={e.value}
                      >
                        <input
                          type="checkbox"
                          className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                          onChange={() => handleChangeIgoStatus(e.value)}
                          value={e.value}
                          checked={checked}
                        />
                        <span className="ml-1">{e.text}</span>
                      </label>
                    )
                  })}
                </div>

                <div className="uppercase font-bold text-lg">
                  Version released
                </div>
                <div className="mb-6 font-casual text-sm">
                  {VERSION_RELEASED.map((e) => {
                    const checked = versionReleases?.includes(e.value)
                    return (
                      <label
                        className="inline-flex items-center mr-4"
                        key={e.value}
                      >
                        <input
                          type="checkbox"
                          className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                          onChange={() => handleChangeVersionRelease(e.value)}
                          value={e.value}
                          checked={checked}
                        />
                        <span className="ml-1">{e.text}</span>
                      </label>
                    )
                  })}
                </div>

                <div className="uppercase font-bold text-lg">
                  Verify status
                </div>
                <div className="flex flex-col gap-2 mb-6 font-casual text-sm">
                  {VERIFY_STATUS.map((e) => {
                    const checked = verifyStatuses?.includes(e.value)
                    return (
                      <label
                        className="inline-flex items-center"
                        key={e.value}
                      >
                        <input
                          type="checkbox"
                          className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                          onChange={() => handleChangeVerifyStatus(e.value)}
                          value={e.value}
                          checked={checked}
                        />
                        <span className="ml-1">{e.text}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              <div>
                <div className="uppercase font-bold text-lg">
                  Categories ({categories?.length})
                </div>
                <div style={{ minWidth: '10rem' }}>
                  {categories?.map((e) => {
                    const checked = category === e.slug
                    return (
                      <label
                        className="flex items-center font-casual text-sm leading-6"
                        key={e.id}
                      >
                        <input
                          type="radio"
                          className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                          checked={checked}
                          onChange={() => setCategory(e.slug)}
                        />
                        <span className="ml-2">{e.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[10px] h-[10px] bg-[#6CDB00] rounded-full absolute -top-[5px] -right-[5px]"></div>
    </div>
  )
}

function Filter (props) {
  const router = useRouter()

  const getDefaultVerifyStatus = () => {
    const { verify_status: queryVerifyStatus = '' } = router.query
    return queryVerifyStatus ? (queryVerifyStatus as string).split(',') : []
  }

  const getDefaultIGOStatus = () => {
    const { igo_status: queryIGOStatus } = router.query
    return queryIGOStatus ? (queryIGOStatus as string).split(',') : []
  }

  const getDefaultVersionRelease = () => {
    const { version_released: queryVersionRelease } = router.query
    return queryVersionRelease ? (queryVersionRelease as string).split(',') : []
  }

  const getDefaultSort = () => {
    const { sort: querySort } = router.query
    if (!querySort) return [DEFAULT_SORT]
    const _sort = (querySort as string).split(',').map(e => {
      const [field, order] = e.split(':')
      return {
        field,
        order
      }
    })
    const isValid = _sort.every(v => (SORT_VALUES.some(item => item.field === v.field) || Object.values(SORT_ALIAS).some(item => item === v.field)) && ['desc', 'asc'].includes(v.order))
    return isValid ? _sort : [DEFAULT_SORT]
  }

  const [page, setPage] = useState<number>(Number(router.query.page || 1))
  const [pageSize, setPageSize] = useState<number>(Number((!router.query.page_size || !PAGE_SIZES.includes(Number(router.query.page_size))) ? PAGE_SIZES[0] : router.query.page_size))
  const [sort, setSort] = useState(getDefaultSort())
  const [category, setCategory] = useState<string>(router.query.category as string || '')
  const [igoStatuses, setIgoStatuses] = useState<Array<string>>(getDefaultIGOStatus())
  const [versionReleases, setVersionReleases] = useState<Array<string>>(getDefaultVersionRelease())
  const [verifyStatuses, setVerifyStatuses] = useState<Array<string>>(getDefaultVerifyStatus())
  const [isMobileAndTablet, setIsMobileAndTablet] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>(router.query.search as string || '')

  const screens = useScreens()
  useEffect(() => {
    setIsMobileAndTablet(screens.mobile || screens.tablet)
  }, [screens.mobile, screens.tablet])

  const resetFilter = () => {
    setPage(1)
    setPageSize(10)
    setSort([DEFAULT_SORT])
    setCategory('')
    setIgoStatuses([])
    setVersionReleases([])
    setVerifyStatuses([])
    setSearchValue('')
    props?.setSortedField && props.setSortedField(null)

    const elm = document.getElementById('hubListSearchInput') as HTMLInputElement
    if (elm) {
      elm.value = ''
    }
  }

  const onSearch = debounce((e: any) => {
    setSearchValue(e?.target?.value)
  }, DEBOUNCE_TIME_SEARCH)

  const generateFilterDesc = () => {
    const selectedCategory = (props?.categories || []).find(e => e.slug === category)
    let _filterDesc = `Showing ${(selectedCategory?.name || 'all').toLowerCase()} games`

    if (igoStatuses?.length < IGO_STATUS?.length) {
      const text = joinArrayWithSuffix(igoStatuses, 'IGO')
      text && (_filterDesc += `, ${text}`)
    }
    if (versionReleases?.length < VERSION_RELEASED?.length) {
      const text = joinArrayWithSuffix(versionReleases, 'version released')
      text && (_filterDesc += `, ${text}`)
    }
    if (sort?.length) {
      const text = `${sort.map(a => {
        const sortElement = SORT_VALUES.find(b => a.field === b.field)
        return sortElement?.text
      }).join(', ')}`
      text && (_filterDesc += ` and sorted by ${text.toLowerCase()}`)
    }

    if (verifyStatuses?.length === 1) {
      const verifyStatusValue = verifyStatuses[0]
      const verifyStatus = VERIFY_STATUS.find(e => e.value === verifyStatusValue)
      if (verifyStatus) {
        const text = ` ${verifyStatus.text[0].toLowerCase()}${verifyStatus.text.substring(1)}`
        _filterDesc += text
      }
    } else {
      _filterDesc += ' on GameFi.org'
    }

    return _filterDesc.replace('roi', 'ROI')
  }

  useEffect(() => {
    const _filterDesc = generateFilterDesc()
    props?.setFilterDescription(_filterDesc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [countLaunched, countUpcoming, countOfficial, countTestnet, countVersionUpcoming, countLaunchedStatus, countVerifiedStatus] = useMemo(() => {
    const _countLaunched = get(props, 'aggregatorLaunched.meta.pagination.total') || 0
    const _countUpcoming = get(props, 'aggregatorUpcoming.meta.pagination.total') || 0
    const _countOfficial = get(props, 'aggregatorOfficial.meta.pagination.total') || 0
    const _countTestnet = get(props, 'aggregatorTestnet.meta.pagination.total') || 0
    const _countVersionUpcoming = get(props, 'aggregatorVersionUpcoming.meta.pagination.total') || 0
    const _countLaunchedStatus = get(props, 'aggregatorStatusLaunched.meta.pagination.total') || 0
    const _countVerifiedStatus = get(props, 'aggregatorStatusVerified.meta.pagination.total') || 0

    return [_countLaunched, _countUpcoming, _countOfficial, _countTestnet, _countVersionUpcoming, _countLaunchedStatus, _countVerifiedStatus]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const [params, filterDesc] = useMemo(() => {
    const _filterDesc = generateFilterDesc()
    const _params = new URLSearchParams()

    if (page && page > 1) {
      _params.set('page', page.toString())
    }
    if (pageSize && pageSize > 10) {
      _params.set('page_size', pageSize.toString())
    }
    if ((sort?.length || props?.sortedField)) {
      const sortValue = props.sortedField || sort[0]
      const isDefault = ((DEFAULT_SORT.field === sortValue.field) || (SORT_ALIAS[DEFAULT_SORT.field] === sortValue.field)) && sortValue.order === 'desc'
      if (!isDefault) {
        const sortString = [props.sortedField, ...sort].filter(Boolean).reduce((acc, e) => {
          const fieldAlias = SORT_ALIAS[e.field] || e.field
          const nextSortValue = `${fieldAlias}:${e.order}`
          if (acc.includes(nextSortValue)) return acc
          if (acc) acc += ','
          acc += nextSortValue
          return acc
        }, '')
        _params.set('sort', sortString)
      }
    }
    if (category) {
      _params.set('category', category)
    }
    if (igoStatuses?.length) {
      _params.set('igo_status', igoStatuses.join(','))
    }
    if (versionReleases?.length) {
      _params.set('version_released', versionReleases.join(','))
    }
    if (verifyStatuses?.length) {
      _params.set('verify_status', verifyStatuses.join(','))
    }
    if (searchValue) {
      _params.set('search', searchValue)
    }

    return [_params.toString(), _filterDesc]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sort, category, igoStatuses, versionReleases, verifyStatuses, searchValue, props.sortedField])

  useEffect(() => {
    setPage(1)
  }, [pageSize, sort, category, igoStatuses, versionReleases, verifyStatuses, searchValue, props.sortedField])

  useEffect(() => {
    props?.setTitle(`${category || 'All'} games`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  useEffect(() => {
    props?.setFilterDescription(filterDesc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDesc])

  useEffect(() => {
    router.replace(`/hub/list${params ? `?${params}` : ''}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const curPage = get(props, 'paginationMeta.page') || 0
  const pageCount = get(props, 'paginationMeta.pageCount') || 0
  const validCategories = get(props, 'categories', []).filter(e => e.totalGames)

  return (
    isMobileAndTablet
      ? (
        <div className={clsx('px-6', props.className)}>
          <SearchAndFilterMobile {...{
            searchValue,
            onSearch,
            categories: validCategories,
            resetFilter,
            category,
            setCategory,
            igoStatuses,
            setIgoStatuses,
            countLaunched,
            countUpcoming,
            countOfficial,
            countTestnet,
            countVersionUpcoming,
            countLaunchedStatus,
            countVerifiedStatus,
            versionReleases,
            setVersionReleases,
            verifyStatuses,
            setVerifyStatuses
          }} />
          <PaginationOption {...{ pageSize, setPageSize, sort, setSort, searchValue, onSearch, isMobileAndTablet, setSortedField: props?.setSortedField }} />
          {props.children}
          {
            pageCount
              ? <Pagination
                className="w-full mt-4 justify-center"
                page={curPage}
                pageLast={pageCount}
                setPage={setPage}
              />
              : <div className="font-casual text-center py-4 text-sm">There are no results that match your search.</div>
          }
        </div>
      )
      : (
        <div className={clsx('flex', props.className)}>
          <SideBarFilter
            title="Categories"
            items={validCategories}
            className='w-[248px]'
            {...{
              resetFilter,
              category,
              setCategory,
              igoStatuses,
              setIgoStatuses,
              countLaunched,
              countUpcoming,
              countOfficial,
              countTestnet,
              countVersionUpcoming,
              countLaunchedStatus,
              countVerifiedStatus,
              versionReleases,
              setVersionReleases,
              verifyStatuses,
              setVerifyStatuses
            }}
          ></SideBarFilter>
          <div className='flex-1 pl-[30px]'>
            <PaginationOption {...{ pageSize, setPageSize, sort, setSort, searchValue, onSearch, isMobileAndTablet, setSortedField: props?.setSortedField }} />
            {props.children}
            {
              pageCount
                ? <Pagination
                  className="w-full justify-end mb-8 mt-10"
                  page={curPage}
                  pageLast={pageCount}
                  setPage={setPage}
                />
                : <div className="font-casual text-center py-4 text-sm">There are no results that match your search.</div>
            }
          </div>
        </div>
      )
  )
}

export default Filter
