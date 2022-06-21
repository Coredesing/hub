import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'

export function callWidthRest (data) {
  return fetcher(`${API_CMS_URL}/api/users/connect-wallet`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
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
      res.status(200).json({ data })
    } else {
      res.status(500).json({
        error: 'Could not create account',
        err: error,
        body: payload
      })
    }
  } catch (err) {
    res.status(500).json({
      error: 'Could not create account',
      err,
      body: payload
    })
  }
}
