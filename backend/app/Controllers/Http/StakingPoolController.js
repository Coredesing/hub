'use strict'
const StakingPoolModel = use('App/Models/StakingPool');
const HelperUtils = use('App/Common/HelperUtils');
const RedisStakingPoolUtils = use('App/Common/RedisStakingPoolUtils')
const Const = use('App/Common/Const');
const Web3 = require('web3');

class StakingPoolController {
  async createPool({ request, auth }) {
    const inputParams = request.only([
      'pool_address', 'network_available', 'pool_id', 'title', 'staking_type', 'website', 'logo', 'rkp_rate', 'accepted_token_price', 'reward_token_price'
    ]);

    if (!inputParams.pool_address || !Web3.utils.isAddress(inputParams.pool_address)) {
      return HelperUtils.responseNotFound('Invalid pool address');
    }

    const data = {
      pool_address: inputParams.pool_address,
      network_available: inputParams.network_available,
      pool_id: inputParams.pool_id,
      title: inputParams.title,
      staking_type: inputParams.staking_type,
      logo: inputParams.logo,
      website: inputParams.website,
      rkp_rate: inputParams.rkp_rate,
      accepted_token_price: inputParams.accepted_token_price,
      reward_token_price: inputParams.reward_token_price,
    };

    try {
      const stakingPool = new StakingPoolModel();
      stakingPool.fill(data);
      await stakingPool.save();

      // Sync token price with other pools
      await StakingPoolModel.query().where('pool_address', data.pool_address).andWhere('staking_type', Const.STAKING_POOL_TYPE.LINEAR).update({
        accepted_token_price: data.reward_token_price,
        reward_token_price: data.reward_token_price,
      });

      await StakingPoolModel.query().where('pool_address', data.pool_address).andWhere('staking_type', Const.STAKING_POOL_TYPE.ALLOC).update({
        reward_token_price: data.reward_token_price,
      });

      await RedisStakingPoolUtils.deleteRedisStakingPoolsDetail()
      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async updatePool({ request, auth, params }) {
    const inputParams = request.only([
      'pool_address', 'network_available', 'title', 'staking_type', 'website', 'logo', 'rkp_rate', 'accepted_token_price', 'reward_token_price'
    ]);

    let data = {
      title: inputParams.title,
      staking_type: inputParams.staking_type,
      logo: inputParams.logo,
      website: inputParams.website,
      rkp_rate: inputParams.rkp_rate,
      accepted_token_price: inputParams.accepted_token_price,
      reward_token_price: inputParams.reward_token_price,
    };

    const poolId = params.stakingPoolId;
    try {
      const stakingPool = await StakingPoolModel.query().where('id', poolId).first();
      if (!stakingPool) {
        return HelperUtils.responseNotFound('Staking pool not found');
      }

      if (!stakingPool.pool_address) {
        data.pool_address = inputParams.pool_address;
      }
      if (!stakingPool.network_available) {
        data.network_available = inputParams.network_available;
      }
      await StakingPoolModel.query().where('id', poolId).update(data);

      // Sync token price with other pools
      await StakingPoolModel.query().where('pool_address', stakingPool.pool_address).andWhere('staking_type', Const.STAKING_POOL_TYPE.LINEAR).update({
        accepted_token_price: data.reward_token_price,
        reward_token_price: data.reward_token_price,
      });

      await StakingPoolModel.query().where('pool_address', stakingPool.pool_address).andWhere('staking_type', Const.STAKING_POOL_TYPE.ALLOC).update({
        reward_token_price: data.reward_token_price,
      });

      await RedisStakingPoolUtils.deleteRedisStakingPoolsDetail()
      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async changeDisplay({ request, auth, params }) {
    const inputParams = request.only([
      'is_display'
    ]);

    console.log('Update Change Display with data: ', inputParams);
    const poolId = params.stakingPoolId;
    try {
      const stakingPool = await StakingPoolModel.query().where('id', poolId).first();
      if (!stakingPool) {
        return HelperUtils.responseNotFound('Staking pool not found');
      }
      await StakingPoolModel.query().where('id', poolId).update({
        is_display: inputParams.is_display,
      });

      await RedisStakingPoolUtils.deleteRedisStakingPoolsDetail()
      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPool({ request, auth, params }) {
    const poolId = params.stakingPoolId;
    try {
      let pool = await StakingPoolModel.query().where('id', poolId).first();
      if (!pool) {
        return HelperUtils.responseNotFound('Staking pool not found');
      }

      return HelperUtils.responseSuccess(pool);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPoolList({ request }) {
    try {
      let listData = await StakingPoolModel.query().orderBy('id', 'DESC').fetch();

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal('Get Pools Fail !!!');
    }
  }

  async getPublicPoolList({ request }) {
    try {
      if (await RedisStakingPoolUtils.existRedisStakingPoolsDetail()) {
        return HelperUtils.responseSuccess(JSON.parse(await RedisStakingPoolUtils.getRedisStakingPoolsDetail()))
      }

      let listData = await StakingPoolModel.query().where('is_display', 1).fetch();
      listData = await HelperUtils.getStakingPoolsDetail(listData)
      await RedisStakingPoolUtils.setRedisStakingPoolsDetail(listData)
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      return HelperUtils.responseErrorInternal('Internal server error');
    }
  }

  async getTopUserStaked({ request }) {
    try {
      if (process.env.EVENT_DISABLE === 'true') {
        return HelperUtils.responseSuccess({
          start_time: process.env.EVENT_START_TIME,
          end_time: process.env.EVENT_END_TIME,
          limit: process.env.EVENT_LIMIT,
          top: [],
          disable: true,
        });
      }

      if (!await RedisStakingPoolUtils.checkExistTopUsersStaking()) {
        return HelperUtils.responseSuccess({
          start_time: process.env.EVENT_START_TIME,
          end_time: process.env.EVENT_END_TIME,
          limit: process.env.EVENT_LIMIT,
          top: [],
          disable: false,
        });
      }

      let data = await RedisStakingPoolUtils.getRedisTopUsersStaking()
      data = JSON.parse(data)
      data.disable = false

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal('Get Tops Fail !!!');
    }
  }
}

module.exports = StakingPoolController
