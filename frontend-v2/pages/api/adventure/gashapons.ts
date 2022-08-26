import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

const bearer = `bearer ${process.env.NEXT_CATVENTURE_API_KEY}`

export function callWithRest (body: any) {
  return fetcher(`${CATVENTURE_API_BASE_URL}/gashapons/requests`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer
    }
  })
}

export default async function handler (req) {
  if (req.method === 'POST') {
    return callWithRest(req.body)
  }
}
