import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'

export function put (data, headers, id) {
  return fetcher(`${API_CMS_URL}/api/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
    headers: {
      'X-signature': headers['x-signature'],
      'X-Wallet-Address': headers['x-wallet-address'],
      'Content-Type': 'application/json'
    }
  })
}

export default async function handler (req, res) {
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  try {
    const { id } = req.query
    let response
    if (req.method === 'PUT') {
      response = await put(payload, req.headers, id)
    }
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
