import { fetcher } from '@/utils'
import { API_CMS_URL } from '@/utils/constants'

export function connectWallet (data) {
  return fetcher(`${API_CMS_URL}/api/users/connect-wallet`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export default async function handler (req, res) {
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  if (req.method === 'POST') {
    try {
      const response = await connectWallet(payload)
      const { data, error } = response || {}
      if (!error) {
        res.status(200).json({ data })
      } else {
        res.status(500).json({
          error: 'Could not create account',
          err: error,
          body: JSON.parse(req.body)
        })
      }
    } catch (err) {
      res.status(500).json({
        error: 'Could not create account',
        err
      })
    }
  }
}
