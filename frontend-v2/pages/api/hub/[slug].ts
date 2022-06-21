import { client } from '@/graphql/apolloClient'
import { GET_AGGREGATORS_BY_SLUG } from '@/graphql/aggregator'
import isEmpty from 'lodash.isempty'

export function callWidthGraphql (slug) {
  return client.query({
    query: GET_AGGREGATORS_BY_SLUG,
    variables: { slug, pageSize: 1 }
  })
}

export default async function handler (req, res) {
  const { slug } = req.query
  try {
    const response = await callWidthGraphql(slug)
    const { data, errors } = response || {}
    if (isEmpty(errors)) {
      res.status(200).json({ data, slug })
    } else {
      res.status(500).json({
        error: 'failed to load data graphql',
        err: errors,
        slug
      })
    }
  } catch (err) {
    res.status(500).json({
      error: 'failed to load data',
      err,
      slug
    })
  }
}
