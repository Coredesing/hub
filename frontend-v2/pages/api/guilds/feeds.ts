import cache from 'memory-cache'

const CACHE_TIME = 1000 * 60 * 60 * 6 // 6 hours
const bearer = `bearer ${process.env.NEXT_TWITTER_API_KEY}`
const configs = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: bearer
  }
}
const fetchTimeline = async (id, limit = 6) => {
  const url = `https://api.twitter.com/2/users/${id}/tweets?expansions=attachments.media_keys&media.fields=preview_image_url,url&tweet.fields=created_at&max_results=${limit}`
  const cachedResponse = await cache.get(url)
  if (cachedResponse) {
    console.log('get-cache', cachedResponse)
    return cachedResponse
  }

  const response = await fetch(url, configs).then(res => res.json())
  cache.put(url, response, CACHE_TIME)
  return response
}

const fetchUser = async (id) => {
  const url = `https://api.twitter.com/2/users/${id}?user.fields=profile_image_url,url,username,verified`
  const cachedResponse = await cache.get(url)
  if (cachedResponse) {
    console.log('get-cache', cachedResponse)
    return cachedResponse
  }

  const response = await fetch(url, configs).then(res => res.json())
  cache.put(url, response, CACHE_TIME)
  return response
}

export default async function handler (req, res) {
  if (req.method === 'GET') {
    const id = req.query?.id
    const limit = req.query?.limit || 6

    try {
      const response = await fetchTimeline(id, limit)

      if (!response) {
        res.status(200).json({ status: 200, message: 'No Post Found', data: null })
        return
      }

      const userInfo = await fetchUser(id)

      res.status(200).json({
        status: 200,
        message: 'Success',
        data: {
          user: userInfo,
          posts: response
        }
      })
    } catch (e) {
      res.status(500).json({ status: 500, message: e?.message || 'Something went wrong!', data: null })
    }
  }

  res.status(403).json({ status: 403, message: 'Method not allowed' })
}
