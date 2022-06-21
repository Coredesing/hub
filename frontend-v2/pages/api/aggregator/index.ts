import { fetcher } from '@/utils'
import { INTERNAL_BASE_URL } from '@/utils/constants'

function fetchAll (page = 1, category = '', idoType = '', launchStatus = '', name = '', sortBy = 'cmc_rank', sortOrder = 'asc', perPage = 10) {
  const url = `${INTERNAL_BASE_URL}/aggregator?per_page=${perPage}&page=${page}&price=true&category=${category}&ido_type=${idoType}&game_launch_status=${launchStatus}&game_name=${name}&sort_by=${sortBy}&sort_order=${sortOrder}`
  return fetcher(encodeURI(url))
}

export function fetchOneWithSlug (slug) {
  return fetcher(`${INTERNAL_BASE_URL}/aggregator/slug/${slug}`)
}

export async function fetchAllWithQueries (query) {
  const { page, per_page: perPage, category, sort_by: sortBy, sort_order: sortOrder, ido_type: idoType, launch_status: launchStatus, name } = query
  return await fetchAll(page, category, idoType, launchStatus, name, sortBy, sortOrder, perPage)
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
