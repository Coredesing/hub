'use strict'

const Redis = use('Redis');

/*
  GameFi vesting
 */
const getGameFiVestingKey = (wallet) => {
  return `gamefi_vesting_wallet_${wallet}`;
};

const getGameFiVestingWallet = async (wallet) => {
  return await Redis.get(getGameFiVestingKey(wallet));
};

const setGameFiVestingWallet = async (wallet, data) => {
  return await Redis.set(getGameFiVestingKey(wallet), JSON.stringify(data));
};

const checkExistGameFiVestingWallet = async (wallet) => {
  return await Redis.exists(getGameFiVestingKey(wallet));
};

module.exports = {
  // gamefi vesting
  getGameFiVestingWallet,
  setGameFiVestingWallet,
  checkExistGameFiVestingWallet,
};
