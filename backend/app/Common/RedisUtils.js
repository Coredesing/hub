'use strict'

const Redis = use('Redis');
const ENABLE_REDIS = true;
const TIER_CACHED_TTL = 10 * 60; // 10 minutes'
const UPCOMING_POOLS_CACHED_TTL = 120 // 2 minutes
const CURRENT_POOLS_CACHED_TTL = 120 // 2 minutes
const POOL_BY_TOKEN_TYPEP_CACHED_TTL = 120 // 2 minutes
const COMPLETED_POOLS_CACHED_TTL = 120 // 2 minutes
const LATEST_POOLS_CACHED_TTL = 600 // 10 minutes
const TOTAL_COMPLETED_TTL = 12 * 60 * 60; // 12 hours

const LATEST_POOL_KEY = 'latest_pools';

const logRedisUtil = (message) => {
  console.log(`[RedisUtils] - ${message}`);
};

/**
 * POOL DETAIL
 */
const getRedisKeyPoolDetail = (poolId) => {
  return `public_pool_detail_${poolId}`;
};

const getRedisPoolDetail = async (poolId) => {
  return await Redis.get(getRedisKeyPoolDetail(poolId));
};

const checkExistRedisPoolDetail = async (poolId) => {
  let redisKey = getRedisKeyPoolDetail(poolId);
  logRedisUtil(`checkExistRedisPoolDetail - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    return true;
  }
  return false;
};

const createRedisPoolDetail = async (poolId, data) => {
  const redisKey = getRedisKeyPoolDetail(poolId);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const deleteRedisPoolDetail = (poolId) => {
  let redisKey = getRedisKeyPoolDetail(poolId);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisPoolDetail - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }

  return false;
};

/**
 * POOL LIST
 */
const getRedisKeyPoolList = ({
  page = 1, limit = 10, title = 'title',
  start_time = 'start_time', finish_time = 'finish_time',
  registed_by = 'registed_by', is_display,
}) => {
  if (is_display === undefined) is_display = 'both';
  return `public_pool_list_${page}_${limit}_${title}_${start_time}_${finish_time}_${registed_by}_${is_display}`;
};

const getRedisPoolList = async (params) => {
  return await Redis.get(getRedisKeyPoolList(params));
};

const checkExistRedisPoolList = async (params) => {
  let redisKey = getRedisKeyPoolList(params);
  logRedisUtil(`checkExistRedisPoolList - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisPoolList - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisPoolList - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisPoolList = async (params, data) => {
  const redisKey = getRedisKeyPoolList(params);
  logRedisUtil(`createRedisPoolList - Create Cache data with key: ${redisKey}`);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const deleteRedisPoolList = (params) => {
  let redisKey = getRedisKeyPoolList(params);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisPoolList - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisPoolList - not exist key ${redisKey}`);
  return false;
};

/**
 * UPCOMING COMMUNITY & IGO POOLS
 */
 const getRedisKeyUpcomingPools = (page = 1, type, token_type) => {
  let poolType = type;
  if (type === undefined || type === null) {
    poolType = 'all'
  }

  // Change to support filter by multiple value
  // if (type === 0 || type === '0') {
  //   poolType = 'igo'
  // }
  //
  // if (type === 1 || type === '1') {
  //   poolType = 'private'
  // }
  //
  // if (type === 2 || type === '2') {
  //   poolType = 'seed'
  // }
  //
  // if (type === 3 || type === '3') {
  //   poolType = 'community'
  // }

  return `upcoming_pools_${poolType}_${page}_${token_type}`;
};

const getRedisUpcomingPools = async (page, type, token_type) => {
  return await Redis.get(getRedisKeyUpcomingPools(page, type, token_type));
};

const checkExistRedisUpcomingPools = async (page, type, token_type) => {
  let redisKey = getRedisKeyUpcomingPools(page, type, token_type);
  const isExistRedisData = await Redis.exists(redisKey, type);
  if (isExistRedisData) {
    return true;
  }
  return false;
};

const createRedisUpcomingPools = async (page, type, token_type, data) => {
  const redisKey = getRedisKeyUpcomingPools(page, type, token_type);
  return await Redis.setex(redisKey, UPCOMING_POOLS_CACHED_TTL, JSON.stringify(data));
};

const deleteRedisUpcomingPools = (page, type, token_type) => {
  let redisKey = getRedisKeyUpcomingPools(page, type, token_type);
  if (Redis.exists(redisKey)) {
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  return false;
};

const deleteAllRedisUpcomingPools = (pages = []) => {
  pages.forEach(page => {
    deleteRedisUpcomingPools(page, null)
    deleteRedisUpcomingPools(page, 0)
    deleteRedisUpcomingPools(page, 1)
    deleteRedisUpcomingPools(page, 2)
    deleteRedisUpcomingPools(page, 3)
  })
};

/**
 * LATEST POOLS
 */
const getRedisKeyLatestPools = (limit, token_type) => {
  return `${LATEST_POOL_KEY}_${limit}_${token_type}`;
}

const getRedisLatestPools = async (limit, token_type) => {
  const redisKey = getRedisKeyLatestPools(limit, token_type);
  return await Redis.get(redisKey);
}

const createRedisLatestPools = async (limit, token_type, data) => {
  const redisKey = getRedisKeyLatestPools(limit, token_type);
  return await Redis.setex(redisKey, LATEST_POOLS_CACHED_TTL, JSON.stringify(data));
}

const checkExistRedisLatestPools = async (limit, token_type) => {
  const redisKey = getRedisKeyLatestPools(limit, token_type);
  return Redis.exists(redisKey);
}

/**
 * CURRENT POOLS
 */

 const getRedisKeyCurrentPools = (page = 1, type, token_type) => {
  let poolType = type;
  if (type === undefined || type === null) {
    poolType = 'all'
  }

  return `current_pools_${poolType}_${page}_${token_type}`;
};

const getRedisCurrentPools = async (page, type, token_type) => {
  return await Redis.get(getRedisKeyCurrentPools(page, type, token_type));
};

const checkExistRedisCurrentPools = async (page, type, token_type) => {
  let redisKey = getRedisKeyCurrentPools(page, type, token_type);
  const isExistRedisData = await Redis.exists(redisKey, type);
  if (isExistRedisData) {
    return true;
  }
  return false;
};

const createRedisCurrentPools = async (page, type, token_type, data) => {
  const redisKey = getRedisKeyCurrentPools(page, type, token_type);
  return await Redis.setex(redisKey, CURRENT_POOLS_CACHED_TTL, JSON.stringify(data));
};

const deleteRedisCurrentPools = (page, type, token_type) => {
  let redisKey = getRedisKeyCurrentPools(page, type, token_type);
  if (Redis.exists(redisKey)) {
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  return false;
};

const deleteAllRedisCurrentPools = (pages = []) => {
  pages.forEach(page => {
    deleteRedisCurrentPools(page, null)
    deleteRedisCurrentPools(page, 0)
    deleteRedisCurrentPools(page, 1)
    deleteRedisCurrentPools(page, 2)
    deleteRedisCurrentPools(page, 3)
  })
};

/**
 * COMPLETED POOLS
 */
 const getRedisKeyCompletedPools = (page = 1) => {
  return `v2_completed_pools_${page}`;
};

const getRedisCompletedPools = async (page) => {
  return await Redis.get(getRedisKeyCompletedPools(page));
};

const checkExistRedisCompletedPools = async (page) => {
  let redisKey = getRedisKeyCompletedPools(page);
  logRedisUtil(`checkExistRedisCompletedPools - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisCompletedPools - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisCompletedPools - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisCompletedPools = async (page, data) => {
  const redisKey = getRedisKeyCompletedPools(page);
  logRedisUtil(`createRedisCompletedPools - Create Cache data with key: ${redisKey}`);
  return await Redis.setex(redisKey, COMPLETED_POOLS_CACHED_TTL, JSON.stringify(data));
};

const deleteRedisCompletedPools = (page) => {
  let redisKey = getRedisKeyCompletedPools(page);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisCompletedPools - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisCompletedPools - not exist key ${redisKey}`);
  return false;
};

const deleteAllRedisCompletedPools = (pages = []) => {
  pages.forEach(page => {
    deleteRedisCompletedPools(page)
  })
};

/**
 * List Pool By Token Type
 */
 const getRedisKeyPoolByTokenType = (page = 1) => {
  return `pool_by_token_type_${page}`;
};

const getRedisPoolByTokenType = async (page) => {
  return await Redis.get(getRedisKeyPoolByTokenType(page));
};

const checkExistRedisPoolByTokenType = async (page) => {
  let redisKey = getRedisKeyPoolByTokenType(page);
  logRedisUtil(`checkExistRedisPoolByTokenType - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisPoolByTokenType - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisPoolByTokenType - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisPoolByTokenType = async (page, data) => {
  const redisKey = getRedisKeyPoolByTokenType(page);
  logRedisUtil(`createRedisPoolByTokenType - Create Cache data with key: ${redisKey}`);
  return await Redis.setex(redisKey, POOL_BY_TOKEN_TYPEP_CACHED_TTL, JSON.stringify(data));
};

const deleteRedisPoolByTokenType = (page) => {
  let redisKey = getRedisKeyPoolByTokenType(page);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisPoolByTokenType - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisPoolByTokenType - not exist key ${redisKey}`);
  return false;
};

const deleteAllRedisPoolByTokenType = (pages = []) => {
  pages.forEach(page => {
    deleteRedisPoolByTokenType(page)
  })
};

/**
 * TIER LIST
 */
const getRedisKeyTierList = (poolId) => {
  return `tiers_list_${poolId}`;
};

const getRedisTierList = async (poolId) => {
  return await Redis.get(getRedisKeyTierList(poolId));
};

const checkExistRedisTierList = async (poolId) => {
  let redisKey = getRedisKeyTierList(poolId);
  logRedisUtil(`checkExistRedisTierList - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisTierList - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisTierList - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisTierList = async (poolId, data) => {
  const redisKey = getRedisKeyTierList(poolId);
  logRedisUtil(`createRedisTierList - Create Cache data with key: ${redisKey}`);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const deleteRedisTierList = (poolId) => {
  let redisKey = getRedisKeyTierList(poolId);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisTierList - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisTierList - not exist key ${redisKey}`);
  return false;
};


/**
 * RATE SETTING
 */
const getRedisKeyRateSetting = () => {
  return `rate_setting`;
};

const getRedisRateSetting = async () => {
  return await Redis.get(getRedisKeyRateSetting());
};

const checkExistRedisRateSetting = async () => {
  let redisKey = getRedisKeyRateSetting();
  logRedisUtil(`checkExistRedisRateSetting - redisKey: ${redisKey}`);

  const isExistRedisData = await Redis.exists(redisKey);
  if (isExistRedisData) {
    logRedisUtil(`checkExistRedisRateSetting - Exist Redis cache with key: ${redisKey}`);
    return true;
  }
  logRedisUtil(`checkExistRedisRateSetting - Not exist Redis cache with key: ${redisKey}`);
  return false;
};

const createRedisRateSetting = async (data) => {
  const redisKey = getRedisKeyRateSetting();
  logRedisUtil(`createRedisRateSetting - Create Cache data with key: ${redisKey}`);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const deleteRedisRateSetting = () => {
  let redisKey = getRedisKeyRateSetting();
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisRateSetting - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }
  logRedisUtil(`deleteRedisRateSetting - not exist key ${redisKey}`);
  return false;
};

/*
  Home setting
 */
const getRedisPerformanceSetting = () => {
  return `home_full_performances`;
};

const getRedisPerformanceDetail = async () => {
  return await Redis.get(getRedisPerformanceSetting());
};

const getRedisV1PerformanceDetail = async () => {
  return await Redis.get('home_performance');
};

const checkExistV1PerformanceDetail = async () => {
  return await Redis.exists('home_performance');
};

const checkExistPerformanceDetail = async () => {
  return await Redis.exists(getRedisPerformanceSetting());
};

const setRedisPerformanceDetail = async(data) => {
  return await Redis.set(getRedisPerformanceSetting(), JSON.stringify(data));
}

/*
  Top Bid
 */
const getRedisKeyTopBid = (poolId) => {
  return `top_bid_${poolId}`;
};

const getRedisTopBid = async (poolId) => {
  return await Redis.get(getRedisKeyTopBid(poolId));
};

const setRedisTopBid = async (poolId, data) => {
  const redisKey = getRedisKeyTopBid(poolId);
  return await Redis.set(redisKey, JSON.stringify(data));
};

const checkExistTopBid = async (poolId) => {
  return await Redis.exists(getRedisKeyTopBid(poolId));
};

/**
 * User Tier
 */
const getRedisKeyUserTierBalance = (walletAddress) => {
  return `user_tier_balance_${walletAddress}`;
};

const getRedisUserTierBalance = async (walletAddress) => {
  return await Redis.get(getRedisKeyUserTierBalance(walletAddress));
};

const checkExistRedisUserTierBalance = async (walletAddress) => {
  let redisKey = getRedisKeyUserTierBalance(walletAddress);

  if (!ENABLE_REDIS) {
    return false;
  }

  return await Redis.exists(redisKey)
};

const createRedisUserTierBalance = async (walletAddress, data) => {
  const redisKey = getRedisKeyUserTierBalance(walletAddress);

  if (!ENABLE_REDIS) {
    return false;
  }

  return await Redis.setex(redisKey, TIER_CACHED_TTL, JSON.stringify(data));
};

const deleteRedisUserTierBalance = (walletAddress) => {
  let redisKey = getRedisKeyUserTierBalance(walletAddress);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisUserTierBalance - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }

  return false;
};

/**
 * Total Completed Pools
 */
 const getRedisTotalCompletedKey = () => {
  return `total_completed`;
};

const getRedisTotalCompleted = async (walletAddress) => {
  return await Redis.get(getRedisTotalCompletedKey(walletAddress));
};

const checkExistRedisTotalCompleted = async (walletAddress) => {
  let redisKey = getRedisTotalCompletedKey(walletAddress);

  if (!ENABLE_REDIS) {
    return false;
  }

  return await Redis.exists(redisKey)
};

const createRedisTotalCompleted = async (data) => {
  const redisKey = getRedisTotalCompletedKey();

  if (!ENABLE_REDIS) {
    return false;
  }

  return await Redis.setex(redisKey, TIER_CACHED_TTL, JSON.stringify(data));
};

const deleteRedisTotalCompleted = (walletAddress) => {
  let redisKey = getRedisKeyUserTierBalance(walletAddress);
  if (Redis.exists(redisKey)) {
    logRedisUtil(`deleteRedisUserTierBalance - existed key ${redisKey} on redis`);
    // remove old key
    Redis.del(redisKey);
    return true;
  }

  return false;
};

module.exports = {
  // POOL LIST
  checkExistRedisPoolList,
  getRedisKeyPoolList,
  getRedisPoolList,
  createRedisPoolList,
  deleteRedisPoolList,

  // UPCOMING POOLS
  checkExistRedisUpcomingPools,
  getRedisKeyUpcomingPools,
  getRedisUpcomingPools,
  createRedisUpcomingPools,
  deleteRedisUpcomingPools,
  deleteAllRedisUpcomingPools,

  // CURRENT POOLS
  checkExistRedisCurrentPools,
  getRedisKeyCurrentPools,
  getRedisCurrentPools,
  createRedisCurrentPools,
  deleteRedisCurrentPools,
  deleteAllRedisCurrentPools,

  // LATEST POOLS
  checkExistRedisLatestPools,
  getRedisLatestPools,
  createRedisLatestPools,


  // LIST POOL BY TOKEN TYPE
  checkExistRedisPoolByTokenType,
  getRedisKeyPoolByTokenType,
  getRedisPoolByTokenType,
  createRedisPoolByTokenType,
  deleteRedisPoolByTokenType,
  deleteAllRedisPoolByTokenType,

  // COMPLETED POOL
  checkExistRedisCompletedPools,
  getRedisKeyCompletedPools,
  getRedisCompletedPools,
  createRedisCompletedPools,
  deleteRedisCompletedPools,
  deleteAllRedisCompletedPools,

  // POOL DETAIL
  checkExistRedisPoolDetail,
  getRedisKeyPoolDetail,
  getRedisPoolDetail,
  createRedisPoolDetail,
  deleteRedisPoolDetail,

  // TIER LIST
  checkExistRedisTierList,
  getRedisKeyTierList,
  getRedisTierList,
  createRedisTierList,
  deleteRedisTierList,

  // RATE SETTING
  checkExistRedisRateSetting,
  getRedisKeyRateSetting,
  getRedisRateSetting,
  createRedisRateSetting,
  deleteRedisRateSetting,

  // Home Setting
  checkExistPerformanceDetail,
  getRedisPerformanceDetail,
  getRedisV1PerformanceDetail,
  checkExistV1PerformanceDetail,
  setRedisPerformanceDetail,

  // Top Bid
  getRedisTopBid,
  setRedisTopBid,
  checkExistTopBid,

  // user tiers
  getRedisUserTierBalance,
  checkExistRedisUserTierBalance,
  createRedisUserTierBalance,
  deleteRedisUserTierBalance,

  // total completed pools
  getRedisTotalCompleted,
  checkExistRedisTotalCompleted,
  createRedisTotalCompleted,
  deleteRedisTotalCompleted
};
