export type Item = {
  id: string
  accept_currency: string
  network_available: string
  mini_banner: string
  banner: string
  title: string
  description: string
  ether_conversion_rate: string
  total_sold_coin: string
  campaign_status: string
  token_type: string
  start_join_pool_time: string
  start_pre_order_time: number | null
  is_private: number
  start_time: string
  finish_time: string
  process: string
  website: string | null
  telegram_link: string | null
  twitter_link: string | null
  medium_link: string | null
}

export type Pagination = {
  lastPage: number,
  page: number,
  perPage: number,
  total: number
}

export interface PaginationResult extends Pagination {
  data: Item[],
}
