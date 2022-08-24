import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

const bearer = `bearer ${process.env.NEXT_CATVENTURE_API_KEY}`

export function callWithRest (address) {
  return fetcher(`${CATVENTURE_API_BASE_URL}/users/${address}/team`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer
    }
  })
}

export default async function handler (req, res) {
  if (req.method === 'GET') {
    try {
      const response = await callWithRest(req.query?.address)
      if (response) {
        res.status(200).json(response)
      } else {
        res.status(500).json(response)
      }
    } catch (err) {
      res.status(500).json({
        error: 'failed to load data',
        err
      })
    }
  }
}
