import Layout from '@/components/Layout'
import CategoryCarousel from '@/components/Pages/Hub/HubListV2/CategoryCarousel'
import Filter, { SORT_ALIAS } from '@/components/Pages/Hub/HubListV2/Filter'
import { GET_LISTING_AGGREGATORS_V2 } from '@/graphql/aggregator'
import { client } from '@/graphql/apolloClient'
import { normalize } from '@/graphql/utils'
import { useState } from 'react'
import get from 'lodash.get'
import ListAggregator, { HEADERS } from '@/components/Pages/Hub/HubListV2/List'
import { useRouter } from 'next/router'

function HubListV2 ({ data }) {
  const router = useRouter()
  const getDefaultSortedField = () => {
    const { sort: sortQuery = '' } = router.query
    if (!sortQuery) return null

    const listSort = (sortQuery as string).split(',')
    if (listSort.length <= 1) return null
    const [field, order] = get(listSort, '[0]').split(':')
    const listSortedFieldHeader = HEADERS.filter(e => {
      return e.field
    })

    const sortedField = listSortedFieldHeader.find(e => {
      return e.field === field || SORT_ALIAS[e.field] === field
    })

    const fieldAlias = Object.entries(SORT_ALIAS).find(([originField]) => {
      return originField === sortedField?.field
    })

    return { field: get(fieldAlias, '[0]') || field, order }
  }

  const [title, setTitle] = useState<string>('')
  const [filterDescription, setFilterDescription] = useState<string>('')
  const [sortedField, setSortedField] = useState(getDefaultSortedField)

  return (
    <Layout
      title="GameFi.org - Hub"
      description="An ultimate gaming destination for gamers, investors, and other game studios."
    >
      <div className="w-full mb-[54px] mt-9">
        <div className="font-mechanic font-bold text-[40px] leading-[80%] uppercase px-6 2xl:px-[148px] xl:px-12 mb-5">
          {title}
        </div>
        <div className="font-casual font-normal text-base leading-[150%] tracking-[0.03px] text-[#D4D7E1] px-6 2xl:px-[148px] xl:px-12 w-full">
          {filterDescription}
        </div>
        <CategoryCarousel
          top5Aggregators={data.top5Aggregators}
          defaultTop5Aggregators={data.defaultTop5Aggregators}
        ></CategoryCarousel>
        <Filter
          className="2xl:px-[148px] xl:px-12 px-4 mt-6 md:mt-[60px] w-full"
          {...data}
          setTitle={setTitle}
          setFilterDescription={setFilterDescription}
          sortedField={sortedField}
          setSortedField={setSortedField}
        >
          <ListAggregator {...{ data, sortedField, setSortedField }}/>
        </Filter>
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ query }) {
  const {
    category,
    version_released: versionReleased,
    igo_status: igoStatus,
    sort,
    page = 1,
    page_size: pageSize = 10,
    verify_status: verifyStatus,
    search
  } = query
  const aggregatorsFilterValue: any = { project: { publishedAt: { not: null } } }
  let sortAggregator = ['project.tokenomic.totalHolders:desc']
  const paginationValue = {
    page: Number(page),
    pageSize: Number(pageSize > 50 ? 10 : pageSize)
  }
  if (search) {
    aggregatorsFilterValue.name = { contains: search }
  }
  if (sort) {
    sortAggregator = sort.split(',').map(e => {
      const [field, order] = e.split(':')
      const fieldAlias = Object.entries(SORT_ALIAS).find(alias => {
        const [, value] = alias
        return field === value
      })

      if (fieldAlias) {
        const [key] = fieldAlias
        return [`${key}:${order}`]
      }

      if (field === 'topReleased') {
        return [
          'releaseDate:desc',
          'project.tokenomic.volume24h:desc',
          'interactivePoint:desc',
          'rate:desc'
        ]
      }
      return e
    }).flat()
  }

  if (category) {
    aggregatorsFilterValue.project = {
      ...(aggregatorsFilterValue.project || {}),
      categories: { slug: { eq: category } }
    }
  }
  if (versionReleased) {
    aggregatorsFilterValue.releaseStatus = { in: versionReleased.split(',') }
  }
  if (igoStatus) {
    aggregatorsFilterValue.igoStatus = { in: igoStatus.split(',') }
  }
  if (verifyStatus) {
    const objFilterVerifyStatus = {
      isLaunchedGameFi: { eq: verifyStatus === 'true' }
    }

    aggregatorsFilterValue.project = {
      ...(aggregatorsFilterValue.project || {}),
      ...objFilterVerifyStatus
    }
  }

  let paginationMeta = {}
  const data = await client
    .query({
      query: GET_LISTING_AGGREGATORS_V2,
      variables: {
        categorySlug: category,
        aggregatorsFilterValue,
        sortAggregator,
        paginationValue,
        aggregatorLaunchedFilterValue: Object.assign(
          {},
          aggregatorsFilterValue,
          {
            igoStatus: { eq: 'launched' }
          }
        ),
        aggregatorUpcomingFilterValue: Object.assign(
          {},
          aggregatorsFilterValue,
          {
            igoStatus: { eq: 'upcoming' }
          }
        ),
        aggregatorTestnetFilterValue: Object.assign(
          {},
          aggregatorsFilterValue,
          {
            releaseStatus: { eq: 'testnet' }
          }
        ),
        aggregatorOfficialFilterValue: Object.assign(
          {},
          aggregatorsFilterValue,
          {
            releaseStatus: { eq: 'official' }
          }
        ),
        aggregatorVersionUpcomingFilterValue: Object.assign(
          {},
          aggregatorsFilterValue,
          {
            releaseStatus: { eq: 'upcoming' }
          }
        ),
        aggregatorStatusLaunchedFilterValue: Object.assign(
          {},
          aggregatorsFilterValue,
          {
            project: {
              ...(aggregatorsFilterValue.project || {}),
              isLaunchedGameFi: { eq: true }
            }
          }
        ),
        aggregatorVerifiedFilterValue: Object.assign(
          {},
          aggregatorsFilterValue,
          {
            project: {
              ...(aggregatorsFilterValue.project || {}),
              isLaunchedGameFi: { eq: false }
            }
          }
        )
      }
    })
    .then((res) => {
      paginationMeta = get(res, 'data.aggregators.meta.pagination') || {}
      return normalize(res.data)
    })

  return {
    props: {
      data: { ...data, paginationMeta }
    }
  }
}

export default HubListV2
