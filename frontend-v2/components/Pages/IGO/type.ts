export type Item = {
  id: number | string;
  slug?: string;
  accept_currency: string;
  network_available: string;
  mini_banner: string;
  banner: string;
  title: string;
  description: string;
  ether_conversion_rate: string;
  total_sold_coin: string;
  campaign_status: string;
  token_type: string;
  start_join_pool_time: string;
  start_pre_order_time: number | null;
  is_private: number;
  start_time: string;
  finish_time: string;
  process: string;
  website: string | null;
  socialNetworkSetting: {
    telegram_link: string | null;
    twitter_link: string | null;
    medium_link: string | null;
  };
  symbol: string;
  token_conversion_rate: string;
  campaignClaimConfig: any;
  decimals: string | number;
  campaign_hash: string | null;
  progress_display: string | number | null;
  buy_type: string;
  end_join_pool_time: string;
  min_tier: number | string;
  airdrop_network: string;
}
