import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

const bearer = `bearer ${process.env.NEXT_CATVENTURE_API_KEY}`

export function callWithRest (address: any) {
  return fetcher(`${CATVENTURE_API_BASE_URL}/users/${address}/updateEligible`, {
    method: 'PATCH',
    body: JSON.stringify({
      isEligible: true
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer
    }
  })
}

export default async function handler (req, res) {
  if (req.method === 'PATCH') {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    try {
      const response = await callWithRest(payload?.walletAddress)
      const { data, error } = response || {}
      if (isEmpty(error)) {
        res.status(200).json(data)
      } else {
        res.status(500).json({
          response
        })
      }
    } catch (err) {
      res.status(500).json({
        err
      })
    }
  }
}
