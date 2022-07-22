import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'
import get from 'lodash.get'
import { printNumber } from '@/utils'
import { client } from '@/graphql/apolloClient'
import {
  GET_REVIEWS_AND_COMMENTS_BY_USER,
  GET_USER_RATES_BY_GAME_AND_GUILD
} from '@/graphql/reviews'
import { normalize } from '@/graphql/utils'
import Layout from '@/components/Layout'
import { BackIcon } from '@/components/Base/Icon'
import UserProfile from '@/components/Pages/Account/Review/UserProfile'
import {
  COMMENT_PAGE_SIZE,
  REVIEW_PAGE_SIZE,
  REVIEW_STATUS
} from '@/components/Pages/Account/Review/TabReviews'
import ReviewAndComment from '@/components/Pages/Account/ReviewAndComment'

function OtherProfile ({ data }) {
  const router = useRouter()
  const mediumScreen = useMediaQuery({ minWidth: '960px' })
  const [statistics, setStatistics] = useState([])

  useEffect(() => {
    if (!data?.user) {
      setStatistics([])
      return
    }
    setStatistics([
      {
        text: 'Reviews',
        count: get(data, 'reviewMeta.meta.pagination.total') || 0
      },
      {
        text: 'Comments',
        count: get(data, 'commentMeta.meta.pagination.total') || 0
      },
      {
        text: 'Likes',
        count: data.user.likeCount || 0
      },
      {
        text: 'Dislikes',
        count: data.user.dislikeCount || 0
      }
    ])
  }, [data])
  const userData = get(data, 'user') || {}

  return (
    <Layout title="GameFi.org - Profile">
      {!data.user && (
        <div className="uppercase font-bold text-3xl md:px-32 md:pb-20 p-6">
          User Not Found
        </div>
      )}
      {data.user && (
        <div className="md:px-[156px] md:pb-20 px-4 pb-4">
          <a
            className="hidden md:inline-flex items-center text-sm font-casual mb-[55px] hover:text-gamefiGreen-500 cursor-pointer"
            onClick={() => { router.back() }}
          >
            <BackIcon />
            Back
          </a>
          <UserProfile editable={false} data={userData} />
          <div className="flex md:gap-5">
            <div className="flex-1">
              <ReviewAndComment data={data} status={null} user={userData} />
            </div>
            {mediumScreen && (
              <div className="w-[228px] md:mt-[60px]">
                {/* Statistics */}
                <div className="w-full rounded-[4px] bg-[#21232A] p-6">
                  <div className="font-mechanic font-bold not-italic text-2xl leading-[100%] uppercase text-white mb-6">
                    Statistics
                  </div>
                  <div className="flex flex-col gap-4">
                    {statistics?.map((e) => (
                      <div
                        key={`statistic_${e.text}`}
                        className="flex justify-between"
                      >
                        <div className="font-casual font-normal text-base leading-[21px] text-white">
                          {e.text}
                        </div>
                        <div className="font-casual font-bold text-base leading-[21px] text-white">
                          {printNumber(get(e, 'count', 0))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top categories */}
                {/* <div className="w-full rounded-[4px] bg-[#21232A] p-6 mt-[20px]">
                  <div className="font-mechanic font-bold not-italic text-2xl leading-[100%] uppercase text-white mb-6">
                    Top categories
                  </div>
                  <div className="flex flex-col gap-4">
                    {Object.values(mockDataTopCategories).map((e) => {
                      return (
                        <div
                          key={`statistic_${e.text}`}
                          className="flex justify-between"
                        >
                          <div className="font-casual font-normal text-base leading-[21px] text-white">
                            {e.text}
                          </div>
                          <div className="font-casual font-bold text-base leading-[21px] text-white">
                            {printNumber(get(e, 'count', 0))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

export async function getServerSideProps ({ params }) {
  const result = await client
    .query({
      query: GET_REVIEWS_AND_COMMENTS_BY_USER,
      variables: {
        reviewFilterValue: {
          author: { id: { eq: params.id } },
          status: { eq: REVIEW_STATUS.PUBLISHED }
        },
        reviewPagination: {
          pageSize: REVIEW_PAGE_SIZE
        },
        commentFilterValue: {
          user: { id: { eq: params.id } },
          review: {
            id: {
              ne: null
            }
          }
        },
        commentPagination: {
          pageSize: COMMENT_PAGE_SIZE
        },
        userId: params.id
      }
    })
    .then(async (res) => {
      const normalizedData = normalize(res.data)

      const reviews = get(normalizedData, 'reviews')
      const listGuildSlugOfReview = reviews
        .map((e) => get(e, 'guild.slug'))
        .filter(Boolean)
      const listGameSlugOfReview = reviews
        .map((e) => get(e, 'aggregator.slug'))
        .filter(Boolean)

      const rateFilterValue = { user: { id: { eq: params.id } }, or: [] }
      if (listGuildSlugOfReview.length) {
        rateFilterValue.or.push({
          guild: {
            slug: {
              in: listGuildSlugOfReview
            }
          }
        })
      }
      if (listGameSlugOfReview.length) {
        rateFilterValue.or.push({
          aggregator: {
            slug: {
              in: listGameSlugOfReview
            }
          }
        })
      }

      const queryRatesResult = await client
        .query({
          query: GET_USER_RATES_BY_GAME_AND_GUILD,
          variables: {
            rateFilterValue: rateFilterValue
          }
        })
        .then((res) => normalize(res.data))
        .catch(() => {
          return { rates: [] }
        })

      return {
        ...normalizedData,
        ...{
          user: {
            ...(get(normalizedData, 'user') || {}),
            rates: get(queryRatesResult, 'rates', [])
          }
        }
      }
    })

  return { props: { data: result } }
}

export default OtherProfile
