import { useEffect, useRef, useState } from 'react'
import { client } from '@/graphql/apolloClient'
import { GET_AGGREGATORS_BY_SLUG } from '@/graphql/aggregator'
import LayoutHub from '@/components/Layout/Hub'
import HubDetail from '@/components/Pages/Hub/HubDetails'
import Header from '@/components/Pages/Hub/HubDetails/Header'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import Script from 'next/script'
import { HubDetailContext } from '@/components/Pages/Hub/HubDetails/utils'
import { useScreens } from '@/components/Pages/Home/utils'
import Head from 'next/head'
import { nFormatter } from '@/components/Pages/Hub/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { gtagEvent, fetcher } from '@/utils'
import { gql } from '@apollo/client'

const GameDetails = ({ data = {} }) => {
  const [values, setValues] = useState(data)
  const changeData = useRef(null)
  const screen = useScreens()
  const router = useRouter()

  useEffect(() => {
    changeData?.current?.scrollIntoView({ behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug])

  useEffect(() => {
    const reviewFilterValue: any = { aggregator: { slug: { eq: router.query.slug } }, status: { eq: 'published' } }
    fetcher('/api/hub/detail/getLiveData', { method: 'POST', body: JSON.stringify({ variables: { slug: router.query.slug, reviewFilterValue, pageSize: 5 }, query: 'GET_AGGREGATORS_BY_SLUG' }) }).then(({ data: dataNew }) => {
      const { five, four, three, two, one, totalReviewMeta } = dataNew
      const aggregators = get(dataNew, 'aggregators.data[0]')
      setValues(vs => ({
        ...vs,
        ...(aggregators?.attributes || {}),
        reviews: dataNew?.reviews || [],
        totalReviewWithoutFilter: get(totalReviewMeta, 'meta.pagination.total', 0),
        rates: {
          five: get(five, 'meta.pagination.total', 0),
          four: get(four, 'meta.pagination.total', 0),
          three: get(three, 'meta.pagination.total', 0),
          two: get(two, 'meta.pagination.total', 0),
          one: get(one, 'meta.pagination.total', 0)
        }
      }))
    }).catch((err) => console.debug('err', err))
  }, [router])

  const isMobile = screen.mobile || screen.tablet

  return (
    <LayoutHub disableSearchBar title={data?.name ? `GameFi.org - ${data?.name}` : 'GameFi.org Games'} description={data?.gameIntroduction || 'An ultimate gaming destination for gamers, investors, and other game studios.'} image={get(data, 'mobileThumbnail.data.[0].attributes.url', '/')}>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.name || 'GameFi.org Games'} />
        <meta name="twitter:description" content={data?.gameIntroduction || 'An ultimate gaming destination for gamers, investors, and other game studios.'} />
        <meta name="twitter:url" content={`https://gamefi.org/hub/${data?.slug}`} />
        <meta name="twitter:image" content={data?.screen_shots_1} />
      </Head>
      <Script type="text/javascript" src="https://s3.tradingview.com/tv.js" strategy="beforeInteractive"></Script>
      <div className="px-4 lg:px-24 md:container mx-auto lg:block" ref={changeData}>
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
                <span className="inline-flex items-center text-sm font-medium cursor-pointer text-gray-200">{data?.name}</span>
              </div>
            </li>
          </ol>
        </nav>
        {!data && <div className="uppercase font-bold text-3xl mb-6">Game Not Found</div>}
        <Link href={`/hub/${data?.slug}/info`} passHref>
          <a className="w-full flex md:hidden items-center uppercase overflow-hidden py-3 px-8 bg-white/20 font-bold text-[13px] rounded-xs hover:opacity-95 cursor-pointer justify-center rounded-sm clipped-b-l ml-auto" onClick={() => {
            gtagEvent('hub_more_info', {
              name: data?.slug
            })
          }}>
            <div className='uppercase'><span>More Information</span></div>
          </a>
        </Link>
        {data && <HubDetailContext.Provider value={{
          hubData: values
        }}>
          <Header
            callApi={!isMobile}
            className={'hidden md:flex'}
            name={data?.name}
            id={data?.id}
            isVerified={get(data, 'project.data.attributes.isVerifiedGameFi')}
            totalFavorites={nFormatter(values?.totalFavorites)}
            slug={data?.slug}
          />

          <div id='HubDetailContent' className="flex flex-col font-casual gap-2">
            <HubDetail data={values} />
          </div>
        </HubDetailContext.Provider>}
      </div>
    </LayoutHub>
  )
}

export async function getStaticProps ({ params }) {
  if (!params?.slug) {
    return { props: { data: {} }, revalidate: 60 }
  }
  try {
    const reviewFilterValue: any = { aggregator: { slug: { eq: params.slug } }, status: { eq: 'published' } }
    const { data = {} } = await client.query({
      query: GET_AGGREGATORS_BY_SLUG,
      variables: { slug: params.slug, reviewFilterValue, pageSize: 5 }
    })

    const { five, four, three, two, one, totalReviewMeta } = data
    const aggregators = get(data, 'aggregators.data[0]')
    if (isEmpty(aggregators)) {
      return { props: { data: {} }, revalidate: 60 }
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
      },
      revalidate: 60
    }
  } catch (e) {
    console.debug('error1', JSON.stringify(e))
    return { props: { data: {} }, revalidate: 60 }
  }
}

export async function getStaticPaths () {
  try {
    const { data = {} } = await client.query({
      query: gql`{
        aggregators(pagination:{ pageSize: 1000 }) {
          data {
            attributes {
              slug
            }
          }
        }
      }`
    })

    return {
      paths: (data?.aggregators?.data || []).map(x => ({ params: x?.attributes })),
      fallback: 'blocking'
    }
  } catch (err) {
    return {
      paths: [],
      fallback: true
    }
  }
}

export default GameDetails
