import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

function fetchAll (page = 1, category = '', idoType = '', launchStatus = '', sortBy = 'cmc_rank', sortOrder = 'asc', perPage = 10) {
  return fetcher(`${API_BASE_URL}/aggregator?per_page=${perPage}&page=${page}&price=true&category=${category}&ido_type=${idoType}&game_launch_status=${launchStatus}&sort_by=${sortBy}&sort_order=${sortOrder}`)
}

export function fetchOneWithSlug (slug) {
  return fetcher(`${API_BASE_URL}/aggregator/slug/${slug}`)
}

export async function fetchAllWithQueries (query) {
  const { page, category, sort_by: sortBy, sort_order: sortOrder, ido_type: idoType, launch_status: launchStatus } = query
  return await fetchAll(page, category, idoType, launchStatus, sortBy, sortOrder)
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
