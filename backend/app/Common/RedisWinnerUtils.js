'use strict'

const Redis = use('Redis');

/*
  Pool winners
 */
const getRedisKeyPoolWinners = (campaign_id, page) => {
  return `pool_${campaign_id}_winners_${page}`;
};

const getRedisPoolWinners = async (campaign_id, page) => {
  return await Redis.get(getRedisKeyPoolWinners(campaign_id, page));
};

const setRedisPoolWinners = async (campaign_id, page, data) => {
  return await Redis.set(getRedisKeyPoolWinners(campaign_id, page), JSON.stringify(data));
};

const checkExistRedisPoolWinners = async (campaign_id, page) => {
  return await Redis.exists(getRedisKeyPoolWinners(campaign_id, page));
};

module.exports = {
  // winners
  getRedisPoolWinners,
  setRedisPoolWinners,
  checkExistRedisPoolWinners,
};
