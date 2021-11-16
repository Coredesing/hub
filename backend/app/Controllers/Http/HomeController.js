'use strict'

const RedisUtils = use('App/Common/RedisUtils');
const HelperUtils = use('App/Common/HelperUtils');
const SubscribeEmailService = use('App/Services/SubscribeEmailService');
const HomeService = use('App/Services/HomeService');

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
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPerformance({request}) {
    try {
      const param = request.all();
      const limit = param.limit ? param.limit : 10;
      const page = param.page ? param.page : 1;

      // TODO: pagination
      if (await RedisUtils.checkExistV1PerformanceDetail()) {
        const result = await RedisUtils.getRedisV1PerformanceDetail()
        if (result) {
          return HelperUtils.responseSuccess(JSON.parse(result))
        }
      }

      const homeService = new HomeService()
      let data = await homeService.getPerformances()
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getLegendImages({ request, auth, params }) {
    try {
      const nftId = parseInt(params.campaignId);
      const LEGEND = HelperUtils.getLegendData()

      if (!LEGEND) {
        return HelperUtils.responseErrorInternal('ERROR: Fetch API error');
      }

      const nft = LEGEND.filter(data => data.id === nftId)
      let image = 'https://gamefi-public.s3.amazonaws.com/legend-valid.png';

      if (nft.valid === false) {
        image = 'https://gamefi-public.s3.amazonaws.com/legend-expired.png'
      }

      return {
        image: image,
        external_url: image,
        description: 'GameFi NFT Legend',
        name: 'Legend',
      };
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }
  // headers: cf-connecting-ip
  // headers: x-forwarded-for
}

module.exports = HomeController
