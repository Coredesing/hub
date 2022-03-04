import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

export function fetchOneWithSlug (slug) {
  return fetcher(`${API_BASE_URL}/pool/${slug}`)
}

export function fetchJoined (account, page = 1, limit = 10, title = '', type = '', status = '') {
  const url = `${API_BASE_URL}/pools/user/${account}/joined-pools?page=${page}&limit=${limit}&title=${title}&type=${type}&status=${status}`
  return fetcher(encodeURI(url))
}
