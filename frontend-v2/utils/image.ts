import { API_CMS_URL } from './constants'

export const checkPathImage = (path) => {
  if (!path) return null
  try {
    // eslint-disable-next-line no-new
    new URL(path)
    return path
  } catch (e) {
    return `${API_CMS_URL}${path}`
  }
}
