import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

export function send (id, body) {
  return fetcher(encodeURI(`${API_BASE_URL}/aggregator/like/${id}`), { method: 'POST', body, headers: { 'content-type': 'application/json' } })
}

export default async function handler (req, res) {
  try {
    const { slug } = req.query
    if (!slug[0]) {
      throw new Error('Invalid Game')
    }

    const data = await send(slug[0], req.body)
    res.status(200).json({ data })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
