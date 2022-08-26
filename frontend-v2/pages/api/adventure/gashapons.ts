import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

export function callWithRest (body: any, headers: any) {
  return fetcher(`${CATVENTURE_API_BASE_URL}/gashapons/requests`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-wallet-address': headers?.['x-wallet-address'],
      'x-signature': headers?.['x-signature']
    }
  })
}

export default async function handler (req, res) {
  if (req.method === 'POST') {
    const response = await callWithRest(req.body, req.headers)
    res.status(response?.statusCode || 200).json(response)
    return
  }

  res.status(404)
}
