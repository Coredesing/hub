import { fetcher } from 'utils'

export function fetchWithWallet (wallet) {
  return fetcher(`https://aggregator.gamefi.org/api/v1/aggregator/liked/${wallet}`)
}

export default async function handler (req, res) {
  try {
    const { slug } = req.query
    if (!slug[0]) {
      throw new Error('Invalid wallet')
    }

    const data = await fetchWithWallet(slug[0])
    if (!data?.data) {
      throw new Error('Invalid response')
    }

    res.status(200).json({ data: data?.data })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
