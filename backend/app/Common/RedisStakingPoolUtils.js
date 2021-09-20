'use strict'

const Redis = use('Redis');
const HelperUtils = use('App/Common/HelperUtils');

/*
  Top events
 */
const getRedisKeyTopUsersStaking = () => {
  return `staking_events_top_users`;
};

const getRedisTopUsersStaking = async () => {
  return await Redis.get(getRedisKeyTopUsersStaking());
};

const setRedisTopUsersStaking = async (data) => {
  return await Redis.set(getRedisKeyTopUsersStaking(), JSON.stringify(data));
};

const checkExistTopUsersStaking = async () => {
  return await Redis.exists(getRedisKeyTopUsersStaking());
};

/*
  Fetch events
 */
const getStakingEventBlockNumber = () => {
  return `staking_events_block_number`;
};

const getRedisStakingLastBlockNumber = async () => {
  return await Redis.get(getStakingEventBlockNumber());
};

const setRedisStakingLastBlockNumber = async (data) => {
  return await Redis.set(getStakingEventBlockNumber(), JSON.stringify(data));
};

const checkExistStakingLastBlockNumber = async () => {
  return await Redis.exists(getStakingEventBlockNumber());
};

/*
  Staking Pools
 */
const getRedisKeyStakingPoolsDetail = () => {
  return `staking_pools_details`;
};

const getRedisStakingPoolsDetail = async () => {
  return await Redis.get(getRedisKeyStakingPoolsDetail());
};

const setRedisStakingPoolsDetail = async (data) => {
  if (!data) {
    return
  }

  const instance = await HelperUtils.getStakingPoolInstance()
  if (!instance) {
    return
  }

  data = JSON.parse(JSON.stringify(data))
  try {
    data = await Promise.all(data.map(async (item) => {
      if (item.staking_type === 'linear') {
        const scData = await instance.methods.linearPoolInfo(item.pool_id).call()
        item.cap = scData.cap
        item.minInvestment = scData.minInvestment
        item.maxInvestment = scData.maxInvestment
        item.APR = scData.APR
        item.lockDuration = scData.lockDuration
        item.delayDuration = scData.delayDuration
        item.startJoinTime = scData.startJoinTime
        item.endJoinTime = scData.endJoinTime
      }

      return item
    }))

  }catch (e) {
    return
  }

  await Redis.set(getRedisKeyStakingPoolsDetail(), JSON.stringify(data));
};

const existRedisStakingPoolsDetail = async () => {
  return await Redis.exists(getRedisKeyStakingPoolsDetail());
};

const deleteRedisStakingPoolsDetail = () => {
  let redisKey = getRedisKeyStakingPoolsDetail();
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

module.exports = {
  // top users
  getRedisTopUsersStaking,
  setRedisTopUsersStaking,
  checkExistTopUsersStaking,

  // staking block number
  getRedisStakingLastBlockNumber,
  setRedisStakingLastBlockNumber,
  checkExistStakingLastBlockNumber,

  // staking pools
  getRedisStakingPoolsDetail,
  setRedisStakingPoolsDetail,
  existRedisStakingPoolsDetail,
  deleteRedisStakingPoolsDetail,
};
