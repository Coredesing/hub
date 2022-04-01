import { ObjectType } from '@/utils/types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CountDownTimeV1 from '@/components/Base/CountDownTime'
import Link from 'next/link'
import styles from './TopCollections.module.scss'
import { GamefiIcon, RelatingIcon, SoldOutIcon } from '@/components/Base/Icon'

type Props = {
  item: ObjectType;
  isDisplayJoin?: boolean;
  isShowSoldOut?: boolean;
}

export const InfoCollection = ({ item, isDisplayJoin, isShowSoldOut }: Props) => {
  const isSoldOut = useMemo(() => {
    return !!(+item.sold_out)
  }, [item.sold_out])
  const [countdown, setCountdown] = useState<{ date1: number; date2: number; title: string } & ObjectType>({ date1: 0, date2: 0, title: '' })
  const handleCountdown = useCallback(() => {
    const now = Date.now()
    const startIn = +item.sale_from && +item.sale_from * 1000
    const finishIn = +item.sale_to && +item.sale_to * 1000
    if (startIn > now) {
      setCountdown({ date1: startIn, date2: now, title: 'Sale Starts In' })
    } else if (finishIn > now) {
      setCountdown({ date1: finishIn, date2: now, title: 'Sale Ends In' })
    } else {
      setCountdown({ date1: 0, date2: 0, title: 'Finished', isFinished: true })
    }
  }, [item])
  useEffect(() => {
    handleCountdown()
  }, [handleCountdown])

  const saleDescription = useMemo(() => {
    if (!item?.sale_description) return
    const idxOfColon = item.sale_description.indexOf(':')
    const elements: any[] = []
    if (idxOfColon >= 0) {
      elements.push(<div key="title" className='text-base text-left mb-1 font-semibold'>{item.sale_description.slice(0, idxOfColon + 1)}</div>)
    }
    const childs: string[] = item.sale_description.slice(idxOfColon + 1)
      .split('-')
      .map((t: string) => t.replace('/\n', '').trim())
      .filter((t: string) => t)
    if (childs.length > 1) {
      childs.forEach((t: string, idx) => {
        elements.push(<p key={idx} className='text-sm text-left px-2 font-normal' style={{ lineHeight: '20px' }}>-{' '}{t}</p>)
      })
      return elements
    }
    return item.sale_description
  }, [item?.sale_description])

  return <div className={`${styles.info} absolute top-1/2 left-1/2 w-full z-10`}>
    <div className="flex  justify-center items-center gap-4 mb-2 relative">
      <GamefiIcon />
      <RelatingIcon />
      <div className='text-left z-10'>
        <img src={item.logo} width="60" height="53" className='object-contain' alt="" />
      </div>
    </div>
    <div className="text-2xl sm:text-4xl font-bold text-center mb-4">
      {item.title || item.name}
    </div>
    <div className="text-base font-bold text-center mb-4 sm:mb-7">
      {saleDescription || item.description}
    </div>
    {!countdown.isFinished && countdown.date1 > 0 && !isSoldOut && <CountDownTimeV1 className={styles.countdown} time={countdown} title={countdown.title} />}
    {
      isSoldOut && isShowSoldOut && <div className="flex justify-center">
        <SoldOutIcon />
      </div>
    }
    {
      isDisplayJoin && <div className='text-center mt-4'>
        <Link href={`/market/collection/${item.slug}`} passHref>
          <a className='w-fit clipped-b-l-t-r bg-gamefiGreen-700 text-lg uppercase text-black font-semibold py-2 px-6 rounded-sm'>Join Now</a>
        </Link>
      </div>
    }
  </div>
}

const Item = ({ item }: Props) => {
  return (
    <div>
      <img src={item.banner} className='absolute w-full h-full object-cover' alt="" />
      <InfoCollection item={item} isDisplayJoin isShowSoldOut />
    </div>
  )
}

export default Item
