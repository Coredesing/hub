import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import get from 'lodash.get'
import { fetcher } from '@/utils'
import { nFormatter } from '@/components/Pages/Hub/utils'
import { WrapperHorizontalItem } from './StyleElement'
import HubTitle from '../HubTitle'

export default function TopViewHub () {
  const [data, setData] = useState([])
  const [filterTime, setFilterTime] = useState('')

  const getData = (time: string) => {
    fetcher('/api/hub/home', { method: 'POST', body: JSON.stringify({ query: 'GET_VIEW_AGGREGATORS', variables: { filtersValue: `totalViews${time}:desc` } }) }).then(({ data }) => {
      setData(data?.aggregators?.data?.map((v: { attributes: any }) => {
        const d = v.attributes
        const value = { ...d, url: get(d, 'rectangleThumbnail.data.attributes.url') }
        return value
      }) || [])
      setFilterTime(time)
    }).catch((err) => {
      console.debug('err', err)
    })
  }

  return (
    <div className="mb-6">
      < HubTitle title="Most Viewed" source="view" showFilterTime getData={getData} />
      <div className="w-full flex flex-col gap-3">
        {
          data?.map((item, i) => (
            <WrapperHorizontalItem item={item} key={`topViewHub-${i}`} className="pl-2">
              <>
                <div className="flex-1 flex flex-col justify-around text-sm">
                  <Link href={`/hub/${item?.slug}`} passHref>
                    <a className="font-semibold">
                      {item?.name}
                    </a>
                  </Link>
                  <div className="text-sm flex text-gray-300">
                    <Image src={require('@/assets/images/icons/white-heart.svg')} alt="heart" />
                    <p className="ml-2 mr-4">
                      {nFormatter(item?.totalFavorites)}
                    </p>
                  </div>
                </div>
                <div className='flex ml-auto items-center min-w-[65px] justify-end'>
                  <Image src={require('@/assets/images/icons/eye.svg')} alt="eye" />
                  <p className="ml-2 text-gray-300 text-sm flex-1 text-right">
                    {nFormatter(item[`totalViews${filterTime}`] || 0)}
                  </p>
                </div>
              </>
            </WrapperHorizontalItem>
          ))
        }
      </div>
    </div>
  )
}
