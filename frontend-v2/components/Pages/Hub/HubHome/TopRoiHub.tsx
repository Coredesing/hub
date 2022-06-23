import React, { useMemo } from 'react'
import Link from 'next/link'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import Tippy from '@tippyjs/react'
import { WrapperHorizontalItem } from './StyleElement'
import { gtagEvent } from '@/utils'

export default function TopRoiHub ({ data: propData }) {
  const data = useMemo(() => {
    return propData?.map(e => {
      return {
        ...e, url: get(e, 'rectangleThumbnail.url')
      }
    })
  }, [propData])

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-3 md:text-lg 2xl:text-2xl items-center">
        <Tippy content={<div><div>Token ROI is the approximate current return on investment (ROI) of a token.</div><div>Token ROI = Current Price/Public Sales Price</div></div>} className="font-casual text-sm leading-5 text-white bg-black opacity-100 p-3">
          <div className="flex">
            <div className="font-bold uppercase">Token ROI</div>
            <button className='ml-2'><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689" />
            </svg></button>
          </div>
        </Tippy>
        <Link href="/hub/list?sort=roi:desc" passHref>
          <a
            className="font-casual text-gamefiGreen-700 hover:text-gamefiGreen-200 py-2 pl-2 leading-5 font-semibold text-sm"
            onClick={() => {
              gtagEvent('hub_all_token_roi')
            }}
          >
            View All
          </a>
        </Link>
      </div>
      <div className="w-full flex flex-col gap-3">
        {
          !isEmpty(data)
            ? data.map((item, i) => (
              <WrapperHorizontalItem item={item} key={`topRoiHub-${i}`} className="pl-2">
                <>
                  <div className="flex-1 flex flex-col justify-around text-sm">
                    <Link href={`/hub/${item?.slug}`} passHref>
                      <a className="font-semibold">
                        {item.name}
                      </a>
                    </Link>
                    <div className="text-xs font-bold font-mechanic text-[13px]">
                      <span className="text-white/50">ROI: </span>
                      <span className="text-gamefiYellow">{!!item.roi && `${item.roi}X`}</span>
                    </div>
                  </div>
                </>
              </WrapperHorizontalItem>
            ))
            : <></>
        }
      </div>
    </div>
  )
}
