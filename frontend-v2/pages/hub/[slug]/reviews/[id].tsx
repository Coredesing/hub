import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import Detail from '@/components/Pages/Hub/Reviews/Detail'
import { client } from '@/graphql/apolloClient'
import get from 'lodash.get'
import { GET_REVIEW_BY_ID } from '@/graphql/reviews'

function ReviewDetail ({ data }) {
  const router = useRouter()

  return (
    <Layout title={'GameFi.org - Review'}>
      <div className="px-4 lg:px-24 md:container mx-auto lg:block">
        <a
          onClick={() => {
            router.back()
          }}
          className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer"
        >
          <svg
            className="w-6 h-6 mr-2"
            viewBox="0 0 22 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.5 8.5H1.5"
              stroke="currentColor"
              strokeMiterlimit="10"
            />
            <path
              d="M8.5 15.5L1.5 8.5L8.5 1.5"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeLinecap="square"
            />
          </svg>
          Back
        </a>
        {!data.id && (
          <div className="uppercase font-bold text-3xl mb-6">
            Review Not Found
          </div>
        )}
        {data.id && <Detail data={data} />}
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
      query: GET_REVIEW_BY_ID
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

export default ReviewDetail
