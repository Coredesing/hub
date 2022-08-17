import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { NEXT_TRACKING_SERVICE_URL } from '@/utils/constants'

export function callWidthRest (headers) {
  return fetcher(`${NEXT_TRACKING_SERVICE_URL}/tracking-management/ranks`, {
    method: 'GET'
  })
}

export default async function handler (req, res) {
  try {
    const response = await callWidthRest(req.headers)
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
