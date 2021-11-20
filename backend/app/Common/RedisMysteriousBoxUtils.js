'use strict'

const Redis = use('Redis');

/*
  Mysterious Box
 */
const getRedisKeyMysteriousBoxes = () => {
  return `mysterious_boxes`;
};

const getRedisMysteriousBoxes = async () => {
  return await Redis.get(getRedisKeyMysteriousBoxes());
};

const setRedisMysteriousBoxes = async (data) => {
  if (!data || data.length < 1) {
    return
  }

  await Redis.set(getRedisKeyMysteriousBoxes(), JSON.stringify(data));
};

const existRedisMysteriousBoxes = async () => {
  return await Redis.exists(getRedisKeyMysteriousBoxes());
};

const deleteRedisMysteriousBoxes = () => {
  let redisKey = getRedisKeyMysteriousBoxes();
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

module.exports = {
  // mysterious boxes
  getRedisMysteriousBoxes,
  setRedisMysteriousBoxes,
  existRedisMysteriousBoxes,
  deleteRedisMysteriousBoxes,
};
