import { useState, useEffect } from 'react'
import { client } from '@/graphql/apolloClient'
import { GET_AGGREGATORS_BY_SLUG } from '@/graphql/aggregator'
import LayoutHub from '@/components/Layout/Hub'
import { useRouter } from 'next/router'
import HubTab from '@/components/Pages/Hub/HubDetails/Tab'
import Header from '@/components/Pages/Hub/HubDetails/Header'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import Script from 'next/script'
import { HubDetailContext } from '@/components/Pages/Hub/HubDetails/utils'
import { useScreens } from '@/components/Pages/Home/utils'
import Head from 'next/head'
import { fetcher } from '@/utils'
import { nFormatter } from '@/components/Pages/Hub/utils'
import Link from 'next/link'

const PAGE_SIZE = 5

const mapIndex = (tab) => {
  if (tab === 'info') return 0
  if (tab === 'token') return 1
  if (tab === 'reviews') return 2
}

function Tab ({ data }) {
  const [values, setValues] = useState(data)
  const screen = useScreens()
  const router = useRouter()
  const [index, setIndex] = useState(mapIndex(router.query.tab[0]))

  useEffect(() => {
    setIndex(mapIndex(router.query.tab[0]))
  }, [router.query.tab])

  useEffect(() => {
    const reviewFilterValue: any = { aggregator: { slug: { eq: router.query.slug } }, status: { eq: 'published' } }
    fetcher('/api/hub/detail/getLiveData', { method: 'POST', body: JSON.stringify({ variables: { slug: router.query.slug, reviewFilterValue, pageSize: PAGE_SIZE }, query: 'GET_AGGREGATORS_BY_SLUG' }) }).then(({ ...v }) => {
      const dataNew = v?.data
      const { five, four, three, two, one, totalReviewMeta } = dataNew || {}
      const aggregators = get(dataNew, 'aggregators.data[0]')
      setValues({
        ...values,
        ...aggregators.attributes,
        reviews: dataNew?.reviews || [],
        totalReviewWithoutFilter: get(totalReviewMeta, 'meta.pagination.total', 0),
        pageCountReviews: Math.ceil(get(dataNew, 'reviews.meta.pagination.total', 0) / PAGE_SIZE),
        rates: {
          five: get(five, 'meta.pagination.total', 0),
          four: get(four, 'meta.pagination.total', 0),
          three: get(three, 'meta.pagination.total', 0),
          two: get(two, 'meta.pagination.total', 0),
          one: get(one, 'meta.pagination.total', 0)
        }
      })
    }).catch((err) => console.debug('err', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    if (index === 0) {
      router.push(`/hub/${router.query.slug}/info`)
    }
    if (index === 1) {
      router.push(`/hub/${router.query.slug}/token`)
    }
    if (index === 2) {
      router.push(`/hub/${router.query.slug}/reviews`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const isMobile = screen.mobile || screen.tablet

  return (
    <LayoutHub disableSearchBar title={data?.name ? `GameFi.org - ${data?.name}` : 'GameFi.org Games'} description={data?.gameIntroduction || 'An ultimate gaming destination for gamers, investors, and other game studios.'} image={get(data, 'mobileThumbnail.data.[0].attributes.url', '/')}>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.name || 'GameFi.org Games'} />
        <meta name="twitter:description" content={data?.gameIntroduction || 'An ultimate gaming destination for gamers, investors, and other game studios.'} />
        <meta name="twitter:url" content={`https://gamefi.org/hub/${data.slug}`} />
        <meta name="twitter:image" content={data.screen_shots_1} />
      </Head>
      <Script type="text/javascript" src="https://s3.tradingview.com/tv.js" strategy="beforeInteractive"></Script>
      <div className="px-4 lg:px-24 md:container mx-auto lg:block">
        <nav className="hidden md:flex mb-6 items-center" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href={'/hub'} passHref>
                <a className="inline-flex items-center text-sm font-medium hover:text-gamefiGreen-500 cursor-pointer text-gray-200">Game Hub</a>
              </Link>
            </li>
            <li>
              <svg className="w-6 h-6 text-gray-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            </li>
            <li>
              <div className="flex items-center">
                <Link href={'/hub/list'} passHref>
                  <a className="inline-flex items-center text-sm font-medium hover:text-gamefiGreen-500 cursor-pointer text-gray-200">All Games</a>
                </Link>
              </div>
            </li>
            <li>
              <svg className="w-6 h-6 text-gray-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <Link href={`/hub/${data?.slug}`} passHref>
                  <a className="inline-flex items-center text-sm font-medium hover:text-gamefiGreen-500 cursor-pointer text-gray-200">{data?.name}</a>
                </Link>
              </div>
            </li>
            <li>
              <svg className="w-6 h-6 text-gray-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="inline-flex items-center text-sm font-medium cursor-default text-gray-200">
                  {
                    (index === 0 && 'Game Information') || (index === 1 && 'Token') || (index === 2 && 'Rating & Reviews')
                  }
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {!data && <div className="uppercase font-bold text-3xl mb-6">Game Not Found</div>}
        <Link
          href={{
            pathname: '/hub/[slug]',
            query: { slug: data?.slug }
          }}>
          <a className="w-full flex md:hidden items-center uppercase overflow-hidden py-3 px-8 bg-white/20 font-bold text-[13px] rounded-xs hover:opacity-95 cursor-pointer justify-center rounded-sm clipped-b-l ml-auto">
            <div className="flex items-center mr-2">
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.8625 11.8617L7.0875 10.6367L3.325 6.87422H14V5.12422H3.325L7.0875 1.36172L5.8625 0.136719L0 5.99922L5.8625 11.8617Z" fill="white" />
              </svg>
            </div>
            <div className='uppercase'><span>Back To Overview</span></div>
          </a>
        </Link>
        {data && <HubDetailContext.Provider value={{
          hubData: data
        }}>
          <Header
            callApi={!isMobile}
            className={'hidden md:flex'}
            name={data?.name}
            id={data?.id}
            slug={data?.slug}
            isVerified={get(data, 'project.data.attributes.isVerifiedGameFi')}
            totalFavorites={nFormatter(data?.totalFavorites)}
            viewDetail={true}
          />
          <div id='HubDetailContent' className="flex flex-col font-casual gap-2">
            <HubTab data={data} tab={router.query.tab[0]} index={index} setIndex={setIndex} />
          </div>
        </HubDetailContext.Provider>}
      </div>
    </LayoutHub>
  )
}

export async function getServerSideProps ({ params, query }) {
  if (!params?.slug) {
    return { props: { data: {} } }
  }
  try {
    // const page = query.page || 1
    // const pageSize = page * PAGE_SIZE
    const pageSize = 5 // default page size

    const reviewFilterValue: any = { aggregator: { slug: { eq: params.slug } }, status: { eq: 'published' } }

    if (query.rating_level) {
      reviewFilterValue.author = {
        ...(reviewFilterValue.author || {}),
        rates: {
          rate: { eq: +query.rating_level },
          aggregator: { slug: { eq: params.slug } }
        }
      }
    }
    if (query.user_rank) {
      reviewFilterValue.author = {
        ...(reviewFilterValue.author || {}),
        rank: { eq: query.user_rank }
      }
    }

    const { data = {} } = await client.query({
      query: GET_AGGREGATORS_BY_SLUG,
      variables: { slug: params.slug, reviewFilterValue, pageSize }
    })

    const { five, four, three, two, one, totalReviewMeta } = data
    const aggregators = get(data, 'aggregators.data[0]')
    if (isEmpty(aggregators)) {
      return { props: { data: {} } }
    }

    let gameIntroduction = ''

    try {
      if (aggregators?.attributes?.introduction) {
        const obj = JSON.parse(aggregators?.attributes?.introduction)
        gameIntroduction = obj?.blocks?.[0]?.data?.text || ''
      }
    } catch (err) {

    }

    return {
      props: {
        data: {
          ...aggregators.attributes,
          id: aggregators.id,
          reviews: data?.reviews || [],
          totalReviewWithoutFilter: get(totalReviewMeta, 'meta.pagination.total', 0),
          pageCountReviews: Math.ceil(get(data, 'reviews.meta.pagination.total', 0) / PAGE_SIZE),
          userRanks: ['Expert', 'Professional', 'Middle', 'Amateur'],
          gameIntroduction,
          rates: {
            five: get(five, 'meta.pagination.total', 0),
            four: get(four, 'meta.pagination.total', 0),
            three: get(three, 'meta.pagination.total', 0),
            two: get(two, 'meta.pagination.total', 0),
            one: get(one, 'meta.pagination.total', 0)
          }
        }
      }
    }
  } catch (e) {
    console.debug('error1', JSON.stringify(e))
    return { props: { data: {} } }
  }
}

export default Tab
