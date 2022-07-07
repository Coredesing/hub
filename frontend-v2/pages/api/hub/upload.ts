import { API_CMS_URL } from '@/utils/constants'
import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
}

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  httpProxyMiddleware(req, res, {
    pathRewrite: [{
      patternStr: '^/api/hub',
      replaceStr: 'api'
    }],
    target: API_CMS_URL
  })
}
