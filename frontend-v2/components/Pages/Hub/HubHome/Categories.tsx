import React from 'react'
import isEmpty from 'lodash.isempty'
import { gtagEvent, printNumber } from '@/utils'
import Link from 'next/link'

export default function Categories ({ data }) {
  return (
    <div className="mb-6 py-4 xl:py-6 px-4 rounded" style={{ background: '#292C36' }}>
      <div className="flex justify-between mb-3 md:text-lg 2xl:text-2xl items-center">
        <div className="font-bold uppercase">Categories</div>
        <Link href="/hub/list" passHref>
          <a
            className="font-casual text-gamefiGreen-700 hover:text-gamefiGreen-200 py-2 pl-2 leading-5 font-semibold text-sm"
            onClick={() => {
              gtagEvent('hub_all_categories')
            }}
          >
            View All
          </a>
        </Link>
      </div>
      <div className="mb-5 color-[#D4D7E1] font-casual text-sm">Feel free to choose the games according to your favorite category</div>
      <div className="w-full flex flex-col gap-3">
        {
          !isEmpty(data)
            ? <div className="">
              {data.map((item, i) => (
                <div key={`launchedOnGamefi-${i}`} className="flex justify-between text-sm font-casual mb-7">
                  <Link href={`/hub/list?category=${item.slug}`} passHref><a className="flex-1 line-clamp-1 mr-3 cursor-pointer hover:underline" onClick={() => {
                    gtagEvent('hub_category', { category: item.slug })
                  }}>{item.name}</a></Link>
                  <div className="text-white/50">{printNumber(item.totalGames)}</div>
                </div>
              ))}

            </div>
            : <></>
        }
      </div>
    </div>
  )
}
