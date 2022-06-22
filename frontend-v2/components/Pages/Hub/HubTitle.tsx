import React, { useEffect, useState, useRef } from 'react'
import Tippy from '@tippyjs/react'
import { FILTER_TIMES } from './constants'
import { gtagEvent } from '@/utils'
import Link from 'next/link'

const TOOL_TIPS = {
  player: 'The Most Popular game is a game that has most unique wallets interacting with its smart contracts.',
  release: 'New Release game is a game that has recently released a new version, including Alpha, Open Beta, Closed Beta, and Official versions.',
  view: 'The Most Viewed game is a game that has the most visitors on GameFi.org.',
  rating: 'Games with the highest ratings',
  trending: 'Trending game is a game that has the most interactions within the last 7 days on GameFi.org. Interactions include views, likes, reviews, and comments.',
  review: 'Top Review is a game that has the most reviews and interactions in its reviews.'
}

const SORT_BY = {
  player: 'totalHolders',
  release: 'topReleased',
  view: 'totalViews',
  rating: 'rate',
  trending: 'totalFavorites'
}

type Props = {
  hideViewAll?: boolean;
  title: string;
  showFilterTime?: boolean;
  source?: string;
  getData?: (val: string) => any;
}

export default function HubTitle ({ hideViewAll, title, showFilterTime, getData, source }: Props) {
  const [filter, setFilter] = useState({ time: FILTER_TIMES[0] })
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (getData) {
      getData(filter.time.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  useEffect(() => {
    window && window.addEventListener('click', handleClickOutside)
    return () => {
      window && window.removeEventListener('click', handleClickOutside)
    }
  })

  const handleClickOutside = (e: any) => {
    if (show === true && wrapperRef.current && !wrapperRef.current.contains(e?.target)) {
      setShow(false)
    }
  }

  const availableOptions = () => {
    return FILTER_TIMES?.filter(item => item.value !== filter.time.value)
  }

  const handleChangeFilter = (v: { name: string; value: string }) => () => {
    setFilter({ time: v })
    setShow(false)
  }

  const handleSetShow = () => setShow(!show)

  return (
    <div className="flex flex-col mb-5 xl:mb-7 ">
      <div className="flex items-center justify-between pb-1">
        <Tippy disabled={!source} content={<span>{TOOL_TIPS[source]}</span>} className="font-casual text-sm leading-5 text-white bg-black opacity-100 p-3">
          <div className="flex">
            <div className="md:text-lg xl:text-2xl uppercase font-bold mr-2">{title}</div>
            {showFilterTime && (
              <div className="relative inline-block text-left">
                <button className="flex align-middle items-center text-gamefiGreen-700 md:text-lg xl:text-2xl uppercase font-bold" onClick={handleSetShow}>
                  {filter.time.name}&nbsp;
                  <svg width="15" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 0.5L8 8L0.5 0.5" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                </button>
                {show
                  ? <div ref={wrapperRef} className="origin-top-left absolute mt-2 z-20 left-0 w-52 rounded-sm py-1 shadow-lg focus:outline-none text-base bg-gamefiDark-500">
                    {
                      availableOptions().length
                        ? availableOptions().map(item =>
                          <button key={item.name} onClick={handleChangeFilter(item)} className="cursor-pointer hover:bg-gamefiDark-600 px-4 py-1 w-full text-left">{item.name}</button>
                        )
                        : <></>
                    }
                  </div>
                  : <></>}
              </div>
            )}
            {source &&
              <button className='ml-2'><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689" />
              </svg></button>
            }
          </div>
        </Tippy>
        {SORT_BY[source] && !hideViewAll && <Link href={`/hub/list?sort=${SORT_BY[source]}:desc`} passHref><a
          className="font-casual text-gamefiGreen-700 hover:text-gamefiGreen-200 py-2 pb-[7px] pl-2 leading-5 font-semibold text-sm"
          onClick={() => {
            gtagEvent(`hub_all_${source}`)
          }}
        >
          View All
        </a></Link>}
      </div>
      <div className="relative">
        <div
          className="bg-gamefiDark-600 absolute top-[-1px]"
          style={{ height: '1px', width: '100%' }}
        ></div>
        <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px' }}></div>
        <div className="absolute bottom-0 right-0 grid grid-flow-col gap-2">
          <div className={'h-full'}>
          </div>
        </div>
      </div>
    </div>
  )
}
