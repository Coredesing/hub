export default function handler (req, res) {
  if (req?.method === 'POST') {
    res.status(403)
  }

  if (req?.method === 'GET') {
    res.status(403)
  }
}
