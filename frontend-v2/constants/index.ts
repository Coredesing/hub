export const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const POOL_STATUS = {
    TBA: 0,
    UPCOMING: 1,
    JOINING: 2,
    IN_PROGRESS: 3,
    FILLED: 4,
    CLOSED: 5,
    CLAIMABLE: 6
};
export const POOL_STATUS_TEXT = {
    [POOL_STATUS.TBA]: 'TBA',
    [POOL_STATUS.UPCOMING]: 'Upcoming',
    [POOL_STATUS.FILLED]: 'Filled',
    [POOL_STATUS.IN_PROGRESS]: 'Swap',
    [POOL_STATUS.CLAIMABLE]: 'Claimable',
    [POOL_STATUS.CLOSED]: 'Ended',
};

export const POOL_TYPE = {
    PUBLIC: 0,
    PRIVATE: 1,
    SEED: 2,
    COMMUNITY: 3,
};

export const USER_STATUS = {
    UNVERIFIED: 0,
    ACTIVE: 1,
    BLOCKED: 2,
    DELETED: 3
  };

export const NETWORK = {
    ETHEREUM: 'eth',
    BSC: 'bsc',
    POLYGON: 'polygon'
};

export const ACCEPT_CURRENCY = {
    ETH: 'eth',
    USDT: 'usdt',
    USDC: 'usdc',
};

const tiers = ['Start', 'Rookie', 'Elite', 'Pro', 'Legend']

export const TIERS = [
    {
        name: tiers[0],
        icon: '/images/tiers/starster.png',
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
];

export const TIER_LEVELS = {
    NONE: 0,
    [tiers[1].toUpperCase()]: 1,
    [tiers[2].toUpperCase()]: 2,
    [tiers[3].toUpperCase()]: 3,
    [tiers[4].toUpperCase()]: 4,
};

export const TIER_NAMES = {
    0: '--',
    1: tiers[1],
    2: tiers[2],
    3: tiers[3],
    4: tiers[4],
};

export const NETWORK_AVAILABLE = {
    ETH: 'eth',
    BSC: 'bsc',
    POLYGON: 'polygon'
};

export enum TOKEN_TYPE {
    ERC721 = 'erc721',
    ERC20 = 'erc20',
    Box = 'box',
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;
export const PANCAKE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_PANCAKE_GAFI_SWAP_URL;
export const KUCOIN_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_KUCOIN_GAFI_SWAP_URL;
export const GATE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_GATE_GAFI_SWAP_URL;