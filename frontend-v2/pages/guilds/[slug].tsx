import { useCallback, useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import useHubProfile from '@/hooks/useHubProfile'
import { client } from '@/graphql/apolloClient'
import { GET_GUILD_REVIEWS_BY_SLUG } from '@/graphql/guilds'
import { normalize } from '@/graphql/utils'
import Layout from '@/components/Layout'
import { BackIcon } from '@/components/Base/Icon'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import Home from '@/components/Pages/Guilds/GuildDetail/Home'
import HeaderProfile from '@/components/Pages/Guilds/GuildDetail/HeaderProfile'
import News from '@/components/Pages/Guilds/GuildDetail/News'
import { GuildDetailContext } from '@/components/Pages/Guilds/GuildDetail/utils'
import { fetchOneWithSlug } from '@/pages/api/hub/guilds'
import 'tippy.js/dist/tippy.css'
import Reviews from '@/components/Pages/Guilds/GuildDetail/Reviews'

interface GuildDetailProps {
  guildData: any;
  guildReviewsData: any;
}

const GuildDetail = ({ guildData, guildReviewsData }: GuildDetailProps) => {
  const router = useRouter()
  const setTab = useCallback((index: number) => {
    switch (index) {
    case 1: return router.push(`/guilds/${router.query.slug}?tab=news`)
    case 2: return router.push(`/guilds/${router.query.slug}?tab=reviews`)
    default: router.push(`/guilds/${router.query.slug}`)
    }
  }, [router])
  const tab = useMemo(() => {
    switch (router.query.tab) {
    case 'news': return 1
    case 'reviews': return 2
    default: return 0
    }
  }, [router.query.tab])

  const [loading, setLoading] = useState(false)
  const [currentRate, setCurrentRate] = useState(0)
  const { accountHub } = useHubProfile()

  useEffect(() => {
    if (isEmpty(accountHub)) {
      setCurrentRate(0)
      return
    }

    fetcher('/api/hub/reviews', {
      method: 'POST',
      body: JSON.stringify({
        variables: {
          userId: accountHub.id,
          slug: router.query.slug
        },
        query: 'GET_REVIEW_AND_RATE_BY_USER_ID_FOR_GUILD'
      })
    }).then((res) => {
      setLoading(false)
      if (!isEmpty(res)) {
        const data = normalize(res.data)
        const rate = get(data, 'rates[0].rate', '')
        if (rate) {
          setCurrentRate(rate)
        } else {
          setCurrentRate(0)
        }
      }
    }).catch(() => setLoading(false))
  }, [accountHub, router.query.slug])

  const formattedReviews = useMemo(() => {
    return {
      data: guildReviewsData.reviews.data.map(e => {
        const { author = {}, publishedAt, rate, review, title, likeCount, dislikeCount, commentCount } = e?.attributes || {}
        const { level, rank, repPoint, firstName, lastName, avatar, walletAddress, reviewCount, rates } = author?.data?.attributes || {}

        return {
          id: e?.id || '',
          publishedAt,
          rate,
          title,
          review,
          likeCount,
          dislikeCount,
          commentCount,
          user: {
            id: get(author, 'data.id'),
            level,
            rank,
            firstName,
            lastName,
            reps: repPoint,
            avatar: {
              url: avatar?.data?.attributes?.url
            },
            walletAddress,
            reviewCount,
            rates
          }
        }
      })
    }
  }, [guildReviewsData])

  return (
    <Layout title={`GameFi.org - ${guildData?.name || 'Guild'}`} description="" extended={!!guildData}>
      {
        !guildData && <div>
          <a onClick={() => {
            router.back()
          }} className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer">
            <BackIcon />
            Back
          </a>
          <div className="w-full h-32 flex items-center justify-center text-2xl font-bold uppercase">Guild Not Found</div>
        </div>
      }
      {
        guildData && <GuildDetailContext.Provider value={{
          guildData
        }}>
          <HeaderProfile totalFavorites={guildData.totalFavorites} currentRate={currentRate} setCurrentRate={setCurrentRate} loading={loading} setLoading={setLoading} />
          <div className="mx-auto">
            <Tabs
              titles={[
                'HOME',
                'NEWS',
                'RATING & REVIEWS'
              ]}
              currentValue={tab}
              onChange={(index) => {
                setTab(index)
              }}
              className="container mx-auto mt-10 px-4 lg:px-16"
            />
            <TabPanel value={tab} index={0}>
              <div className="py-8">
                <Home guildReviewsData={guildReviewsData} />
              </div>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <div className="container mx-auto py-8">
                <News />
              </div>
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <div className="container mx-auto py-8 px-4 lg:px-16">
                <Reviews
                  data={formattedReviews}
                  totalReviews={guildReviewsData.totalReviews}
                  rates={guildReviewsData.rates}
                  id={guildData.id}
                  tabRef={null}
                  currentResource='guilds'
                  currentRate={currentRate}
                  setCurrentRate={setCurrentRate}
                />
              </div>
            </TabPanel>
          </div>
        </GuildDetailContext.Provider>
      }
    </Layout>
  )
}

export default GuildDetail

const getGuildReviewsData = async (slug, query) => {
  try {
    const reviewFilterValue: any = { guild: { slug: { eq: slug } }, status: { eq: 'published' } }

    if (query.rating_level) {
      reviewFilterValue.author = {
        ...(reviewFilterValue.author || {}),
        rates: {
          rate: { eq: +query.rating_level },
          guild: { slug: { eq: slug } }
        }
      }
    }
    const { data = {} } = await client.query({
      query: GET_GUILD_REVIEWS_BY_SLUG,
      variables: { slug: slug, reviewFilterValue, pageSize: 5 }
    })
    const { five, four, three, two, one } = data

    return {
      reviews: data?.reviews || [],
      rates: {
        five: get(five, 'meta.pagination.total', 0),
        four: get(four, 'meta.pagination.total', 0),
        three: get(three, 'meta.pagination.total', 0),
        two: get(two, 'meta.pagination.total', 0),
        one: get(one, 'meta.pagination.total', 0)
      },
      totalReviews: get(data, 'totalReviewMeta.meta.pagination.total', 0)
    }
  } catch (e) {
    console.debug('error1', JSON.stringify(e))
    return {}
  }
}

export async function getServerSideProps ({ params, query }) {
  const slug = params?.slug
  let guildData = null
  let guildReviewsData = {}

  if (!slug) {
    return { props: { guildData, guildReviewsData } }
  }

  const { data: guilds } = await fetchOneWithSlug(slug)
  guildData = guilds[0]
  guildReviewsData = await getGuildReviewsData(slug, query)

  return { props: { guildData, guildReviewsData } }
}
