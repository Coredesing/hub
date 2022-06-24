import { clientNew } from '@/graphql/apolloClient'
import { CUSTOM_PARTNER_ANALYTICS } from '@/graphql/aggregator'
import crypto from 'crypto'

export function fetchWidthGraphql ({ start, limit, startReviews, limitReviews, favoriteID, reviewSlug }: { start?: number; limit?: number; startReviews?: number; limitReviews?: number; favoriteID?: string; reviewSlug?: string }) {
  return clientNew.query({ query: CUSTOM_PARTNER_ANALYTICS, variables: { start, limit, startReviews, limitReviews, favoriteID, reviewSlug } })
}

export default async function handler (req, res) {
  const token = crypto.createHash('md5').update(`${process.env.NEXT_HUB_PARTNERSHIP_KEY || 'partnership'}|epicwar`).digest('hex')
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' })
    return
  }

  if (req.query?.token !== token) {
    res.status(401).json({ error: 'unauthenticated' })
    return
  }

  const start = parseInt(req.query.start) || 0
  const limit = parseInt(req.query.limit) || 10

  const startReviews = parseInt(req.query.start_reviews) || 0
  const limitReviews = parseInt(req.query.limit_reviews) || 10

  try {
    const data = await fetchWidthGraphql({ start, limit, startReviews, limitReviews, favoriteID: '76', reviewSlug: 'epic-war' })
    res.status(200).json({ data: data.data, token })
  } catch (err) {
    res.json({ error: 'invalid request', err: err.networkError?.result })
  }
}
