import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'

export function callWidthRest (headers) {
  return fetcher(`${API_CMS_URL}/api/users/me/profile`, {
    method: 'GET',
    headers: {
      'x-signature': headers['x-signature'],
      'x-wallet-address': headers['x-wallet-address']
    }
  })
}

export default async function handler (req, res) {
  try {
    const headers = req.headers
    const response = await callWidthRest(headers)
    if (response) {
      res.status(200).json({ ...response })
    } else {
      res.status(500).json({
        ...response
      })
    }
  } catch (err) {
    res.status(500).json({
      ...err
    })
  }
}
