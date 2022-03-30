export enum TOKEN_TYPE {
    ERC721 = 'erc721',
    ERC20 = 'erc20',
    Box = 'box',
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
export const PANCAKE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_PANCAKE_GAFI_SWAP_URL
export const KUCOIN_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_KUCOIN_GAFI_SWAP_URL
export const GATE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_GATE_GAFI_SWAP_URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const CMC_ASSETS_DOMAIN = 's2.coinmarketcap.com'
export const CMC_ASSETS_DOMAIN_CHART = 's3.coinmarketcap.com'
