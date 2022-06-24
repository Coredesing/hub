import { clientNew } from '@/graphql/apolloClient'
import { CUSTOM_EPICWAR_FAVORITES } from '@/graphql/aggregator'

export function fetchWidthGraphql ({ start, limit }: { start?: number; limit?:number }) {
  return clientNew.query({ query: CUSTOM_EPICWAR_FAVORITES, variables: { start, limit } })
}

export default async function handler (req, res) {
  if (req.method !== 'GET') {
    return
  }

  const start = parseInt(req.query.start) || 0
  const limit = parseInt(req.query.limit) || 10

  try {
    const data = await fetchWidthGraphql({ start, limit })
    res.status(200).json({ data: data.data })
  } catch (err) {
    res.json({ error: 'invalid request', err: err.networkError?.result })
  }
}
