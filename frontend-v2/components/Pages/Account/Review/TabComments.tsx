import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { normalize } from '@/graphql/utils'
import useHubProfile from '@/hooks/useHubProfile'
import { COMMENT_PAGE_SIZE, REVIEW_PAGE_SIZE, REVIEW_STATUS } from '@/components/Pages/Account/Review/TabReviews'
import AccountCommentItem from '@/components/Pages/Account/Review/AccountCommentItem'
import styles from '@/components/Pages/Account/Review/account_review.module.scss'

function CommentSkeleton () {
  return (
    <div className={clsx(styles.comment_skeleton, 'flex flex-col w-full bg-[#21232A] rounded-[4px] overflow-hidden animate-pulse p-6')}>
      <div className='flex w-full gap-7 mb-[22px]'>
        <div className='w-[60px] h-[60px] rounded-sm bg-[#30343F]'></div>
        <div className='flex flex-col flex-1 justify-center'>
          <div className='w-1/2 bg-[#30343F] rounded-sm h-5 mb-2'></div>
          <div className='w-1/4 bg-[#30343F] rounded-sm h-3'></div>
        </div>
      </div>
      <div className='flex w-full h-fit'>
        <div className='flex flex-col gap-3 w-full border-l-[3px] border-[#30343F] pl-4 py-1'>
          <div className='w-full bg-[#30343F] rounded-sm h-4'></div>
          <div className='w-10/12 bg-[#30343F] rounded-sm h-4'></div>
          <div className='w-full bg-[#30343F] rounded-sm h-4'></div>
          <div className='w-10/12 bg-[#30343F] rounded-sm h-4'></div>
          <div className='w-full bg-[#30343F] rounded-sm h-4'></div>
        </div>
      </div>
      <div className='flex w-full mt-[45px] justify-between items-center'>
        <div className='flex'>
          <div className='flex gap-3 items-center'>
            <div className="w-4 h-4 rounded bg-[#30343F]"></div>
            <div className="w-[40px] h-[10px] rounded bg-[#30343F]"></div>
          </div>
          <div className='flex gap-3 items-center ml-10'>
            <div className="w-4 h-4 rounded bg-[#30343F]"></div>
            <div className="w-[40px] h-[10px] rounded bg-[#30343F]"></div>
          </div>
        </div>
        <div className="w-[170px] h-[10px] rounded bg-[#30343F]"></div>
      </div>
    </div>
  )
}

const TabComments = ({ comments, totalComment }) => {
  const router = useRouter()
  const { query } = router
  const [isLoading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [loadMore, setLoadMore] = useState(false)
  const [_comments, setComments] = useState(comments)
  const { accountHub } = useHubProfile()
  // const [isNoMore, setIsNoMore] = useState(false)
  let delayTimer: string | number | NodeJS.Timeout

  const handleLayoutScroll = () => {
    clearTimeout(delayTimer)
    delayTimer = setTimeout(function () {
      const detectBottomElement = document.getElementById('detectBottomComment')
      const bounding = detectBottomElement?.getBoundingClientRect()
      if (!bounding) return
      if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      ) {
        !isLoading && setLoadMore(true)
      }
    }, 300)
  }

  useEffect(() => {
    setPage(1)
    setComments(comments)
    setLoadMore(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id])

  useEffect(() => {
    const layoutElement = document.getElementById('layoutBody')
    layoutElement.addEventListener('scroll', handleLayoutScroll)

    return () => layoutElement.removeEventListener('scroll', handleLayoutScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (_comments.length >= totalComment || page + 1 > Math.ceil(totalComment / COMMENT_PAGE_SIZE)) return
    if (loadMore && !isLoading) {
      const { status } = query
      const _queryStatus = Array.isArray(status) ? status[0] : status
      const id = router.query.id || accountHub?.id
      const isValidStatus = _queryStatus in REVIEW_STATUS
      const _status = isValidStatus ? status : REVIEW_STATUS.PUBLISHED
      setLoading(true)
      const nextPage = page + 1
      fetcher('/api/hub/reviews', {
        method: 'POST',
        body: JSON.stringify({
          query: 'GET_REVIEWS_AND_COMMENTS_BY_USER',
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
              user: { id: { eq: id } },
              review: {
                id: {
                  ne: null
                }
              }
            },
            commentPagination: {
              page: nextPage,
              pageSize: COMMENT_PAGE_SIZE
            },
            userId: id
          }
        })
      }).then(res => {
        const result = normalize(res.data)
        if (!result.comments.length) {
          // setIsNoMore(true)
        }
        const newData = [..._comments, ...result.comments]
        setComments(newData)
      }).finally(() => {
        setLoading(false)
        setLoadMore(false)
        setPage(nextPage)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMore, accountHub])

  return (
    <div className={clsx(styles.tab_comment, 'mt-6')}>
      {_comments.map((e, i) => <AccountCommentItem key={`acc_review_${i}`} data={e} />)}
      {isEmpty(_comments) && <div>No comment found</div>}
      <div id="detectBottomComment" className="w-full h-[1px]"></div>
      {isLoading && <CommentSkeleton />}
    </div>
  )
}

export default TabComments
