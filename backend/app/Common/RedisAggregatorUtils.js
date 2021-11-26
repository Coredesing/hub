'use strict'

const Redis = use('Redis');

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
  const getRedisKeyAggregators = (params) => {
    return `aggregators_${params?.page}_${params?.display_area}_${params?.ido_type}`;
  };
  
  const getRedisAggregators = async (params) => {
    return await Redis.get(getRedisKeyAggregators(params));
  };
  
  const setRedisAggregators = async (params, data) => {
    return await Redis.set(getRedisKeyAggregators(params), JSON.stringify(data));
  };
  
  const checkExistRedisAggregators = async (params) => {
    return await Redis.exists(getRedisKeyAggregators(params));
  };
  
  const deleteRedisAggregators = (params) => {
    let redisKey = getRedisKeyAggregators(params);
    if (Redis.exists(redisKey)) {
      Redis.del(redisKey);
    }
  };

  const deleteAllRedisAggregators = () => {
    Redis.keys('aggregators_*').then((keys) => {
      const pipeline = Redis.pipeline()
      keys.forEach((key) => {
        console.log('del', key)
        pipeline.del(key)
      })

      return pipeline.exec()
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
