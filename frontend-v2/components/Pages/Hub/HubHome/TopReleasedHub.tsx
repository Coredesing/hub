import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'
import { fetcher } from '@/utils'
import { WrapperHorizontalItem } from './StyleElement'
import HubTitle from '../HubTitle'
import { format } from 'date-fns'

export default function TopReleasedHub () {
  const [data, setData] = useState([])

  useEffect(() => {
    fetcher('/api/hub/home', { method: 'POST', body: JSON.stringify({ query: 'GET_RELEASED_AGGREGATORS' }) }).then(({ data }) => {
      setData(data?.aggregators?.data?.map(v => {
        const d = v.attributes
        const value = { ...d, url: get(d, 'rectangleThumbnail.data.attributes.url'), tokenomic: get(d, 'project.data.attributes.tokenomic', {}) }
        return value
      }) || [])
    }).catch((err) => console.debug('err', err))
  }, [])

  return (
    <div className="mb-6">
      < HubTitle title="New Releases" source="release" />
      <div className="w-full flex flex-col gap-3">
        {
          !isEmpty(data)
            ? data.map((item, i) => (
              <WrapperHorizontalItem item={item} key={`TopReleasedHub-${i}`} className="pl-2">
                <>
                  <div className="flex-1 flex flex-col justify-around text-sm">
                    <Link href={`/hub/${item?.slug}`} passHref>
                      <a className="font-semibold">
                        {item.name}
                      </a>
                    </Link>
                    <Link href={`/hub/${item?.slug}/reviews`} passHref>
                      <div className="text-sm flex text-gray-300 cursor-pointer">
                        <Image src={require('@/assets/images/icons/star.svg')} alt="star" />
                        <p className="ml-2 mr-4">
                          {item.rate?.toFixed(1)}
                        </p>
                      </div>
                    </Link>
                  </div>
                  {item?.releaseDate && (<div className="flex ml-auto items-center min-w-[107px] justify-end">
                    <Image src={require('@/assets/images/icons/date.svg')} alt="eye" />
                    <p className="ml-2 text-gray-300 text-sm flex-1 text-right">
                      {format(new Date(item.releaseDate), 'dd MMM yyyy')}
                    </p>
                  </div>)}
                </>
              </WrapperHorizontalItem>
            ))
            : <></>
        }
      </div>
    </div>
  )
}
