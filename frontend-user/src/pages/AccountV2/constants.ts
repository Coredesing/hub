import { POOL_IS_PRIVATE, POOL_STATUS_JOINED } from "../../constants";

interface IMenuLeft {
    [k: string]: {
        key?: string,
        name?: string,
        icon?: string
    }
}

export const MenuLeft: IMenuLeft = {
    profile: {
        key: 'profile',
        name: 'My Profile',
        icon: '/images/account_v3/icons/icon_my_profile.svg',
    },
    tier: {
        key: 'rank',
        name: 'My Rank',
        icon: '/images/account_v3/icons/icon_my_tier.svg',
    },
    pool: {
        key: 'pool',
        name: 'My Pools',
        icon: '/images/icons/icon_my_pools.svg',
    },
    ticket: {
        key: 'ticket',
        //   name: 'NFT Tickets',
        //   icon: '/images/icons/ticket.svg',
    },
    help: {
        key: 'help',
        //   name: 'Need Help',
        //   icon: '/images/account_v3/icons/icon_need_help.svg',
    }
}

export const listStatuses = [
    { value: '', babel: 'All Statuses', color: '' },
    { value: POOL_STATUS_JOINED.APPLIED_WHITELIST, babel: 'Applied Whitelist', color: '#9E63FF' },
    { value: POOL_STATUS_JOINED.WIN_WHITELIST, babel: 'Win Whitelist', color: '#FF9330' },
    { value: POOL_STATUS_JOINED.NOT_WIN_WHITELIST, babel: 'Not Win Whitelist', color: '#7E7E7E' },
    { value: POOL_STATUS_JOINED.SWAPPING, babel: 'Swapping', color: '#6398FF' },
    { value: POOL_STATUS_JOINED.CLAIMABLE, babel: 'Claimable', color: '#FFD058' },
    { value: POOL_STATUS_JOINED.COMPLETED, babel: 'Completed', color: '#7E7E7E' },
    { value: POOL_STATUS_JOINED.CANCELED_WHITELIST, babel: 'Canceled Whitelist', color: '#D01F36' },
];

export const listTypes = [
    { value: 1000, babel: 'All types' },
    { value: POOL_IS_PRIVATE.PUBLIC, babel: 'Public' },
    { value: POOL_IS_PRIVATE.PRIVATE, babel: 'Private' },
    { value: POOL_IS_PRIVATE.SEED, babel: 'Seed' },
];