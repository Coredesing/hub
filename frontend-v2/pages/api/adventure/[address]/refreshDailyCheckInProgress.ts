import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

const bearer = `bearer ${process.env.NEXT_CATVENTURE_API_KEY}`

export function callWithRest (walletAddress: string) {
  return fetcher(
    `${CATVENTURE_API_BASE_URL}/social-checkers/${walletAddress}/progress/daily-check-in/refresh
  `,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer
      }
    }
  )
}

export default async function handler (req, res) {
  if (req.method === 'GET') {
    try {
      const walletAddress = req.query.address
      const response = await callWithRest(walletAddress)
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
