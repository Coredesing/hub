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

module.exports = {
  getRedisLegendSnapshot,
  setRedisLegendSnapshot,
  existRedisLegendSnapshot,
  deleteRedisLegendSnapshot,
};
