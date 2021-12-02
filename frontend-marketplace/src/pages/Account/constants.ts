import { POOL_IS_PRIVATE, POOL_STATUS_JOINED } from "../../constants";

interface IMenuLeft {
    [k: string]: {
        key?: string,
        name?: string,
        icon?: string
    }
}

export const MenuLeft: IMenuLeft = {
    assets: {
        key: 'assets',
        name: 'Assets',
        icon: '/images/icons/dollar.svg',
    },
    listings: {
        key: 'listings',
        name: 'Listings',
        icon: '/images/icons/volume-level.svg',
    },
    offers: {
        key: 'offers',
        name: 'Offers',
        icon: '/images/icons/start.svg',
    },
    // favorites: {
    //     key: 'favorites',
    //     name: 'Favorites',
    //     icon: '/images/icons/heart.svg',
    // },
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