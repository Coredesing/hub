'use strict'

const Redis = use('Redis');

/*
  Aggregators
 */
const getRedisKeyAggregatorDetail = (slug) => {
  return `aggregator_detail_${slug}`;
};

const getRedisAggregatorDetail = async (slug) => {
  return await Redis.get(getRedisKeyAggregatorDetail(slug));
};

const setRedisAggregatorDetail = async (slug, data) => {
  return await Redis.set(getRedisKeyAggregatorDetail(slug), JSON.stringify(data));
};

const checkExistRedisAggregatorDetail = async (slug) => {
  return await Redis.exists(getRedisKeyAggregatorDetail(slug));
};

const deleteRedisAggregatorDetail = (slug) => {
  let redisKey = getRedisKeyAggregatorDetail(slug);
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

module.exports = {
  getRedisAggregatorDetail,
  setRedisAggregatorDetail,
  checkExistRedisAggregatorDetail,
  deleteRedisAggregatorDetail,
};
