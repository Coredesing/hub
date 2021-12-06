'use strict'

const Redis = use('Redis');

/*
  Marketplace top collections
 */
const getRedisKeyMarketplaceTopCollections = () => {
  return `marketplace_top_collections`;
};

const getRedisMarketplaceTopCollections = async () => {
  return await Redis.get(getRedisKeyMarketplaceTopCollections());
};

const setRedisMarketplaceTopCollections = async (data) => {
  if (!data || data.length < 1) {
    return
  }

  await Redis.set(getRedisKeyMarketplaceTopCollections(), JSON.stringify(data));
};

const existRedisMarketplaceTopCollections = async () => {
  return await Redis.exists(getRedisKeyMarketplaceTopCollections());
};

const deleteRedisMarketplaceTopCollections = () => {
  let redisKey = getRedisKeyMarketplaceTopCollections();
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

/*
  Marketplace collections
 */
const getRedisKeyMarketplaceSupportCollections = () => {
  return `marketplace_support_collections`;
};

const getRedisMarketplaceSupportCollections = async () => {
  return await Redis.get(getRedisKeyMarketplaceSupportCollections());
};

const setRedisMarketplaceSupportCollections = async (data) => {
  if (!data || data.length < 1) {
    return
  }

  await Redis.set(getRedisKeyMarketplaceSupportCollections(), JSON.stringify(data));
};

const existRedisMarketplaceSupportCollections = async () => {
  return await Redis.exists(getRedisKeyMarketplaceSupportCollections());
};

const deleteRedisMarketplaceSupportCollections = () => {
  let redisKey = getRedisKeyMarketplaceSupportCollections();
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

/*
  Marketplace collection
 */
const getRedisKeyMarketplaceCollectionDetail = (id) => {
  return `marketplace_collection_detail_${id}`;
};

const getRedisMarketplaceCollectionDetail = async (id) => {
  return await Redis.get(getRedisKeyMarketplaceCollectionDetail(id));
};

const setRedisMarketplaceCollectionDetail = async (id, data) => {
  if (!id) {
    return
  }

  await Redis.set(getRedisKeyMarketplaceCollectionDetail(id), JSON.stringify(data));
};

const existRedisMarketplaceCollectionDetail = async (id) => {
  return await Redis.exists(getRedisKeyMarketplaceCollectionDetail(id));
};

const deleteRedisMarketplaceCollectionDetail = (id) => {
  let redisKey = getRedisKeyMarketplaceCollectionDetail(id);
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

/*
  Marketplace block number
 */
const getRedisKeyMarketplaceBlockNumber = () => {
  return `marketplace_block_number`;
};

const getRedisMarketplaceBlockNumber = async () => {
  return await Redis.get(getRedisKeyMarketplaceBlockNumber());
};

const setRedisMarketplaceBlockNumber = async (data) => {
  return await Redis.set(getRedisKeyMarketplaceBlockNumber(), JSON.stringify(data));
};

const existRedisMarketplaceBlockNumber = async () => {
  return await Redis.exists(getRedisKeyMarketplaceBlockNumber());
};

/*
  Marketplace slug
*/
const getRedisKeyMarketplaceSlug = (token_address) => {
  return `marketplace_slug_${token_address}`;
};

const getRedisMarketplaceSlug = async (token_address) => {
  return await Redis.get(getRedisKeyMarketplaceSlug(token_address));
};

const setRedisMarketplaceSlug = async (token_address, slug) => {
  if (!data || data.length < 1) {
    return
  }

  await Redis.set(getRedisKeyMarketplaceSlug(token_address), JSON.stringify(slug));
};

const existRedisMarketplaceSlug = async (token_address) => {
  return await Redis.exists(getRedisKeyMarketplaceSlug(token_address));
};

const deleteRedisMarketplaceSlug = (token_address) => {
  let redisKey = getRedisKeyMarketplaceSlug(token_address);
  if (Redis.exists(redisKey)) {
    Redis.del(redisKey);
  }
};

module.exports = {
  // collections
  getRedisMarketplaceTopCollections,
  setRedisMarketplaceTopCollections,
  existRedisMarketplaceTopCollections,
  deleteRedisMarketplaceTopCollections,

  getRedisMarketplaceSupportCollections,
  setRedisMarketplaceSupportCollections,
  existRedisMarketplaceSupportCollections,
  deleteRedisMarketplaceSupportCollections,

  // collection
  getRedisMarketplaceCollectionDetail,
  setRedisMarketplaceCollectionDetail,
  existRedisMarketplaceCollectionDetail,
  deleteRedisMarketplaceCollectionDetail,

  // marketplace block number
  getRedisMarketplaceBlockNumber,
  setRedisMarketplaceBlockNumber,
  existRedisMarketplaceBlockNumber,

  // marketplace slug
  getRedisKeyMarketplaceSlug,
  getRedisMarketplaceSlug,
  setRedisMarketplaceSlug,
  existRedisMarketplaceSlug,
  deleteRedisMarketplaceSlug,
};
