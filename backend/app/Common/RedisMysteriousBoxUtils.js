'use strict'

const Redis = use('Redis');
const MYSTERIOUS_BOXES_TTL = 60 * 60 * 1000   //1hrs

/*
  Mysterious Box
 */
const getRedisKeyMysteriousBoxes = (filterParams) => {
  return `mysterious_boxes_${
      filterParams.limit
    }_${
      filterParams.page
    }_${
      filterParams.campaign_status
    }_${
      filterParams.token_type
    }_${
      filterParams.process
    }_${
      filterParams.network_available
    }_${
      filterParams.is_featured
    }_${
      filterParams.start_time
    }_${
      filterParams.finish_time
    }`
};

const getRedisMysteriousBoxes = async (filterParams) => {
  return await Redis.get(getRedisKeyMysteriousBoxes(filterParams));
};

const setRedisMysteriousBoxes = async (filterParams, data) => {
  if (!data) {
    return
  }

  await Redis.setex(getRedisKeyMysteriousBoxes(filterParams), MYSTERIOUS_BOXES_TTL, JSON.stringify(data));
};

const existRedisMysteriousBoxes = async (filterParams) => {
  return await Redis.exists(getRedisKeyMysteriousBoxes(filterParams));
};

const deleteRedisMysteriousBoxes = (filterParams) => {
  let redisKey = getRedisKeyMysteriousBoxes(filterParams);
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

const deleteAllRedisMysteriousBoxes = () => {
  Redis.keys('mysterious_boxes_*').then((keys) => {
    const pipeline = Redis.pipeline()
    keys.forEach((key) => {
      pipeline.del(key)
    })

    return pipeline.exec()
  })
}

module.exports = {
  // mysterious boxes
  getRedisMysteriousBoxes,
  setRedisMysteriousBoxes,
  existRedisMysteriousBoxes,
  deleteRedisMysteriousBoxes,
  deleteAllRedisMysteriousBoxes
};
