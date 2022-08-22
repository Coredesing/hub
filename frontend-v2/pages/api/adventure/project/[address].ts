import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { CATVENTURE_API_BASE_URL } from '@/utils/constants'

const bearer = `bearer ${process.env.NEXT_CATVENTURE_API_KEY}`

export function callWithRest (address) {
  return fetcher(`${CATVENTURE_API_BASE_URL}/users/${address}/progresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer
    }
  })
}

export function joinTeam (address, slug) {
  console.log(`${CATVENTURE_API_BASE_URL}/users/${address}/connect/teams/${slug}`)
  return fetcher(`${CATVENTURE_API_BASE_URL}/users/${address}/connect/teams/${slug}`, {
    method: 'PATCH',
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
      const { data, error } = response || {}
      if (isEmpty(error)) {
        res.status(200).json(data)
      } else {
        res.status(500).json({
          err: error
        })
      }
    } catch (err) {
      res.status(500).json({
        err
      })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { address, slug } = req.query
      const response = await joinTeam(address, slug)
      console.log(response)

      const { data, error } = response || {}
      if (isEmpty(error)) {
        res.status(200).json(data)
      } else {
        res.status(500).json({
          err: error
        })
      }
    } catch (err) {
      res.status(500).json({
        err
      })
    }
  }
}
