import { fetcher } from '@/utils'
import { INTERNAL_BASE_URL } from '@/utils/constants'

export function fetchOneWithSlug (slug) {
  return fetcher(`${INTERNAL_BASE_URL}/pool/${slug}`)
}

export function fetchJoined (account, page = 1, limit = 10, title = '', type = '', status = '', networks = '') {
  const url = `${INTERNAL_BASE_URL}/pools/user/${account}/joined-pools?page=${page}&limit=${limit}&title=${title}&type=${type}&status=${status}&network_available=${networks}`
  return fetcher(encodeURI(url))
}
