'use strict'

const RedisUtils = use('App/Common/RedisUtils');
const HelperUtils = use('App/Common/HelperUtils');
const SubscribeEmailService = use('App/Services/SubscribeEmailService');
const PerformanceService = use('App/Services/PerformanceService');

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
      if (await RedisUtils.checkExistPerformanceDetail()) {
        const result = await RedisUtils.getRedisPerformanceDetail()
        if (result) {
          return HelperUtils.responseSuccess(JSON.parse(result))
        }
      }

      const performanceService = new PerformanceService();
      let data = await performanceService.findAll({})
      data = JSON.parse(JSON.stringify(data))
      // Cache data
      await RedisUtils.setRedisPerformanceDetail(data);

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal('ERROR: Get performance fail!');
    }
  }
}

module.exports = HomeController
