import styles from '@/components/Pages/Account/Review/account_review.module.scss'
import clsx from 'clsx'
import { useMediaQuery } from 'react-responsive'
import { Like, DisLike } from '@/components/Pages/Hub/Reviews/GroupAction'
import { printNumber } from '@/utils'
import get from 'lodash.get'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

const DEFAULT_HEIGHT_BEFORE_SHOW_MORE = 168

function isOverDefaultHeight (id) {
  const el = document.getElementById(id)
  const divHeight = el.offsetHeight

  return divHeight >= DEFAULT_HEIGHT_BEFORE_SHOW_MORE
}

function AccountCommentItem ({ data }) {
  const router = useRouter()

  const [isOver, setIsOverDefaultHeight] = useState<boolean>(true)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)

  const mediumScreen = useMediaQuery({ minWidth: '960px' })
  const createdAt = useMemo(() => get(data, 'createdAt', null), [data])

  useEffect(() => {
    const _isOver = isOverDefaultHeight(`commentContent_${data.id}`)
    setIsOverDefaultHeight(_isOver)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openReviewDetail = () => {
    const aggregatorSlug = get(data, 'review.aggregator.slug')
    const reviewId = get(data, 'review.id')
    if (!aggregatorSlug || !reviewId) return

    router.push('/hub/[slug]/reviews/[id]', `/hub/${aggregatorSlug}/reviews/${reviewId}`)
  }

  const openUserProfile = () => {
    const userId = get(data, 'review.author.id')
    if (!userId) return

    router.push('/user/[id]', `/user/${userId}`)
  }

  const openGameDetail = () => {
    const aggregatorSlug = get(data, 'review.aggregator.slug')
    if (!aggregatorSlug) return

    router.push('/hub/[slug]', `/hub/${aggregatorSlug}`)
  }

  return (
    <div className={clsx(styles.account_comment_item, 'p-0 md:p-6 bg-[#21232A] rounded-[4px] mb-2')}>
      <div className={`${clsx(styles.game_info, 'flex items-center')}`}>
        <div className={clsx(styles.image, 'w-[60px] h-[60px] overflow-hidden rounded-sm')}>
          <img src={get(data, 'review.aggregator.verticalThumbnail.url')} alt="aggregator_thumb"></img>
        </div>
        {
          mediumScreen
            ? <div className='ml-12 flex flex-col justify-center gap-2'>
              <div className='font-mechanic not-italic font-bold text-xl leading-[150%] uppercase text-white cursor-pointer hover:underline w-fit' onClick={openReviewDetail}>{get(data, 'review.title')}</div>
              <div className='font-casual text-[13px] leading-[12px] text-white'><strong className='cursor-pointer hover:underline' onClick={openUserProfile}>{`${get(data, 'review.author.firstName') || ''} ${get(data, 'review.author.lastName') || ''}`}</strong> reviewed <span className='text-gamefiGreen-600 hover:underline cursor-pointer' onClick={openGameDetail}>{get(data, 'review.aggregator.name', '')}</span></div>
            </div>
            : <div
              className={clsx(
                styles.name,
                'text-gamefiGreen-600 font-semibold font-casual not-italic text-sm leading-[21px] ml-4'
              )}
            >
              {get(data, 'review.aggregator.name', '')}
            </div>
        }
      </div>
      { !mediumScreen && <div className='px-4 md:px-0 font-mechanic not-italic font-bold text-base leading-[150%] flex items-center uppercase text-white mt-6 cursor-pointer hover:underline w-fit' onClick={openReviewDetail}>{get(data, 'review.title')}</div> }
      <div className={`${clsx(styles.comment, 'flex mt-[24px] md:mt-[20px] relative')}`}>
        <p
          id={`commentContent_${data.id}`}
          className={
            clsx(
              // styles.content,
              'mx-4 px-4 md:px-0 md:mx-0 border-l-[3px] border-[#2E313C] md:pl-4 font-casual not-italic font-normal text-base leading-[150%] tracking-[0.03em] text-white overflow-hidden break-words',
              isShowMore ? 'max-h-fit' : 'max-h-[168px]'
            )}>
          {data.comment}
        </p>
        {isOver && !isShowMore && <div className={`${styles.blur}`}></div>}
      </div>
      {!isShowMore && isOver && <div className='w-full flex justify-end pr-4 md:pr-0'>
        <div
          className='w-fit capitalize font-semibold text-gamefiGreen-500 text-sm leading-5 cursor-pointer hover:underline hover:opacity-95 mt-1 font-casual'
          onClick={() => setIsShowMore(true)}
        >Read More</div>
      </div>}
      <div className='flex justify-between px-4 md:px-0 md:pb-0 pb-4 items-center mt-[32px] md:mt-[45px]'>
        <div className={clsx('flex gap-4 md:gap-[40px]')}>
          <div className='flex gap-3 items-center'>
            <Like selected={false} activeColor={'black'} inactiveColor={'white'} size={'16px'}></Like>
            <p className='font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60'>{printNumber(data.likeCount || '-')}</p>
          </div>
          <div className='flex gap-3 items-center'>
            <DisLike selected={false} activeColor={'black'} inactiveColor={'white'} size={'16px'}></DisLike>
            <p className='font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60'>{printNumber(data.dislikeCount || '-')}</p>
          </div>
        </div>
        <div className='font-casual font-medium text-[13px] leading-[12px] opacity-60 text-white'>
          {createdAt && format(new Date(createdAt), mediumScreen ? 'd LLL, yyyy - hh:mm:ss OOO' : 'd LLL, yyyy')}
        </div>
      </div>
    </div>
  )
}

export default AccountCommentItem
