import { API_BASE_URL } from 'constants/api'
import { fetcher } from 'utils'

export function fetchOneCollection (slug) {
  return fetcher(`${API_BASE_URL}/marketplace/collection/${slug}`)
}

export default async function handler (req, res) {
  try {
    const { slug } = req.query
    const data = await fetchOneCollection(slug)
    if (!data?.data) {
      throw new Error('Invalid response')
    }

    res.status(200).json({ data: data?.data })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
