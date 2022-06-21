import React, { useEffect, useMemo, useState } from 'react'
import { debounce } from '@/utils'
import Image from 'next/image'

const CATEGORY_LIST = [
  'Action',
  'Adventure',
  'Card',
  'Metaverse',
  'MMORPG',
  'Puzzle',
  'Racing',
  'Simulation',
  'Sports',
  'Strategy',
  'Real-time Strategy',
  'Turn-based Strategy',
  'Others'
]

const IGO_STATUS = [
  '',
  'Launched',
  'Upcoming'
]

const RELEASE_GAME_VERSIONS = [
  '',
  'Official',
  'Testnet'
]

type Props = {
  categories: any;
  setCategory: (val: string) => any;
  filterShown: boolean;
  setFilterShown: (val: boolean) => any;
  igoStatus: string;
  setIgoStatus: (val: string) => any;
  launchStatus: string;
  setLaunchStatus: (val: string) => any;
  name: string;
  setIsLaunchedGameFi: (val: string) => any;
  isLaunchedGameFi: string;
  setName: (val: string) => any;
  pageSize: string;
  setPageSize: (val: string) => any;
  sortBy: string;
  setSortBy: (val: string) => any;
  sortOrder: string;
  setSortOrder: (val: string) => any;
}

function Filter ({
  categories,
  setCategory,
  filterShown,
  setFilterShown,
  igoStatus,
  setIgoStatus,
  launchStatus,
  setLaunchStatus,
  name,
  setName,
  pageSize,
  setPageSize,
  sortBy,
  setSortBy,
  isLaunchedGameFi,
  setIsLaunchedGameFi,
  sortOrder,
  setSortOrder
}: Props) {
  const [draftFilters, setDraftFilters] = useState<any>({})

  useEffect(() => {
    setDraftFilters({ ...draftFilters, igoStatus, launchStatus, categories, isLaunchedGameFi: !!isLaunchedGameFi })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [igoStatus, launchStatus, categories, isLaunchedGameFi])

  const sort = useMemo(() => {
    return `${sortBy}${sortOrder ? `|${sortOrder}` : ''}`
  }, [sortBy, sortOrder])

  const stopPropagation = (e: { stopPropagation: () => any }) => e.stopPropagation()

  const handleSetDraftFilters = (type: string) => (e: any) => {
    const value = e.target.value
    let filterValue = value
    if (type === 'categories') {
      const draftCategories = draftFilters.categories
      const checked = draftCategories.includes(value)
      filterValue = checked
        ? draftCategories.filter(item => item !== value)
        : [...draftCategories, value]
    }
    if (type === 'isLaunchedGameFi') {
      filterValue = e.target.checked
    }
    setDraftFilters({ ...draftFilters, [type]: filterValue })
  }

  const handleSort = (e: { target: { value: string } }) => {
    const parts = e.target.value.split('|')
    if (parts[0]) {
      setSortBy(parts[0])
    }
    if (parts[1]) {
      setSortOrder(parts[1])
    }
  }

  const resetFilters = () => {
    setCategory(null)
    setIgoStatus(null)
    setLaunchStatus(null)
    setIsLaunchedGameFi(null)
    setFilterShown(false)
  }

  const applyFilters = () => {
    setCategory(draftFilters?.categories?.join(',') || '')
    setIgoStatus(draftFilters.igoStatus)
    setLaunchStatus(draftFilters.launchStatus)
    setIsLaunchedGameFi(draftFilters.isLaunchedGameFi)
    setFilterShown(false)
  }

  const onSearch = debounce((e: any) => {
    setName(e?.target?.value)
  }, 1000)

  const handleSetPageSize = (e: { target: { value: string } }) => {
    setPageSize(e.target.value)
  }

  const handleSetFilterShown = (e) => {
    e.stopPropagation()
    setFilterShown(!filterShown)
  }

  return (
    <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 mb-5 md:mb-12">
      <div className="w-full sm:w-auto sm:mr-auto relative font-casual text-sm">
        <input
          // value={search}
          defaultValue={name}
          onChange={onSearch}
          type="text"
          className="w-full md:w-80 border-none bg-[#242732] border-gamefiDark-600 rounded py-1.5 leading-6 shadow-lg pl-8"
          placeholder="Search"
        />
        <svg
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 absolute inset-y-0 left-2 top-2"
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
          onChange={handleSetPageSize}
          className="mr-2 font-casual text-sm w-full md:w-auto bg-gamefiDark-800 border-gamefiDark-600 rounded py-1 leading-6 shadow-lg"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span className="opacity-60 hidden md:inline">items per page</span>
      </p>
      <select
        value={sort}
        onChange={handleSort}
        className="font-casual text-sm flex-1 sm:flex-none bg-gamefiDark-800 border-gamefiDark-600 rounded py-1 leading-6 shadow-lg"
      >
        <option value="createdAt|desc">Newest</option>
        {/* <option value="roi|desc">High ROI</option> */}
        {/* <option value="cmc_rank|asc">Highest Rating</option> */}
        <option value="interactivePoint7d|desc">Trending</option>
        <option value="rate|desc">Top rating</option>
        <option value="roi|desc">Top ROI</option>
        <option value="ranking.cmcRank|desc">Top CMC rank</option>
      </select>

      <div className="flex-1 sm:flex-none relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full bg-gamefiDark-800 border border-gamefiDark-600 rounded py-2 leading-6 px-4 shadow-lg"
            id="menu-button"
            // aria-expanded="true"
            // aria-haspopup="true"
            onClick={handleSetFilterShown}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.9084 1.48387C14.7596 1.18725 14.4569 1 14.1252 1H1.87476C1.54313 1 1.24036 1.18725 1.09161 1.48387C0.944602 1.7805 0.976103 2.13488 1.17474 2.4L6.24993 9.16638V14.125C6.24993 14.6089 6.64107 15 7.12497 15H8.87503C9.35893 15 9.75007 14.6089 9.75007 14.125V9.16638L14.8253 2.4C15.0239 2.13488 15.0554 1.7805 14.9084 1.48387Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div
          className={`z-50 origin-top-right absolute right-0 mt-2 min-w-max border border-gamefiDark-600 rounded shadow-lg bg-gamefiDark-800 ${filterShown ? 'visible' : 'invisible'}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
          onClick={stopPropagation}
        >
          <div className="p-4 text-base leading-6 h-[400px] sm:h-auto overflow-y-scroll" role="none">
            <div className="uppercase font-bold text-2xl mb-6">Filters</div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-6">
              <div>
                <div className="uppercase font-bold text-lg">IGO Status</div>
                <div className="mb-6 font-casual text-sm">
                  {IGO_STATUS.map(v => (
                    <label className="inline-flex items-center mr-4" key={v}>
                      <input
                        type="radio"
                        className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                        onChange={handleSetDraftFilters('igoStatus')}
                        value={v}
                        checked={(draftFilters.igoStatus || '') === v}
                      />
                      <span className="ml-1">{v || 'All'}</span>
                    </label>
                  ))}
                </div>

                <div className="uppercase font-bold text-lg">Release Game Versions</div>
                <div className="font-casual text-sm mb-3">
                  {RELEASE_GAME_VERSIONS.map(v => (
                    <label className="block sm:inline-flex items-center mr-4" key={v}>
                      <input
                        type="radio"
                        className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                        onChange={handleSetDraftFilters('launchStatus')}
                        value={v}
                        checked={(draftFilters.launchStatus || '') === v}
                      />
                      <span className="ml-1">{v || 'ALl'}</span>
                    </label>
                  ))}
                </div>

                <div className="font-casual text-sm">
                  <label
                    className="flex items-center font-casual text-sm leading-6"
                  >
                    <input
                      type="checkbox"
                      className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                      // value={c}
                      onChange={handleSetDraftFilters('isLaunchedGameFi')}
                      checked={!!draftFilters.isLaunchedGameFi}
                    />
                    <span className="ml-2">Launched On GameFi.Org</span>
                  </label>
                </div>

              </div>
              <div>
                <div className="uppercase font-bold text-lg">
                  Categories ({categories?.length})
                </div>
                <div style={{ minWidth: '10rem' }}>
                  {CATEGORY_LIST.map((c) => {
                    return (
                      <label
                        className="flex items-center font-casual text-sm leading-6"
                        key={c}
                      >
                        <input
                          type="checkbox"
                          className="checked:bg-gamefiGreen-500 hover:bg-gamefiGreen-500 text-gamefiGreen-500"
                          value={c}
                          onChange={handleSetDraftFilters('categories')}
                          checked={draftFilters?.categories?.indexOf(c) > -1}
                        />
                        <span className="ml-2">{c}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="text-right flex justify-end">
              <button
                className="hover:underline uppercase text-white/50 font-bold flex-1 md:flex-initial"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
              <button
                className="flex-1 md:flex-initial flex items-center uppercase overflow-hidden py-2 ml-6 px-8 bg-gamefiGreen-500 text-gamefiDark-900 font-bold text-[13px] rounded-xs hover:opacity-95 cursor-pointer w-full md:w-auto rounded-sm clipped-t-r"
                onClick={applyFilters}
              >
                Apply Filter&nbsp;&nbsp;
                <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" width={15} height={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filter
