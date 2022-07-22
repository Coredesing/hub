import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import isEmpty from 'lodash.isempty'
import { client } from '@/graphql/apolloClient'
import { normalize } from '@/graphql/utils'
import { GET_REVIEWS_AND_COMMENTS_BY_USER } from '@/graphql/reviews'
import useHubProfile from '@/hooks/useHubProfile'
import { printNumber } from '@/utils'
import AccountReviewItem from '@/components/Pages/Account/Review/AccountReviewItem'
import styles from '@/components/Pages/Account/Review/account_review.module.scss'

export const REVIEW_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  PENDING: 'pending',
  DECLINED: 'declined'
}

export const REVIEW_PAGE_SIZE = 6
export const COMMENT_PAGE_SIZE = 6

function Option ({ isActive, onSelectOption, text, value }) {
  return (
    <div
      className={clsx(styles.option, 'cursor-pointer rounded-[3px] capitalize text-center md:text-left px-2 md:px-[30px] py-[8px] font-casual font-semibold not-italic text-[13px] leading-[150%]', isActive ? 'bg-gamefiGreen-600 text-black' : 'bg-[#242732] text-white hover:opacity-90')}
      onClick={() => onSelectOption(value)}
    >
      {text}
    </div>
  )
}

const OPTIONS = {
  ALL: {
    value: 'all',
    text: 'All'
  },
  PUBLISHED: {
    value: 'published',
    text: 'Published'
  },
  DRAFT: {
    value: 'draft',
    text: 'Draft'
  },
  PENDING_APPROVAL: {
    value: 'pending',
    text: 'Pending Approval'
  },
  DECLINED: {
    value: 'declined',
    text: 'Declined'
  }
}

function ReviewFilter ({ data, status }) {
  const router = useRouter()
  const [curOption, setCurOption] = useState(status || OPTIONS.PUBLISHED.value)
  const { published, draft, pending, declined } = data

  const params = useMemo(() => {
    const _params = new URLSearchParams()

    if (curOption) {
      _params.set('status', curOption)
    }

    return _params.toString()
  }, [curOption])

  useEffect(() => {
    if (!router.query.status) {
      setCurOption(OPTIONS.PUBLISHED.value)
    }
  }, [router.query])

  useEffect(() => {
    router.replace(`${router.asPath.split('?')[0]}${params ? `?${params}` : ''}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <div className={clsx(styles.review_filter, 'flex gap-2 md:gap-[10px] mt-[24px] mb-[32px]')}>
      <Option
        isActive={curOption === OPTIONS.PUBLISHED.value}
        onSelectOption={setCurOption}
        value={OPTIONS.PUBLISHED.value}
        text={`${OPTIONS.PUBLISHED.text}` + (published ? ` (${printNumber(published)})` : '')}
      />
      <Option
        isActive={curOption === OPTIONS.DRAFT.value}
        onSelectOption={setCurOption}
        value={OPTIONS.DRAFT.value}
        text={`${OPTIONS.DRAFT.text}` + (draft ? ` (${printNumber(draft)})` : '')}
      />
      <Option
        isActive={curOption === OPTIONS.PENDING_APPROVAL.value}
        onSelectOption={setCurOption}
        value={OPTIONS.PENDING_APPROVAL.value}
        text={`${OPTIONS.PENDING_APPROVAL.text}` + (pending ? ` (${printNumber(pending)})` : '')}
      />
      <Option
        isActive={curOption === OPTIONS.DECLINED.value}
        onSelectOption={setCurOption}
        value={OPTIONS.DECLINED.value}
        text={`${OPTIONS.DECLINED.text}` + (declined ? ` (${printNumber(declined)})` : '')}
      />
    </div>
  )
}

function ListStarSVG () {
  return (
    <svg width="132" height="20" viewBox="0 0 132 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4713_4162)">
        <path d="M18.9307 6.79719L13.5357 6.01344L11.122 1.12469C10.6995 0.270937 9.30198 0.270937 8.87948 1.12469L6.46698 6.01344L1.07073 6.79719C0.0494809 6.94594 -0.364269 8.20594 0.378231 8.93094L4.28323 12.7359L3.36198 18.1097C3.18823 19.1272 4.25823 19.9084 5.17573 19.4272L10.0007 16.8909L14.827 19.4284C15.737 19.9047 16.8157 19.1359 16.6407 18.1109L15.7195 12.7372L19.6245 8.93219C20.3657 8.20594 19.952 6.94594 18.9307 6.79719Z" fill="#30343F" />
      </g>
      <g clipPath="url(#clip1_4713_4162)">
        <path d="M46.9307 6.79719L41.5357 6.01344L39.122 1.12469C38.6995 0.270937 37.302 0.270937 36.8795 1.12469L34.467 6.01344L29.0707 6.79719C28.0495 6.94594 27.6357 8.20594 28.3782 8.93094L32.2832 12.7359L31.362 18.1097C31.1882 19.1272 32.2582 19.9084 33.1757 19.4272L38.0007 16.8909L42.827 19.4284C43.737 19.9047 44.8157 19.1359 44.6407 18.1109L43.7195 12.7372L47.6245 8.93219C48.3657 8.20594 47.952 6.94594 46.9307 6.79719Z" fill="#30343F" />
      </g>
      <g clipPath="url(#clip2_4713_4162)">
        <path d="M74.9307 6.79719L69.5357 6.01344L67.122 1.12469C66.6995 0.270937 65.302 0.270937 64.8795 1.12469L62.467 6.01344L57.0707 6.79719C56.0495 6.94594 55.6357 8.20594 56.3782 8.93094L60.2832 12.7359L59.362 18.1097C59.1882 19.1272 60.2582 19.9084 61.1757 19.4272L66.0007 16.8909L70.827 19.4284C71.737 19.9047 72.8157 19.1359 72.6407 18.1109L71.7195 12.7372L75.6245 8.93219C76.3657 8.20594 75.952 6.94594 74.9307 6.79719Z" fill="#30343F" />
      </g>
      <g clipPath="url(#clip3_4713_4162)">
        <path d="M102.931 6.79719L97.5357 6.01344L95.122 1.12469C94.6995 0.270937 93.302 0.270937 92.8795 1.12469L90.467 6.01344L85.0707 6.79719C84.0495 6.94594 83.6357 8.20594 84.3782 8.93094L88.2832 12.7359L87.362 18.1097C87.1882 19.1272 88.2582 19.9084 89.1757 19.4272L94.0007 16.8909L98.827 19.4284C99.737 19.9047 100.816 19.1359 100.641 18.1109L99.7195 12.7372L103.624 8.93219C104.366 8.20594 103.952 6.94594 102.931 6.79719Z" fill="#30343F" />
      </g>
      <g clipPath="url(#clip4_4713_4162)">
        <path d="M130.931 6.79719L125.536 6.01344L123.122 1.12469C122.699 0.270937 121.302 0.270937 120.879 1.12469L118.467 6.01344L113.071 6.79719C112.049 6.94594 111.636 8.20594 112.378 8.93094L116.283 12.7359L115.362 18.1097C115.188 19.1272 116.258 19.9084 117.176 19.4272L122.001 16.8909L126.827 19.4284C127.737 19.9047 128.816 19.1359 128.641 18.1109L127.719 12.7372L131.624 8.93219C132.366 8.20594 131.952 6.94594 130.931 6.79719Z" fill="#30343F" />
      </g>
      <defs>
        <clipPath id="clip0_4713_4162">
          <rect width="20" height="20" fill="white" />
        </clipPath>
        <clipPath id="clip1_4713_4162">
          <rect width="20" height="20" fill="white" transform="translate(28)" />
        </clipPath>
        <clipPath id="clip2_4713_4162">
          <rect width="20" height="20" fill="white" transform="translate(56)" />
        </clipPath>
        <clipPath id="clip3_4713_4162">
          <rect width="20" height="20" fill="white" transform="translate(84)" />
        </clipPath>
        <clipPath id="clip4_4713_4162">
          <rect width="20" height="20" fill="white" transform="translate(112)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function ReviewSkeleton () {
  return (
    <div className={clsx(styles.review_skeleton, 'flex w-full bg-[#21232A] rounded-[4px] overflow-hidden animate-pulse')}>
      <div className='flex flex-col md:w-[180px]'>
        <div className='md:h-[248px] bg-[#30343F] mb-6'></div>
        <div className='h-3 mx-[15px] bg-[#30343F] rounded-sm mb-2'></div>
        <div className='h-3 mx-10 bg-[#30343F] rounded-sm mb-[45px]'></div>
      </div>
      <div className='flex flex-col flex-1 py-6 px-5'>
        <div className='h-4 rounded-sm bg-[#30343F] w-full mb-4'></div>
        <div className={clsx(styles.rating_bar, 'p-[18px] flex items-center mb-[22px]')}>
          <ListStarSVG/>
          <div className='h-3 rounded-sm bg-[#30343F] ml-[22px] w-1/2'></div>
        </div>

        <div className='h-4 rounded-sm bg-[#30343F] w-full mb-4'></div>
        <div className='h-4 rounded-sm bg-[#30343F] w-3/4 mb-4'></div>
        <div className='h-4 rounded-sm bg-[#30343F] w-full mb-4'></div>
        <div className='h-4 rounded-sm bg-[#30343F] w-3/4 mb-4'></div>
        <div className='h-4 rounded-sm bg-[#30343F] w-full mb-6'></div>

        <div className='h-[1px] w-full bg-[#323642]'></div>

        <div className='flex gap-10 mt-6'>
          <div className='flex items-center gap-3'>
            <div className='w-4 h-4 rounded-sm bg-[#30343F]'></div>
            <div className='w-[40px] h-[10px] rounded-sm bg-[#30343F]'></div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-4 h-4 rounded-sm bg-[#30343F]'></div>
            <div className='w-[40px] h-[10px] rounded-sm bg-[#30343F]'></div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-4 h-4 rounded-sm bg-[#30343F]'></div>
            <div className='w-[40px] h-[10px] rounded-sm bg-[#30343F]'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabReviews ({ reviews, showFilter, meta, status, totalReviews, user }) {
  const router = useRouter()
  const { query } = router
  const [isOwner] = useState(true)
  const [loadMore, setLoadMore] = useState(false)
  const [_reviews, setReviews] = useState(reviews)
  const [isLoading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const { accountHub } = useHubProfile()
  const [isNoMore, setIsNoMore] = useState(false)

  const handleLayoutScroll = useCallback(() => {
    const detectBottomElement = document.getElementById('detectBottomReview')

    const bounding = detectBottomElement?.getBoundingClientRect()
    if (!bounding) return
    if (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
      !isLoading && !loadMore && setLoadMore(true)
    }
  }, [isLoading, loadMore])

  useEffect(() => {
    const layoutElement = document.getElementById('layoutBody')
    layoutElement.addEventListener('scroll', handleLayoutScroll)

    return () => layoutElement.removeEventListener('scroll', handleLayoutScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPage(1)
    setReviews(reviews)
    setLoadMore(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.status, router.query.id, reviews])

  useEffect(() => {
    if (_reviews.length >= totalReviews) return
    if (loadMore && !isLoading && !isNoMore) {
      const _queryStatus = Array.isArray(query.status) ? query.status[0] : query.status
      const isValidStatus = _queryStatus in REVIEW_STATUS
      const _status = isValidStatus ? status : REVIEW_STATUS.PUBLISHED

      if (_reviews.length >= meta[_status]) return
      const id = accountHub?.id

      setLoading(true)
      const nextPage = page + 1
      client.query({
        query: GET_REVIEWS_AND_COMMENTS_BY_USER,
        variables: {
          reviewFilterValue: {
            author: { id: { eq: id } },
            status: { eq: _status }
          },
          reviewPagination: {
            page: nextPage,
            pageSize: REVIEW_PAGE_SIZE
          },
          commentFilterValue: {
            user: { id: { eq: id } }
          },
          commentPagination: {
            page: nextPage,
            pageSize: COMMENT_PAGE_SIZE
          },
          userId: id
        }
      }).then(res => {
        const result = normalize(res.data)
        if (!result.reviews.length) {
          setIsNoMore(true)
        }
        setReviews([..._reviews, ...result.reviews])
      }).finally(() => {
        setLoading(false)
        setLoadMore(false)
        setPage(nextPage)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMore, accountHub])

  const visibleGroupAction = useMemo(() => {
    return [REVIEW_STATUS.DRAFT, REVIEW_STATUS.PUBLISHED, REVIEW_STATUS.DECLINED].includes(router.query.status as string)
  }, [router.query.status])

  const visibleStatistics = useMemo(() => {
    return router.query.status === REVIEW_STATUS.PUBLISHED
  }, [router.query.status])

  return (
    <div className={clsx(styles.tab_review, showFilter ? '' : 'mt-[32px]')}>
      {isOwner && showFilter && <ReviewFilter data={meta} status={status} />}
      {_reviews.map(e => (
        <AccountReviewItem
          key={`acc_review_${e.id}`}
          data={e}
          visibleGroupAction={visibleGroupAction}
          visibleStatistics={visibleStatistics}
          user={user}
        />)
      )}
      {isEmpty(_reviews) && <div>No review found</div>}
      <div id="detectBottomReview" className="w-full h-[1px]"></div>
      {isLoading && <ReviewSkeleton />}
    </div>
  )
}

export default TabReviews
