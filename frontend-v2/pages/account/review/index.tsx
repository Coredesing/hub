import React, { useEffect, useState, useMemo } from 'react'
import Layout from 'components/Layout'
import ReviewAndComment from '@/components/Pages/Account/ReviewAndComment'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
import UserProfile from '@/components/Pages/Account/Review/UserProfile'
import { GET_REVIEWS_AND_COMMENTS_BY_USER } from '@/graphql/reviews'
import { client } from '@/graphql/apolloClient'
import { normalize } from '@/graphql/utils'
import { COMMENT_PAGE_SIZE, REVIEW_PAGE_SIZE, REVIEW_STATUS } from '@/components/Pages/Account/Review/TabReviews'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import useHubProfile from '@/hooks/useHubProfile'
import { useRouter } from 'next/router'

const ReviewPage = () => {
  const [data, setData] = useState({})
  const { accountHub } = useHubProfile()
  const router = useRouter()

  const _status = useMemo(() => {
    const { status = REVIEW_STATUS.PUBLISHED } = router.query
    const _queryStatus = Array.isArray(status) ? status[0] : status
    const isValidStatus = Object.values(REVIEW_STATUS).includes(_queryStatus)
    return isValidStatus ? status : REVIEW_STATUS.PUBLISHED
  }, [router.query])

  useEffect(() => {
    const { id } = accountHub || {}
    if (!id) return
    client.query({
      query: GET_REVIEWS_AND_COMMENTS_BY_USER,
      variables: {
        reviewFilterValue: {
          author: { id: { eq: id } },
          status: { eq: _status }
        },
        reviewPagination: {
          pageSize: REVIEW_PAGE_SIZE
        },
        commentFilterValue: {
          user: { id: { eq: id } }
        },
        commentPagination: {
          pageSize: COMMENT_PAGE_SIZE
        },
        userId: id
      }
    }).then(res => {
      setData(normalize(res.data))
    }).catch(() => { })
  }, [accountHub, _status])

  const published = get(data, 'publishedReview.meta.pagination.total', 0)
  const draft = get(data, 'draftReview.meta.pagination.total', 0)
  const pending = get(data, 'pendingReview.meta.pagination.total', 0)
  const declined = get(data, 'declinedReview.meta.pagination.total', 0)
  const totalReviewOfAllStatus = Number(published) + Number(draft) + Number(pending) + Number(declined)
  const userData = get(data, 'user') || {}

  return <Layout title="GameFi.org - My Review">
    <AccountLayout>
      {isEmpty(data) || <div className='p-4 md:p-10'>
        <UserProfile editable data={userData} totalReviewOfAllStatus={totalReviewOfAllStatus}></UserProfile>
        <ReviewAndComment data={data} status={_status} showReviewFilter={true} user={userData} meta={{ published, draft, pending, declined }} ></ReviewAndComment>
      </div>}
    </AccountLayout>
  </Layout>
}

export default ReviewPage
