import { API_CMS_URL } from '@/utils/constants'
import qs from 'qs'
import cache from 'memory-cache'

const CACHE_TIME = 1000 * 60 // 1 min

export const fetchLeaderboards = async (slug) => {
  try {
    const query = qs.stringify({
      populate: ['aggregator.verticalThumbnail', 'aggregator.project'],
      filter: [slug],
      sort: ['activePoint:desc', 'aggregator.totalViews:desc']
    }, {
      encodeValuesOnly: true
    })

    const url = `${API_CMS_URL}/api/leader-boards?${query}`
    const cachedResponse = await cache.get(url)
    if (cachedResponse) {
      return cachedResponse
    }
    const response = await fetch(url).then(res => res.json())
    cache.put(url, response, CACHE_TIME)
    return response
  } catch (e) {
    console.log(e)
    return null
  }
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
