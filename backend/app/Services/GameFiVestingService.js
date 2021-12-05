'use strict'

const GameFiVestingModel = use('App/Models/GameFiVestingPool');
const RedisGameFiVestingUtils = use('App/Common/RedisGameFiVestingUtils');

class GameFiVestingService {
  buildQueryBuilder(params) {
    let builder = GameFiVestingModel.query();
    if (params.wallet) {
      builder = builder.where('wallet', params.wallet)
    }

    return builder;
  }

  async getWallet(wallet) {
    try {
      if (!wallet) {
        return null
      }

      if (await RedisGameFiVestingUtils.checkExistGameFiVestingWallet(wallet)) {
        return JSON.parse(await RedisGameFiVestingUtils.getGameFiVestingWallet(wallet))
      }

      const data = await this.buildQueryBuilder({wallet: wallet}).first()
      if (!data) {
        return null
      }

      await RedisGameFiVestingUtils.setGameFiVestingWallet(wallet, data)
      return data
    } catch (e) {
      return null
    }
  }

  async insertOption(data) {
    try {
      const model = new GameFiVestingModel()
      model.fill(data)
      await model.save()

      return true
    }
    catch (e) {
      return false
    }
  }
}

module.exports = GameFiVestingService;
