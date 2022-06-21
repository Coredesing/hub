import GhostContentAPI from '@tryghost/content-api'

export function fetchPosts (tag, perPage = 20) {
  const api = new GhostContentAPI({
    url: 'https://gamefi.ghost.io',
    key: process.env.NEXT_GHOST_API_KEY,
    version: 'v4.46'
  })

  return api.posts.browse({ filter: `tag:${tag}`, limit: perPage })
}

export default async function handler (req, res) {
  if (req.method !== 'GET') {
    return
  }

  const tag = req.query?.tag
  const limit = req.query?.limit || 20

  try {
    const data = await fetchPosts(tag, limit)

    if (!data) {
      res.status(200).json({ status: 200, message: 'No Post Found', data })
      return
    }

    res.status(200).json({ status: 200, message: 'Success', data })
  } catch (e) {
    res.status(500).json({ status: 500, message: e?.message || 'Something went wrong!', data: null })
  }
}
