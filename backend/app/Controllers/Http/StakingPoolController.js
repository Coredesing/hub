'use strict'
const StakingPoolModel = use('App/Models/StakingPool');
const HelperUtils = use('App/Common/HelperUtils');
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
      let listData = await StakingPoolModel.query().where('is_display', 1).fetch();

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal('Get Pools Fail !!!');
    }
  }

  async getTopUserStaked({ request }) {
    try {
      // TODO: dev
      let data = {
        limit: 10,
        top: [
          {"wallet_address":"0x4731507D5aa4C9377567cb709E5A0487EcE3beC3","amount":"175000000","last_time":"1631196295"},
          {"wallet_address":"0x0c3dB0597Cc93e71696f7f52AdcB491eB546C4c6","amount":"174150002","last_time":"1631196207"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD0488d1","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD0488d2","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD0488d3","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD0488d4","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD0488d5","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD0488d6","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD0488d7","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048816","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048810","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048811","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048812","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048813","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048814","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048815","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048817","amount":"122000001","last_time":"1631201593"},
          {"wallet_address":"0x2EE206A3872b17f91071A003dA20c345bD048818","amount":"122000001","last_time":"1631201593"}
        ]
      }

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal('Get Tops Fail !!!');
    }
  }
}

module.exports = StakingPoolController
