import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'
import * as guilds from '@/graphql/guilds'
import { client } from '@/graphql/apolloClient'

export function actionFavorite (data, headers) {
  const { favorite, ...res } = data
  return fetcher(`${API_CMS_URL}/api/favorites/${favorite ? 'un' : ''}favorite`, {
    method: 'POST',
    body: JSON.stringify({ data: res }),
    headers: {
      'x-signature': headers['x-signature'],
      'x-wallet-address': headers['x-wallet-address'],
      'Content-Type': 'application/json'
    }
  })
}

export function fetchFavorites (variables) {
  console.log(variables)
  return client.query({ query: guilds.GET_TOTAL_FAVORITES, variables })
}

export default async function handler (req, res) {
  if (req?.method === 'POST') {
    try {
      const response = await actionFavorite(JSON.parse(req.body), req.headers)
      const { data, e } = response || {}
      if (!e) {
        res.status(200).json({ data })
      } else {
        res.status(500).json(e)
      }
    } catch (e) {
      res.status(500).json(e)
    }
    return
  }

  if (req?.method === 'GET') {
    try {
      console.log(req?.query?.id?.toString())
      const result = await fetchFavorites({ objectID: req?.query?.id?.toString() })
      // console.log(result?.data?.favorites?.meta?.pagination)
      if (!result?.data) {
        res.status(200).json({ data: 0 })
        return
      }

      res.status(200).json({ data: result?.data?.favorites?.meta?.pagination?.total || 0 })
    } catch (e) {
      res
        .status(500)
        .json(e)
    }
  }
}
