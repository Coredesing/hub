import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetcher, gtagEvent } from '@/utils'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'
import { WrapperHorizontalItem } from './StyleElement'

export default function ListLaunchedOnGamefi () {
  const [data, setData] = useState([])

  useEffect(() => {
    fetcher('/api/hub/home', { method: 'POST', body: JSON.stringify({ query: 'GET_LAUNCHED_AGGREGATORS' }) }).then(({ data }) => {
      setData(data?.aggregators?.data?.map((v: { attributes: any }) => {
        const d = v.attributes
        const value = { ...d, url: get(d, 'rectangleThumbnail.data.attributes.url') }
        return value
      }) || [])
    }).catch((err) => console.debug('err', err))
  }, [])

  return (
    <div className="mb-6 px-2 py-4 xl:py-6 xl:px-4 rounded" style={{ background: '#292C36' }}>
      <div className="font-bold md:text-lg 2xl:text-2xl uppercase mb-3">LAUNCHED ON GameFi.ORG</div>
      <div className="w-full flex flex-col gap-3">
        {
          !isEmpty(data)
            ? <div className="">
              {data.map((item, i) => (
                <WrapperHorizontalItem className="bg-transparent" item={item} key={`launchedOnGamefi-${i}`}>
                  <div className="flex items-center ml-1">
                    <Link href={`/hub/${item?.slug}`} passHref>
                      <a className="font-semibold text-sm">
                        {item.name}
                      </a>
                    </Link>
                  </div>
                </WrapperHorizontalItem>
              ))}
              <Link href="/hub/list?verify_status=true" passHref>
                <a
                  className="font-casual mt-4 text-gamefiGreen-700 hover:text-gamefiGreen-200 py-2 leading-5 font-semibold text-sm"
                  onClick={() => {
                    gtagEvent('hub_all_launch')
                  }}
                >
                  View All
                </a>
              </Link>
            </div>
            : <></>
        }
      </div>
    </div>
  )
}
