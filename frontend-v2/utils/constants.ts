export const USER_STATUS = {
  UNVERIFIED: 0,
  ACTIVE: 1,
  BLOCKED: 2,
  DELETED: 3
}

const tiers = ['Start', 'Rookie', 'Elite', 'Pro', 'Legend']

export const TIERS = [
  {
    name: tiers[0],
    icon: '/images/tiers/starster.png'
  },
  {
    name: tiers[1],
    icon: '/images/tiers/rookie.png'
  },
  {
    name: tiers[2],
    icon: '/images/tiers/elite.png'
  },
  {
    name: tiers[3],
    icon: '/images/tiers/pro.png'
  },
  {
    name: tiers[4],
    icon: '/images/tiers/master.png'
  }
]

export const TIER_LEVELS = {
  NONE: 0,
  [tiers[1].toUpperCase()]: 1,
  [tiers[2].toUpperCase()]: 2,
  [tiers[3].toUpperCase()]: 3,
  [tiers[4].toUpperCase()]: 4
}

export const TIER_NAMES = {
  0: '--',
  1: tiers[1],
  2: tiers[2],
  3: tiers[3],
  4: tiers[4]
}

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
