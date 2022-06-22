import styles from '@/components/Pages/Account/Review/account_review.module.scss'
import clsx from 'clsx'
import Image from 'next/image'
import Star from '@/components/Pages/Hub/Reviews/Star'
import { format } from 'date-fns'
import { useMediaQuery } from 'react-responsive'
import { Like, DisLike, Comment } from '@/components/Pages/Hub/Reviews/GroupAction'
import { printNumber } from '@/utils'
import get from 'lodash.get'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { REVIEW_STATUS } from '@/components/Pages/Account/Review/TabReviews'

const STARS = [1, 2, 3, 4, 5]

const DEFAULT_HEIGHT_BEFORE_SHOW_MORE = 168

function isOverDefaultHeight (id) {
  const el = document.getElementById(id)
  const divHeight = el.offsetHeight

  return divHeight >= DEFAULT_HEIGHT_BEFORE_SHOW_MORE
}

function AccountReviewItem ({ data, visibleGroupAction, visibleStatistics, user }) {
  const [isOver, setIsOverDefaultHeight] = useState<boolean>(true)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const mediumScreen = useMediaQuery({ minWidth: '960px' })
  const aggregatorSlug = get(data, 'aggregator.slug')

  const router = useRouter()
  useEffect(() => {
    const _isOver = isOverDefaultHeight(`reviewContent_${data.id}`)
    setIsOverDefaultHeight(_isOver)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openReviewDetail = () => {
    if (!isPublished) return
    const reviewId = get(data, 'id')
    if (!aggregatorSlug || !reviewId) return
    router.push('/hub/[slug]/reviews/[id]', `/hub/${aggregatorSlug}/reviews/${reviewId}`)
  }

  // const openAggregatorDetail = () => {
  //   if (!aggregatorSlug) return
  //   router.push('/hub/[slug]', `/hub/${aggregatorSlug}`)
  // }

  const goWriteMyReview = () => {
    router.push(`/hub/${aggregatorSlug}/reviews/createOrUpdate`)
  }

  const isPublished = useMemo(() => {
    return get(data, 'status') === 'published'
  }, [data])

  const userRate = useMemo(() => {
    const rates = get(user, 'rates') || []
    const aggSlug = get(data, 'aggregator.slug') || '-'

    const rateOfAgg = rates.find(e => get(e, 'aggregator.slug') === aggSlug)
    return rateOfAgg?.rate || '-'
  }, [user, data])

  const getReviewTimeText = () => {
    const reviewStatus = get(data, 'status')
    switch (reviewStatus) {
    case 'published':
      return `Published ${format(new Date(data.publishedAt), 'd LLL, yyyy - hh:mm:ss OOO')}`
    case 'draft':
      return `Last Update ${format(new Date(data.updatedAt), 'd LLL, yyyy')}`
    case 'pending':
      return `Submit on ${format(new Date(data.updatedAt), 'd LLL, yyyy')}`
    default:
      return format(new Date(data.publishedAt), 'd LLL, yyyy')
    }
  }

  return (
    <div className={clsx(styles.account_review_item, 'flex flex-col md:flex-row w-full rounded-[4px] overflow-hidden mb-2')}>
      <a href={`/hub/${aggregatorSlug}`} target="_blank" rel="noreferrer">
        <div className={`${clsx(styles.game_info, 'flex md:flex-col items-center group')}`}>
          <div className={clsx(styles.image, 'w-14 h-14 md:w-[180px] md:h-[248px] mr-4 md:mr-0 md:mb-[22px] mb-0 overflow-hidden')}>
            <img src={get(data, 'aggregator.verticalThumbnail.url')} alt="thumb"></img>
          </div>
          <div
            className={clsx(
              styles.name,
              'group-hover:underline group-hover:cursor-pointer text-gamefiGreen-600 font-casual not-italic font-semibold text-sm leading-[21px] text-center mb-0 md:mb-[22px] cursor-pointer hover:underline'
            )}
            // onClick={openAggregatorDetail}
          >
            {get(data, 'aggregator.name')}
          </div>
        </div>
      </a>
      <div className={clsx(styles.game_review, 'w-full px-0 py-6 md:px-5 bg-[#21232A] overflow-hidden text-ellipsis')}>
        {
          mediumScreen && <div className='flex items-center justify-between mb-2'>
            {data.publishedAt && <div suppressHydrationWarning className={clsx(styles.published_date, 'font-casual font-[13px] opacity-60 font-medium leading-3 text-white')}>{getReviewTimeText()}</div>}
            { userRate
              ? <div className='flex gap-2'>
                {
                  STARS.map(level => {
                    return <Star key={`review_rate_${level}`} selected={userRate >= level} size={'16px'}></Star>
                  })
                }
              </div>
              : null
            }
          </div>
        }
        <div className='flex justify-between items-center w-full mb-[14px] md:mb-[20px]'>
          <div className={clsx(
            styles.title,
            'px-4 md:px-0 font-mechanic not-italic font-bold text-xl leading-[150%] flex items-center uppercase text-white',
            isPublished ? 'hover:cursor-pointer hover:underline' : ''
          )}
          onClick={openReviewDetail}>{data.title}</div>
        </div>

        {
          !mediumScreen && <div className={`${styles.rating_bar} h-[54px] w-full flex justify-between md:justify-start items-center md:items-center px-4 md:px-[18px] md:mb-[14px] mb-[24px]`}>
            {
              userRate
                ? <div className='flex gap-2'>
                  {
                    STARS.map(level => {
                      return <Star key={`review_rate_${level}`} selected={userRate >= level} size={'16px'}></Star>
                    })
                  }
                </div>
                : null
            }
            {data.publishedAt && <div suppressHydrationWarning className={clsx(styles.published_date, 'ml-0 md:ml-[22px] font-casual font-[13px] opacity-60 font-medium leading-3 text-white')}>{`${mediumScreen ? 'Published ' : ''} ${format(new Date(data.publishedAt), mediumScreen ? 'd LLL, yyyy - hh:mm:ss OOO' : 'd LLL,yyyy')}`}</div>}
          </div>
        }

        <div className='relative'>
          <div id={`reviewContent_${data.id}`} className={clsx(styles.content, 'px-4 md:px-0 font-casual text-sm font-normal leading-[150%] tracking-[0.03em] text-white overflow-hidden w-full text-ellipsis', isShowMore ? 'max-h-fit' : 'max-h-[168px]')}>{data.review}</div>
          {isOver && !isShowMore && <div className={`${styles.blur}`}></div>}
        </div>
        {!isShowMore && isOver && <div className='w-full flex justify-end pr-4 md:pr-0'>
          <div
            className='w-fit capitalize font-semibold text-gamefiGreen-500 text-sm leading-5 cursor-pointer hover:underline hover:opacity-95 mt-1 font-casual'
            onClick={() => setIsShowMore(true)}
          >Read More</div>
        </div>}

        {
          mediumScreen && data?.gamefi?.comment && <div className='px-4 md:px-5 md:mt-6 pt-6 pb-6 bg-[#323642] rounded-sm'>
            <div className='mb-4 font-mechanic not-italic font-bold font-[13px] leading-[150%] uppercase text-white'>Comment from GameFi reviewer</div>
            <div className={clsx(styles.content, 'font-casual text-sm font-normal leading-[150%] tracking-[0.03em] text-white opacity-60')}>{data.content}</div>
          </div>
        }

        <div className='flex items-center'>
          {
            visibleStatistics && <div className='flex flex-col mt-[16px] md:mt-[18px] float-left'>
              <div className={styles.divide}></div>
              <div className={clsx('flex md:gap-[40px] px-4 gap-8 mt-4 md:mt-6')}>
                <div className='flex gap-3 items-center'>
                  <Like selected={false} activeColor={'black'} inactiveColor={'white'} size={'16px'}></Like>
                  <p className='font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60'>{printNumber(data.likeCount || '-')}</p>
                </div>
                <div className='flex gap-3 items-center'>
                  <DisLike selected={false} activeColor={'black'} inactiveColor={'white'} size={'16px'}></DisLike>
                  <p className='font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60'>{printNumber(data.dislikeCount || '-')}</p>
                </div>
                <div className='flex gap-3 items-center'>
                  <Comment selected={false} activeColor={'black'} inactiveColor={'white'} size={'16px'}></Comment>
                  <p className='font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60'>{printNumber(data.commentCount || '-')}</p>
                </div>
              </div>
            </div>
          }

          { [REVIEW_STATUS.PUBLISHED, REVIEW_STATUS.DRAFT, REVIEW_STATUS.DECLINED].includes(get(data, 'status')) && visibleGroupAction && <div className={clsx(styles.group_action, 'flex flex-col mr-4 md:mr-0 mt-4 ml-auto')}>
            <div className={styles.divide}></div>
            <div className='flex justify-end mt-6 gap-8'>
              <button onClick={goWriteMyReview} className='flex items-center gap-2 cursor-pointer uppercase font-bold font-[13px] leading-[150%] tracking-[0.02em] text-gamefiGreen-700 hover:opacity-90'>
                <Image src={require('@/assets/images/hub/pencil.svg')} alt='button_edit'></Image>
                Edit
              </button>
              {/* <button className='flex items-center gap-2 cursor-pointer uppercase font-bold font-[13px] leading-[150%] tracking-[0.02em] text-gamefiGreen-700 hover:opacity-90'>
                <Image src={require('@/assets/images/hub/trash.svg')} alt='button_edit'></Image>
                Remove
              </button> */}
            </div>
          </div> }
        </div>
      </div>

      {
        !mediumScreen && data?.gamefi?.comment && <div className='px-4 md:px-5 md:mx-5 pt-6 pb-6 bg-[#323642]'>
          <div className='mb-4 font-mechanic not-italic font-bold font-[13px] leading-[150%] uppercase text-white'>Comment from GameFi reviewer</div>
          <div className={clsx(styles.content, 'font-casual text-sm font-normal leading-[150%] tracking-[0.03em] text-white opacity-60')}>{data.content}</div>
        </div>
      }
    </div>
  )
}

export default AccountReviewItem
