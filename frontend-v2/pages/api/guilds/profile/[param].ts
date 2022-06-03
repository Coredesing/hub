import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'

export function callWidthRest (param) {
  return fetcher(`${API_CMS_URL}/api/users/profile/${param}`, {
    method: 'GET'
  })
}

export default async function handler (req, res) {
  try {
    const { param } = req.query
    const response = await callWidthRest(param)
    const { data, error } = response || {}
    if (!error) {
      res.status(200).json({ data })
    } else {
      res.status(500).json({
        error: 'failed to load data',
        err: error
      })
    }
  } catch (err) {
    res.status(500).json({
      error: 'failed to load data',
      err
    })
  }
}
