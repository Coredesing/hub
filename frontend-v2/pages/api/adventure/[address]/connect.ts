import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

const bearer = `bearer ${process.env.NEXT_CATVENTURE_API_KEY}`

export function playGame (address, id) {
  return fetcher(`${CATVENTURE_API_BASE_URL}/users/connect/${address}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer
    }
  })
}

export default async function handler (req, res) {
  if (req.method === 'PATCH') {
    try {
      const { address, id } = req.query
      const response = await playGame(address, id)
      console.log(response)

      const { data, error } = response || {}
      if (isEmpty(error)) {
        res.status(200).json(data)
      } else {
        res.status(500).json(response)
      }
    } catch (err) {
      res.status(500).json({
        err
      })
    }
  }
}
