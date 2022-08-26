import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

const bearer = `bearer ${process.env.NEXT_CATVENTURE_API_KEY}`

export function callWithRest (slug) {
  return fetcher(`${CATVENTURE_API_BASE_URL}/projects/${slug || ''}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer
    }
  })
}

export default async function handler (req, res) {
  if (req.method === 'GET') {
    const response = await callWithRest(req.query?.slug)
    res.status(response?.statusCode || 200).json(response)
    return
  }

  res.status(404)
}
