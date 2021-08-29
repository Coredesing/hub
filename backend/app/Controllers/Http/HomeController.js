'use strict'

const RedisUtils = use('App/Common/RedisUtils');
const HelperUtils = use('App/Common/HelperUtils');
const SubscribeEmailService = use('App/Services/SubscribeEmailService');

class HomeController {
  async subscribe({request}) {
    try {
      const param = request.all()
      const email = param.email
      if (!email) {
        return HelperUtils.responseBadRequest("Email is invalid");
      }

      const subscribeService = new SubscribeEmailService();
      const data = await subscribeService.createRecord(email)
      if (!data) {
        return HelperUtils.responseErrorInternal('Subscribe email error');
      }

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal('Subscribe email error');
    }
  }

  async getPerformance({request}) {
    try {
      // if (await RedisUtils.checkExistPerformanceDetail()) {
      //   const result = await RedisUtils.getRedisPerformanceDetail()
      //   if (result) {
      //     return HelperUtils.responseSuccess(JSON.parse(result))
      //   }
      // }

      // TODO: create table settings
      let performance = [];
      performance.push(this.createPerformance('https://ipfs.icetea.io/gateway/ipfs/QmVgYNupb1PzyBDGrRqV2KvMjWeZd6qPAfbipgMNZ5kEPz',
        'Kaby Arena', 'KABY', '$0.007', 'N/A', 0,'N/A'))
      performance.push(this.createPerformance('https://redkite-public.s3.amazonaws.com/images/Mechmaster.png',
        'Mech Master', 'MECH', 'N/A', 'N/A', 0,'N/A'))

      // Cache data
      // await RedisUtils.setRedisPerformanceDetail(performance);
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
