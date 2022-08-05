import { useRouter } from 'next/router'
import { useEffect } from 'react'
import get from 'lodash.get'
import { client } from '@/graphql/apolloClient'
import { GET_REVIEW_BY_ID_FOR_AGGREGATOR } from '@/graphql/reviews'
import Layout from '@/components/Layout'
import { BackIcon } from '@/components/Base/Icon'
import ReviewDetail from '@/components/Base/Review/Detail'

function ReviewDetailPage ({ data }) {
  const router = useRouter()

  useEffect(() => {
    if (!data.id) router.replace('/hub')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  return (
    <Layout title={'GameFi.org - Review'}>
      <div className="px-4 lg:px-24 md:container mx-auto lg:block">
        <a
          className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer"
          onClick={() => { router.back() }}
        >
          <BackIcon />
          Back
        </a>
        {data.id
          ? (
            <ReviewDetail data={data} currentResource="hub" />
          )
          : (
            <div className="uppercase font-bold text-3xl mb-6">
              Review Not Found
            </div>
          )
        }
      </div>
    </Layout>
  )
}

const DEFAULT_NUMBER_COMMENT = 4

export async function getServerSideProps ({ query }) {
  const { slug, id: reviewId, page } = query

  try {
    const result = await client.query({
      variables: {
        reviewId,
        pageSize: Number(page || 1) * DEFAULT_NUMBER_COMMENT,
        aggSlug: slug
      },
      query: GET_REVIEW_BY_ID_FOR_AGGREGATOR
    })

    const reviewDetail = get(result, 'data.reviews.data[0].attributes', {})
    const author = get(reviewDetail, 'author.data.attributes', {})
    const authorId = get(reviewDetail, 'author.data.id')
    const avatar = get(author, 'avatar.data.attributes', {})
    const gameName = get(reviewDetail, 'aggregator.data.attributes.name', '')
    const gameSlug = get(reviewDetail, 'aggregator.data.attributes.slug', '')

    const comments = get(result, 'data.comments.data', []).map((e) => ({
      ...e?.attributes,
      id: e?.id
    }))
    const totalComment = get(result, 'data.comments.meta.pagination.total', 0)

    if (slug !== gameSlug) {
      return {
        props: {
          data: {
            comments: [],
            totalComment: 0,
            rate: 0,
            id: '',
            gameName: '',
            review: '',
            pros: [],
            cons: [],
            likeCount: 0,
            publishedAt: null,
            user: {}
          }
        }
      }
    }

    return {
      props: {
        data: {
          comments,
          totalComment,
          rate: reviewDetail?.rate || 0,
          id: reviewId,
          gameName,
          review: reviewDetail?.review || '',
          pros: reviewDetail?.pros || [],
          cons: reviewDetail?.cons || [],
          likeCount: reviewDetail?.likeCount,
          publishedAt: reviewDetail?.publishedAt,
          user: {
            id: authorId,
            firstName: author?.firstName,
            lastName: author?.lastName,
            walletAddress: author?.walletAddress,
            avatar,
            reps: author?.repPoint,
            level: author?.level,
            rank: author?.rank,
            reviewCount: author?.reviewCount || 0,
            rates: author?.rates
          }
        }
      }
    }
  } catch {
    return {
      props: {
        data: {
          comments: [],
          totalComment: 0,
          rate: 0,
          id: '',
          gameName: '',
          review: '',
          pros: [],
          cons: [],
          likeCount: 0,
          publishedAt: null,
          user: {}
        }
      }
    }
  }
}

export default ReviewDetailPage
