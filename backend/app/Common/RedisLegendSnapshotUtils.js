'use strict'

const Redis = use('Redis');

/*
  Legend Snapshots
 */
const getRedisLegendSnapshotKey = () => {
  return `legend_snapshot_all_campaigns`;
};

const getRedisLegendSnapshot = async () => {
  return await Redis.get(getRedisLegendSnapshotKey());
};

const setRedisLegendSnapshot = async (data) => {
  if (!data || data.length < 1) {
    return
  }

  return await Redis.set(getRedisLegendSnapshotKey(), JSON.stringify(data));
};

const existRedisLegendSnapshot = async () => {
  return await Redis.exists(getRedisLegendSnapshotKey());
};

const deleteRedisLegendSnapshot = () => {
  let redisKey = getRedisLegendSnapshotKey();
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};


/*
  Legend Current Staked
 */
const getRedisLegendCurrentStakedKey = () => {
  return `legend_current_staked`;
};

const getRedisLegendCurrentStaked = async () => {
  return await Redis.get(getRedisLegendCurrentStakedKey());
};

const setRedisLegendCurrentStaked = async (data) => {
  if (!data || data.length < 1) {
    return
  }

  return await Redis.set(getRedisLegendCurrentStakedKey(), JSON.stringify(data));
};

const existRedisLegendCurrentStaked = async () => {
  return await Redis.exists(getRedisLegendCurrentStakedKey());
};

const deleteRedisLegendCurrentStaked = () => {
  let redisKey = getRedisLegendCurrentStakedKey();
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

/*
  Legend last event
 */
const getRedisLegendLastTimeKey = (wallet_address) => {
  return `legend_last_time_staked_${wallet_address}`;
};

const getRedisLegendLastTime = async (wallet_address) => {
  return await Redis.get(getRedisLegendLastTimeKey(wallet_address));
};

const setRedisLegendLastTime = async (wallet_address, time) => {
  if (!time) {
    return
  }

  return await Redis.set(getRedisLegendLastTimeKey(wallet_address), time);
};

const existRedisLegendLastTime = async (wallet_address) => {
  return await Redis.exists(getRedisLegendLastTimeKey(wallet_address));
};

module.exports = {
  getRedisLegendSnapshot,
  setRedisLegendSnapshot,
  existRedisLegendSnapshot,
  deleteRedisLegendSnapshot,

  getRedisLegendCurrentStaked,
  setRedisLegendCurrentStaked,
  existRedisLegendCurrentStaked,
  deleteRedisLegendCurrentStaked,

  getRedisLegendLastTime,
  setRedisLegendLastTime,
  existRedisLegendLastTime,
};
