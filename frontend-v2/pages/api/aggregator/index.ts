import { API_BASE_URL } from 'constants/api'
import { fetcher } from 'utils'

function fetchAll (page = 1, category = '', perPage = 12) {
  return fetcher(`${API_BASE_URL}/aggregator?per_page=${perPage}&page=${page}&price=true&category=${category}`)
}

export function fetchOneWithSlug (slug) {
  return fetcher(`${API_BASE_URL}/aggregator/slug/${slug}`)
}

export async function fetchAllWithQueries (query) {
  const { page, category } = query
  return await fetchAll(page, category)
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
