'use strict'

const Redis = use('Redis');

/*
  LFW block number
 */
const getLFWBlockNumber = () => {
  return `nft_lfw_block_number`;
};

const getRedisLFWBlockNumber = async () => {
  return await Redis.get(getLFWBlockNumber());
};

const setRedisLFWBlockNumber = async (data) => {
  return await Redis.set(getLFWBlockNumber(), JSON.stringify(data));
};

const existRedisLFWBlockNumber = async () => {
  return await Redis.exists(getLFWBlockNumber());
};

module.exports = {
  getRedisLFWBlockNumber,
  setRedisLFWBlockNumber,
  existRedisLFWBlockNumber
};
