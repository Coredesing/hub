import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { normalize } from '@/graphql/utils'
import useHubProfile from '@/hooks/useHubProfile'
import { COMMENT_PAGE_SIZE, REVIEW_PAGE_SIZE, REVIEW_STATUS } from '@/components/Pages/Account/Review/TabReviews'
import Layout from '@/components/Layout'
import ReviewAndComment from '@/components/Pages/Account/ReviewAndComment'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
import UserProfile from '@/components/Pages/Account/Review/UserProfile'
import LoadingOverlay from '@/components/Base/LoadingOverlay'

const ReviewPage = () => {
  const [data, setData] = useState({})
  const { accountHub } = useHubProfile()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const _status = useMemo(() => {
    const { status = REVIEW_STATUS.PUBLISHED } = router.query
    const _queryStatus = Array.isArray(status) ? status[0] : status
    const isValidStatus = Object.values(REVIEW_STATUS).includes(_queryStatus)
    return isValidStatus ? status : REVIEW_STATUS.PUBLISHED
  }, [router.query])

  const { id } = accountHub || {}
  useEffect(() => {
    setLoading(true)
    if (!id) {
      setLoading(false)
      setData({})
      return
    }

    fetcher('/api/hub/reviews', {
      method: 'POST',
      body: JSON.stringify({
        variables: {
          reviewFilterValue: {
            author: { id: { eq: id } },
            status: { eq: _status }
          },
          reviewPagination: {
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
            pageSize: COMMENT_PAGE_SIZE
          },
          userId: id
        },
        query: 'GET_REVIEWS_AND_COMMENTS_BY_USER'
      })
    }).then((res) => {
      setData(normalize(res.data))
    }).catch(() => { })
      .finally(() => setLoading(false))
  }, [id, _status])

  const published = get(data, 'publishedReview.meta.pagination.total', 0)
  const draft = get(data, 'draftReview.meta.pagination.total', 0)
  const pending = get(data, 'pendingReview.meta.pagination.total', 0)
  const declined = get(data, 'declinedReview.meta.pagination.total', 0)
  const totalReviewOfAllStatus = Number(published) + Number(draft) + Number(pending) + Number(declined)
  const userData = get(data, 'user') || {}

  return (
    <Layout title="GameFi.org - My Review">
      {loading && (<LoadingOverlay loading />)}
      <AccountLayout className="flex-1">
        {!isEmpty(data)
          ? (
            <div className="p-4 md:p-10">
              <UserProfile editable data={userData} totalReviewOfAllStatus={totalReviewOfAllStatus} />
              <ReviewAndComment
                data={data}
                status={_status}
                showReviewFilter={true}
                user={userData}
                meta={{ published, draft, pending, declined }}
              />
            </div>
          )
          : (
            <div className="uppercase text-4xl text-center font-bold bg-[#000] py-14">No Reviews Found</div>
          )}
      </AccountLayout>
    </Layout>
  )
}

export default ReviewPage
