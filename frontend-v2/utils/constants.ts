export enum TOKEN_TYPE {
    ERC721 = 'erc721',
    ERC20 = 'erc20',
    Box = 'box',
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
export const RECAPTCHA_SITE_KEY_HUB = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_HUB
export const PANCAKE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_PANCAKE_GAFI_SWAP_URL
export const KUCOIN_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_KUCOIN_GAFI_SWAP_URL
export const GATE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_GATE_GAFI_SWAP_URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL + '/api/v1'
export const API_CMS_URL = process.env.NEXT_CMS_URL
export const GUILD_API_BASE_URL = process.env.NEXT_PUBLIC_GUILD_BASE_URL
export const GAME_HUB_START_TIME = process.env.NEXT_PUBLIC_GAME_HUB_START_TIME
export const GAME_HUB_GG_CALENDAR_EVENT = process.env.NEXT_PUBLIC_GAME_HUB_GG_CALENDAR_EVENT
export const INTERNAL_BASE_URL = process.env.NEXT_BASE_URL

export const CLAIM_TYPE = {
  0: 'On GameFi.org',
  1: 'Airdrop',
  2: 'External Website',
  3: 'TBA'
}

export const CMC_ASSETS_DOMAIN = 's2.coinmarketcap.com'
export const CMC_ASSETS_DOMAIN_CHART = 's3.coinmarketcap.com'
