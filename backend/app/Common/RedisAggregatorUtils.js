'use strict'

const Redis = use('Redis');

const AGGREGATORS_CACHED_TTL = 120 // 2 minutes

/*
  Aggregator detail
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

/*
  Aggregators
 */
  const getRedisKeyAggregators = (page) => {
    return `aggregators_${page}`;
  };
  
  const getRedisAggregators = async (page) => {
    return await Redis.get(getRedisKeyAggregators(page));
  };
  
  const setRedisAggregators = async (page, data) => {
    return await Redis.setex(getRedisKeyAggregators(page),AGGREGATORS_CACHED_TTL, JSON.stringify(data));
  };
  
  const checkExistRedisAggregators = async (page) => {
    return await Redis.exists(getRedisKeyAggregators(page));
  };
  
  const deleteRedisAggregators = (page) => {
    let redisKey = getRedisKeyAggregators(page);
    if (Redis.exists(redisKey)) {
      Redis.del(redisKey);
    }
  };

  const deleteAllRedisAggregators = (pages = []) => {
    pages.forEach(page => {
      deleteRedisAggregators(page)
    })
  };

module.exports = {
  // Aggregator detail
  getRedisAggregatorDetail,
  setRedisAggregatorDetail,
  checkExistRedisAggregatorDetail,
  deleteRedisAggregatorDetail,


  // Aggregators
  getRedisAggregators,
  setRedisAggregators,
  checkExistRedisAggregators,
  deleteRedisAggregators,
  deleteAllRedisAggregators,
};
