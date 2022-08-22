import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'

export function callWidthRest (data) {
  return fetcher(`${API_CMS_URL}/api/auth/send-email-confirmation`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      // 'x-signature': headers['x-signature'],
      // 'x-wallet-address': headers['x-wallet-address'],
      'Content-Type': 'application/json'
    }
  })
}

export default async function handler (req, res) {
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  try {
    const response = await callWidthRest(payload)
    const { data, error } = response || {}
    if (isEmpty(error)) {
      res.status(200).json({ data, response })
    } else {
      res.status(500).json({
        error: 'Something went wrong!',
        err: error,
        body: payload
      })
    }
  } catch (err) {
    res.status(500).json({
      error: 'Something went wrong!',
      err,
      body: payload
    })
  }
}
