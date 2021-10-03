'use strict'

const NFTOrderService = use('App/Services/NFTOrderService');
const PoolService = use('App/Services/PoolService');
const HelperUtils = use('App/Common/HelperUtils');
const UserService = use('App/Services/UserService');

class NFTOrderController {
  async order({request}) {
    const param = request.all()
    const campaign_id = param.campaign_id
    const amount = isNaN(param.amount) ? -1 : parseInt(param.amount)
    const wallet_address = param.wallet_address

    if (amount < 1) {
      return HelperUtils.responseBadRequest('Invalid amount');
    }

    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Invalid campaign');
    }

    if (!wallet_address) {
      return HelperUtils.responseBadRequest('Invalid wallet');
    }

    try {
      const campaignService = new PoolService();
      const camp = await campaignService.buildQueryBuilder({ id: campaign_id }).first();
      if (!camp) {
        return HelperUtils.responseBadRequest('Campaign not found');
      }

      if (!camp.kyc_bypass) {
        // get user info
        const userService = new UserService();
        const user = await userService.findUser({wallet_address: wallet_address});
        if (!user || !user.email) {
          return HelperUtils.responseBadRequest("User not found");
        }
        if (user.is_kyc !== Const.KYC_STATUS.APPROVED) {
          return HelperUtils.responseBadRequest("Your KYC status is not verified");
        }
      }

      const nftOrderService = new NFTOrderService();
      await nftOrderService.createOrUpdate({
        wallet_address: wallet_address,
        campaign_id: campaign_id,
        amount: amount,
      })

      return HelperUtils.responseSuccess();
    }
    catch(e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getOrder({request}) {
    const param = request.all()
    const campaign_id = param.campaign_id
    const wallet_address = param.wallet_address

    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Invalid campaign');
    }

    if (!wallet_address) {
      return HelperUtils.responseBadRequest('Invalid wallet');
    }

    try {
      const nftOrderService = new NFTOrderService();
      const data = await nftOrderService.getOrder({
        wallet_address: wallet_address,
        campaign_id: campaign_id
      })

      if (!data) {
        return HelperUtils.responseSuccess({
          amount: 0,
        });
      }

      return HelperUtils.responseSuccess({
        amount: data.amount
      });
    }
    catch(e) {
      return HelperUtils.responseErrorInternal();
    }
  }
}

module.exports = NFTOrderController
