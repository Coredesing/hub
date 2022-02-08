import { fetcher } from '@/utils'

export function fetchOneCollection (slug) {
  return fetcher(`https://hub-v2.gamefi.org/api/v1/marketplace/collection/${slug}`)
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
