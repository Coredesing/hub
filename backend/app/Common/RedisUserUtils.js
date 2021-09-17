'use strict'

const Redis = use('Redis');
const USER_PROFILE_CACHED_TTL = 60 * 60; // 1 hour

/*
  User Account
 */
const getRedisUserProfileKey = (wallet_address) => {
  return `user_profile_${wallet_address}`;
};

const getRedisUserProfile = async (wallet_address) => {
  return await Redis.get(getRedisUserProfileKey(wallet_address));
};

const setRedisUserProfile = async (wallet_address, data) => {
  if (!data || !wallet_address) {
    return
  }

  return await Redis.setex(getRedisUserProfileKey(wallet_address), USER_PROFILE_CACHED_TTL, JSON.stringify(data));
};

const existRedisUserProfile = async (wallet_address) => {
  return await Redis.exists(getRedisUserProfileKey(wallet_address));
};

const deleteRedisUserProfile = (wallet_address) => {
  let redisKey = getRedisUserProfileKey(wallet_address);
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

module.exports = {
  // user profile
  getRedisUserProfile,
  setRedisUserProfile,
  existRedisUserProfile,
  deleteRedisUserProfile,
};
