const BASE_URL = process.env.VUE_APP_BASE_API_URL

export const SIGNATURE_MESSAGE = process.env.VUE_APP_SIGNATURE_MESSAGE

export const URL = {
  DISPLAY: `${BASE_URL}aggregator?display_area=`,
  CATEGORY: `${BASE_URL}aggregator?category=`,
  LATEST: `${BASE_URL}aggregator?price=true`,
  DETAIL: `${BASE_URL}aggregator/`,
  INFO: `${BASE_URL}project-info/`,
  TOKENOMIC: `${BASE_URL}tokenomics/`,
  LIKE: `${BASE_URL}aggregator/like/`,
  GET_LIKE: `${BASE_URL}aggregator/get-like?ids=`,
  USER_LIKE: `${BASE_URL}aggregator/liked/`,
  UPCOMING: `${BASE_URL}aggregator?ido_type=upcoming`
}