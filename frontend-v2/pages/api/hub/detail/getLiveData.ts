import { client, clientNew } from '@/graphql/apolloClient'
import * as aggregator from '@/graphql/aggregator'

const shouldUseCache = [
  // 'GET_AGGREGATORS_BY_SLUG'
]

export function fetchWidthGraphql ({ query, variables }) {
  if (shouldUseCache.indexOf(query) > -1) {
    return clientNew.query({ query: aggregator[query], variables })
  }

  return client.query({ query: aggregator[query], variables })
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
