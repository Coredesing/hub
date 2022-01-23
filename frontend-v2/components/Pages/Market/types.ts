export type Item = {
  id: any,
  created_at: string,
  updated_at: string,
  transaction_hash: string,
  transaction_index: any,
  block_number: string,
  dispatch_at: string,
  event_type: string,
  token_address: string,
  buyer: string,
  seller: string,
  currency: string,
  token_id: any,
  raw_amount: string,
  amount: string,
  value: string,
  network: string,
  finish: number,
  slug: string,
  highest_offer: string
}

export type Collection = {
  id: any,
  name: string,
  logo: string,
  banner: string
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
