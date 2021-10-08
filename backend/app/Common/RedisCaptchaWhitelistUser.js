'use strict'

const Redis = use('Redis');
const CAPTCHA_WHITELIST_TTL = 60 * 60 * 12// 12 hours

/*
  whitelist captcha
 */
const getRedisKeyCaptchaWhitelist = () => {
  return `redis_captcha_users`;
};

const getRedisWhitelistCaptcha = async () => {
  return await Redis.get(getRedisKeyCaptchaWhitelist());
};

const setRedisWhitelistCaptcha = async (data) => {
  return await Redis.setex(getRedisKeyCaptchaWhitelist(), CAPTCHA_WHITELIST_TTL, JSON.stringify(data));
};

const checkExistRedisWhitelistCaptcha = async () => {
  return await Redis.exists(getRedisKeyCaptchaWhitelist());
};

module.exports = {
  // winners
  getRedisWhitelistCaptcha,
  setRedisWhitelistCaptcha,
  checkExistRedisWhitelistCaptcha,
};
