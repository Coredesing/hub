import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { NEXT_TRACKING_SERVICE_URL } from '@/utils/constants'

export function callWidthRest (data, headers) {
  return fetcher(`${NEXT_TRACKING_SERVICE_URL}/tracking-management/collect`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

export default async function handler (req, res) {
  try {
    const payload =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const response = await callWidthRest(payload, req.headers)
    const { data, error } = response || {}
    if (isEmpty(error)) {
      res.status(200).json({ data })
    } else {
      res.status(200).json({
        err: error
      })
    }
  } catch (err) {
    res.status(500).json({
      error: 'failed to load data',
      err,
      body: JSON.parse(req.body)
    })
  }
}
