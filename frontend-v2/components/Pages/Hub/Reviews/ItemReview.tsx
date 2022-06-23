import React, { useEffect, useMemo, useState } from 'react'
import UserInfo from '@/components/Pages/Hub/Reviews/UserInfo'
import styles from './review.module.scss'
import { format } from 'date-fns'
import GroupAction from '@/components/Pages/Hub/Reviews/GroupAction'
import Star from '@/components/Pages/Hub/Reviews/Star'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import get from 'lodash.get'
import Statistics from '@/components/Pages/Hub/Reviews/Statistics'

const DEFAULT_HEIGHT_BEFORE_SHOW_MORE = 168
const STARS = [1, 2, 3, 4, 5]

function isOverDefaultHeight (id) {
  const el = document.getElementById(id)
  const divHeight = el.offsetHeight

  return divHeight >= DEFAULT_HEIGHT_BEFORE_SHOW_MORE
}

export default function ItemReview ({ data, index, defaultLikeStatus }) {
  const [isOver, setIsOverDefaultHeight] = useState(false)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    const _isOver = isOverDefaultHeight(`reviewContent_${index}`)
    setIsOverDefaultHeight(_isOver)
  }, [index])

  const userRate = useMemo(() => {
    return get(data, 'user.rates.data.[0].attributes.rate') || 0
  }, [data])

  return (
    <div className={`${styles.review_item} flex flex-col md:flex-row mb-2`}>
      <div className={`${styles.user_info} px-5 md:p-6`}>
        {/** mobile */}
        <div className={`${styles.rating_bar} md:p-[18px] h-[54px] md:h-6 w-full flex items-center justify-between md:mb-5 md:hidden`}>
          <div className={clsx('flex gap-2', userRate ? 'visible' : 'invisible')}>
            {
              STARS.map(level => {
                return <Star key={`item_review_rate_${level}`} selected={userRate >= level} size={'20px'}></Star>
              })
            }
          </div>
          {data.publishedAt && <div className={styles.published_date}>{`${format(new Date(data.publishedAt), 'd LLL, yyyy')}`}</div>}
        </div>
        {/** End of mobile */}
        <UserInfo user={data?.user || {}} className='md:w-[220px] hidden md:flex md:flex-col'/>
      </div>
      <div className={`${styles.content} p-4 md:px-6 md:pt-9 md:pb-8 flex-1 flex flex-col`}>
        <div className='hidden md:flex justify-between items-center mb-2'>
          {data.publishedAt && <div className={clsx(styles.published_date, 'font-casual font-medium text-[13px] leading-[12px] text-white opacity-60')}>{`Published ${format(new Date(data.publishedAt), 'd LLL, yyyy hh:mm:ss OOO')}`}</div>}
          <div className={clsx('flex gap-2', userRate ? 'visible' : 'invisible')}>
            {
              STARS.map(level => {
                return <Star key={`item_review_rate_${level}`} selected={userRate >= level} size={'20px'}></Star>
              })
            }
          </div>
        </div>
        <UserInfo user={data?.user || {}} className='md:w-full flex md:hidden flex-col md:flex-row'/>
        <a href={`/hub/${get(router.query, 'slug')}/reviews/${get(data, 'id')}`}>
          <div className='font-mechanic not-italic font-bold text-xl leading-[150%] text-white uppercase mb-4 cursor-pointer w-fit hover:underline' >{data?.title || ''}</div>
        </a>
        <div id={`reviewContent_${index}`} style={{ wordBreak: 'break-word' }} className={clsx(styles.review, 'whitespace-pre-wrap', isShowMore ? 'max-h-fit' : 'max-h-[168px]')}>
          {data.review}
          {isOver && !isShowMore && <div className={`${styles.blur}`}></div>}
        </div>
        {
          isOver && !isShowMore && <div
            className='w-fit self-end capitalize font-semibold text-gamefiGreen-500 text-md leading-5 cursor-pointer hover:underline hover:opacity-95 mt-1 font-casual'
            onClick={() => setIsShowMore(true)}>Read More</div>
        }

        <div className={`${styles.divide} mt-2 mb-4 md:mb-6`}></div>

        <div className='flex flex-col md:flex-row justify-between'>
          <Statistics like={get(data, 'likeCount')} dislike={get(data, 'dislikeCount')} comment={get(data, 'commentCount')} showComment />
          <GroupAction likeCount={get(data, 'likeCount')} dislikeCount={get(data, 'dislikeCount')} commentCount={get(data, 'commentCount')} defaultLikeStatus={defaultLikeStatus} id={data.id} pageSource="review" comment />
        </div>
      </div>
    </div>
  )
}
