function fetchData (page = 1, category = '', perPage = 12) {
  return fetch(`https://aggregator.gamefi.org/api/v1/aggregator?per_page=${perPage}&page=${page}&price=true&category=${category}`)
}

export async function fetchDataWithQueries (query) {
  const { page, category } = query
  const result = await fetchData(page, category)
  return await result.json()
}

export default async function handler (req, res) {
  try {
    const data = await fetchDataWithQueries(req.query)
    if (!data?.data) {
      throw new Error('Invalid response')
    }

    res.status(200).json({ data: data?.data })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
