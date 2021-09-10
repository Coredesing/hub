'use strict'
const RateSetting = use('App/Models/RateSetting');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');

class TierSettingController {
  async getTiersSetting({ request }) {
    try {
      const tiersSetting = HelperUtils.getTiers();

      return HelperUtils.responseSuccess(tiersSetting);
    } catch (e) {
      console.error(e);
      return HelperUtils.responseErrorInternal('ERROR: Get tiers setting fail !');
    }
  }

}

module.exports = TierSettingController
