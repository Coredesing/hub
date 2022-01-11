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
  start_pre_order_time: number
  is_private: number
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
