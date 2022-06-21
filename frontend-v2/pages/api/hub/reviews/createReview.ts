import { client } from '@/graphql/apolloClient'
import { CREATE_REVIEW } from '@/graphql/reviews'
import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'

export function callWidthGraphql (data) {
  return client.query({
    query: CREATE_REVIEW,
    variables: {
      data
    }
  })
}

export function callWidthRest (data, headers) {
  return fetcher(`${API_CMS_URL}/api/reviews`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'X-Signature': headers['x-signature'],
      'X-Wallet-Address': headers['x-wallet-address'],
      'Content-Type': 'application/json'
    }
  })
}

export default async function handler (req, res) {
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  try {
    const response = await callWidthRest(payload, req.headers)
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
