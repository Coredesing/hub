'use strict'

const Redis = use('Redis');
const WINNER_POOLS_CACHED_TTL = 43200 // 12 hours

/*
  Pool winners
 */
const getRedisKeyPoolWinners = (campaign_id) => {
  return `pool_${campaign_id}_winners`;
};

const getRedisPoolWinners = async (campaign_id) => {
  return await Redis.get(getRedisKeyPoolWinners(campaign_id));
};

const setRedisPoolWinners = async (campaign_id, data) => {
  return await Redis.setex(getRedisKeyPoolWinners(campaign_id), WINNER_POOLS_CACHED_TTL, JSON.stringify(data));
};

const checkExistRedisPoolWinners = async (campaign_id) => {
  return await Redis.exists(getRedisKeyPoolWinners(campaign_id));
};

module.exports = {
  // winners
  getRedisPoolWinners,
  setRedisPoolWinners,
  checkExistRedisPoolWinners,
};
