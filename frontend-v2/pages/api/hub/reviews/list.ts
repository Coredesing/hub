import { client } from '@/graphql/apolloClient'
import { GET_REVIEWS_BY_SLUG } from '@/graphql/aggregator'
import { GET_MORE_REVIEW_BY_SLUG } from '@/graphql/guilds'
import isEmpty from 'lodash.isempty'
import { DocumentNode } from 'graphql'

export function fetchWidthGraphql ({ variables, type }) {
  let query: DocumentNode
  switch (type) {
  case 'guild':
    query = GET_MORE_REVIEW_BY_SLUG
    break

  default:
    query = GET_REVIEWS_BY_SLUG
    break
  }
  return client.query({ query, variables })
}

export default async function handler (req, res) {
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  try {
    const response = await fetchWidthGraphql(payload)
    const { data, error } = response || {}
    if (isEmpty(error)) {
      res.status(200).json({ data })
    } else {
      res.status(500).json({
        error: 'failed to load data graphql',
        err: error,
        body: payload
      })
    }
  } catch (err) {
    res.status(500).json({
      error: 'failed to load data',
      err,
      body: payload
    })
  }
}
