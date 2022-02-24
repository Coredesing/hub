import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

export function fetchOneWithSlug (slug) {
  return fetcher(`${API_BASE_URL}/pool/${slug}`)
}
