import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { client } from '@/graphql/apolloClient'
import { GET_LISTING_AGGREGATORS } from '@/graphql/aggregator'
import get from 'lodash.get'
import { QueryOptions, OperationVariables } from '@apollo/client'

export function fetchOneWithSlug (slug) {
  return fetcher(`${API_BASE_URL}/aggregator/slug/${slug}`)
}

export function fetchWidthGraphql (data: QueryOptions<OperationVariables, any>) {
  return client.query(data)
}

export async function fetchAllWithQueries (
  query: {
    page?: any;
    page_size?: any;
    category?: any;
    sort_by?: any;
    sort_order?: any;
    igo_status?: any;
    launch_status?: any;
    isLaunchedGameFi?: any;
    name?: any;
  } = {}
) {
  const {
    page = '1',
    page_size: pageSize = '10',
    category = '',
    sort_by: sortBy = 'createdAt',
    sort_order: sortOrder = 'desc',
    igo_status: igoStatus = '',
    launch_status: launchStatus = '',
    name = '',
    isLaunchedGameFi = false
  } = query
  try {
    const filtersValue: {
      releaseStatus?: object;
      igoStatus?: object;
      name?: object;
      project?: {
        isLaunchedGameFi?: object;
        categories?: object;
      };
    } = { project: {} }
    if (name) filtersValue.name = { containsi: name }

    if (launchStatus) filtersValue.releaseStatus = { eq: launchStatus }

    if (igoStatus) filtersValue.igoStatus = { eq: igoStatus }

    if (isLaunchedGameFi) {
      filtersValue.project.isLaunchedGameFi = { eq: true }
    }
    if (category) {
      filtersValue.project.categories = { name: { in: category.split(',') } }
    }
    const data = await client.query({
      query: GET_LISTING_AGGREGATORS,
      variables: {
        filtersValue,
        sortValue: `${sortBy}:${sortOrder}`,
        paginationValue: { pageSize: +pageSize, page: +page }
      }
    })
    const aggregators = get(data, 'data.aggregators', { data: [] })
    return {
      data: aggregators.data?.map((v) => {
        const d = v.attributes || {}
        const project = get(d, 'project.data.attributes', {})
        const tokenomic = project.tokenomic || { currentPrice: '' }
        const categories = get(project, 'categories.data', []).reduce(
          (final, item) => {
            final.text = `${final.text ? `${final.text}, ` : ''}${
              item.attributes.name
            }`
            final.data.push(item.attributes)
            return final
          },
          { text: '', data: [] }
        )
        const value = {
          ...d,
          tokenomic: {
            ...tokenomic,
            currentPrice: tokenomic.currentPrice.toString()
          },
          id: v.id,
          url: get(d, 'gallery.data.[0].attributes.url', ''),
          categories,
          shortDesc: project.shortDesc || ''
        }
        return value
      }),
      pageLast: get(aggregators, 'meta.pagination.pageCount', 1),
      page: page,
      pageSize: pageSize,
      category: category ? decodeURI(category) : null,
      igoStatus: igoStatus || null,
      launchStatus: launchStatus || null,
      isLaunchedGameFi: !!isLaunchedGameFi,
      name: name || '',
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'desc'
    }
  } catch (error) {
    console.debug('GET_LISTING_AGGREGATORS', error)
    return {}
  }
}

export default async function handler (req, res) {
  try {
    const data = await fetchAllWithQueries(req.query)
    if (!data?.data) {
      throw new Error('Invalid response')
    }

    res.status(200).json({ data: data?.data })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
