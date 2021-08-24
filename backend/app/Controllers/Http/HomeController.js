'use strict'

const RedisUtils = use('App/Common/RedisUtils');
const HelperUtils = use('App/Common/HelperUtils');

class HomeController {
  async getPerformance({request}) {
    try {
      if (await RedisUtils.checkExistPerformanceDetail()) {
        const result = await RedisUtils.getRedisPerformanceDetail()
        if (result) {
          return HelperUtils.responseSuccess(JSON.parse(result))
        }
      }

      // TODO: create table settings
      let performance = [];
      performance.push(this.createPerformance('https://redkite-public.s3.amazonaws.com/images/fara_icon.jpg',
        'Faraland', 'FARA', '$0.15', '$5.95', 30000,'$804,461.85'))
      performance.push(this.createPerformance('https://i.imgur.com/JMKjQZM.png',
        'Stephero', 'HERO', '$0.1', '$2.08', 50000,'$13,589,908.26'))
      performance.push(this.createPerformance('https://ipfs.icetea.io/gateway/ipfs/QmVgYNupb1PzyBDGrRqV2KvMjWeZd6qPAfbipgMNZ5kEPz',
        'Kaby Arena', 'KABY', '$0.005', 'N/A', 0,'N/A'))

      // Cache data
      await RedisUtils.setRedisPerformanceDetail(performance);
      return HelperUtils.responseSuccess(performance);
    } catch (e) {
      return HelperUtils.responseErrorInternal('ERROR: Get performance fail!');
    }
  }

  createPerformance(logo, name, symbol, price, ath, holders, volume) {
    return {
      logo,
      name,
      symbol,
      price,
      ath,
      holders,
      volume,
    }
  }
}

module.exports = HomeController
