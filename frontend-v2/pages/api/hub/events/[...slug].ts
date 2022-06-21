import { API_CMS_URL } from '@/utils/constants'
import qs from 'qs'

export const fetchLeaderboards = (slug) => {
  const query = qs.stringify({
    populate: {
      aggregator: {
        populate: '*'
      }
    },
    filter: [slug],
    sort: ['activePoint:desc']
  }, {
    encodeValuesOnly: true
  })
  return fetch(`${API_CMS_URL}/api/leader-boards?${query}`).then(res => res.json())
}
export default async function handler (req, res) {
  if (req?.method === 'GET') {
    try {
      const { slug } = req.query
      if (!slug[0]) {
        throw new Error('Invalid Game')
      }

      const result = await fetchLeaderboards(slug)
      if (!result?.data) {
        res.status(200).json({ data: 0 })
        return
      }

      res.status(200).json({ data: result?.data || 0, meta: result?.meta })
    } catch (e) {
      res
        .status(500)
        .json(e)
    }

    return
  }

  res.status(403)
}
