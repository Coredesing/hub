import Layout from '@/components/Layout'
import UserProfile from '@/components/Pages/Account/Review/UserProfile'
import {
  COMMENT_PAGE_SIZE,
  REVIEW_PAGE_SIZE,
  REVIEW_STATUS
} from '@/components/Pages/Account/Review/TabReviews'
import ReviewAndComment from '@/components/Pages/Account/ReviewAndComment'
import { client } from '@/graphql/apolloClient'
import { GET_REVIEWS_AND_COMMENTS_BY_USER } from '@/graphql/reviews'
import { normalize } from '@/graphql/utils'
import { useRouter } from 'next/router'
import get from 'lodash.get'
import { printNumber } from '@/utils'
import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from 'react'

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
        count: data.user.reviewCount || 0
      },
      {
        text: 'Comments',
        count: data.user.commentCount || 0
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
  }, [data.user])
  const userData = get(data, 'user') || {}

  return (
    <Layout title='GameFi.org - Profile'>
      {
        !data.user && <div className="uppercase font-bold text-3xl md:px-32 md:pb-20 p-6">
        User Not Found
        </div>
      }
      {
        data.user && <div className="md:px-[156px] md:pb-20 px-4 pb-4">
          <a
            onClick={() => {
              router.back()
            }}
            className="hidden md:inline-flex items-center text-sm font-casual mb-[55px] hover:text-gamefiGreen-500 cursor-pointer"
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
          <UserProfile editable={false} data={userData}></UserProfile>
          <div className="flex md:gap-5">
            <div className="flex-1">
              <ReviewAndComment data={data} status={null} user={userData}></ReviewAndComment>
            </div>
            {
              mediumScreen && <div className="w-[228px] md:mt-[60px]">
                {/* Statistics */}
                <div className="w-full rounded-[4px] bg-[#21232A] p-6">
                  <div className="font-mechanic font-bold not-italic text-2xl leading-[100%] uppercase text-white mb-6">
                    Statistics
                  </div>
                  <div className="flex flex-col gap-4">
                    {statistics?.map((e) => {
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
            }
          </div>
        </div>
      }
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
          user: { id: { eq: params.id } }
        },
        commentPagination: {
          pageSize: COMMENT_PAGE_SIZE
        },
        userId: params.id
      }
    })
    .then((res) => normalize(res.data))
  return { props: { data: result } }
}

export default OtherProfile
