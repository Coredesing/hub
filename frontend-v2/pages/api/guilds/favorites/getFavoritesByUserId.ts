import { client } from '@/graphql/apolloClient'
import * as guilds from '@/graphql/guilds'

export function fetchFavorite ({ variables }) {
  return client.query({ query: guilds.GET_FAVORITE_BY_USER_ID, variables })
}

export default async function handler (req, res) {
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  try {
    const data = await fetchFavorite(payload)
    res.status(200).json({ data: data.data })
  } catch (e) {
    res
      .status(500)
      .json(e)
  }
}
