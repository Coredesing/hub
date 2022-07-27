import { client } from '@/graphql/apolloClient'
import * as aggregator from '@/graphql/aggregator'

export function fetchWidthGraphql ({ variables }) {
  return client.query({ query: aggregator.GET_LIST_FAVORITE_BY_USER_ID, variables })
}

export default async function handler (req, res) {
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  try {
    const data = await fetchWidthGraphql(payload)
    res.status(200).json({ data: data.data })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'failed to load data1,', err, body: req.body })
  }
}
