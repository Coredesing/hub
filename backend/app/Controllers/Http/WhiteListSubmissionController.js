'use strict'

const TierService = use('App/Services/TierService');
const CampaignService = use('App/Services/CampaignService');
const UserService = use('App/Services/UserService');
const WhitelistSubmissionModel = use('App/Models/WhitelistSubmission');
const WhitelistSubmissionService = use('App/Services/WhitelistSubmissionService');
const BadRequestException = use('App/Exceptions/BadRequestException');
const ConvertDateUtils = use('App/Common/ConvertDateUtils');
const HelperUtils = use('App/Common/HelperUtils');
const Const = use('App/Common/Const');
const CountryList = use('App/Common/Country');

class WhiteListSubmissionController {

  async getWhitelistSubmission({ request, params }) {
    const campaign_id = params.campaignId;
    const wallet_address = request.input('wallet_address');

    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    if (!wallet_address) {
      return HelperUtils.responseBadRequest('Bad request with wallet_address');
    }

    try {
      const whitelistSubmissionService = new WhitelistSubmissionService();
      const submissionParams = {
        wallet_address,
        campaign_id,
      }
      const submission = await whitelistSubmissionService.findSubmission(submissionParams)
      return HelperUtils.responseSuccess(
        submission
      );

    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Get Whitelist Submission fail !');
      }
    }
  }

  async getPreviousWhitelistSubmission({ request, params }) {
    const wallet_address = request.input('wallet_address');

    if (!wallet_address) {
      return HelperUtils.responseBadRequest('Bad request with wallet_address');
    }

    try {
      const whitelistSubmissionService = new WhitelistSubmissionService();
      const submissionParams = {
        wallet_address,
      }
      const submission = await whitelistSubmissionService.findSubmission(submissionParams)
      return HelperUtils.responseSuccess(
        submission
      );

    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Get Whitelist Submission fail !');
      }
    }
  }

  async applyWhitelistSubmissionBox({ request, params }) {
    // get request params
    const campaign_id = params.campaignId;
    const wallet_address = request.input('wallet_address');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }

    try {
      // check campaign
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id);
      if (!camp || camp.buy_type !== Const.BUY_TYPE.WHITELIST_LOTTERY) {
        return HelperUtils.responseBadRequest(`Invalid campaign`)
      }

      if (camp.token_type !== 'box') {
        return HelperUtils.responseBadRequest(`Invalid campaign`)
      }
      const currentDate = ConvertDateUtils.getDatetimeNowUTC();
      // check time to join campaign
      if (camp.start_join_pool_time > currentDate || camp.end_join_pool_time < currentDate) {
        return HelperUtils.responseBadRequest("It's not right time to join this campaign !");
      }
      // get user info
      const userService = new UserService();
      const userParams = {
        'wallet_address': wallet_address
      }
      const user = await userService.findUser(userParams);

      if (!camp.kyc_bypass) {
        if (!user || !user.email) {
          return HelperUtils.responseBadRequest("User not found");
        }
        if (user.is_kyc !== Const.KYC_STATUS.APPROVED) {
          return HelperUtils.responseBadRequest("Your KYC status is not verified");
        }
      }

      // check user tier
      const userTier = (await HelperUtils.getUserTierSmartWithCached(wallet_address))[0];
      // check user tier with min tier of campaign
      if (camp.min_tier > userTier) {
        return HelperUtils.responseBadRequest("You need to achieve higher rank for applying whitelist");
      }
      // call to db to get tier info
      const tierService = new TierService();
      const tierParams = {
        'campaign_id': campaign_id,
        'level': userTier
      };
      const tier = await tierService.findByLevelAndCampaign(tierParams);
      if (!tier) {
        return HelperUtils.responseBadRequest("Ranking not found");
      }

      // call to whitelist submission service
      const whitelistSubmissionService = new WhitelistSubmissionService();
      const submissionParams = {
        wallet_address,
        campaign_id,
        user_telegram: wallet_address,
        user_twitter: wallet_address,
        self_twitter_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        self_group_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        self_channel_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        self_retweet_post_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        self_retweet_post_link: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        partner_twitter_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        partner_group_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        partner_channel_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        partner_retweet_post_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
        partner_retweet_post_link: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED
      }
      await whitelistSubmissionService.createWhitelistSubmissionAccount(submissionParams)

      return HelperUtils.responseSuccess(true);
    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Submit Whitelist fail !');
      }
    }
  }

  async addWhitelistSubmission({ request, params }) {
    // get request params
    const campaign_id = params.campaignId;
    const wallet_address = request.input('wallet_address');
    const user_telegram = request.input('user_telegram');
    const user_twitter = request.input('user_twitter');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }

    console.log('Submit social submission for campain with params: ', campaign_id, wallet_address);
    try {
      // check campaign
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id);
      if (!camp || camp.buy_type !== Const.BUY_TYPE.WHITELIST_LOTTERY) {
        return HelperUtils.responseBadRequest(`Bad request with campaignId ${campaign_id}`)
      }
      const currentDate = ConvertDateUtils.getDatetimeNowUTC();
      // check time to join campaign
      if (camp.start_join_pool_time > currentDate || camp.end_join_pool_time < currentDate) {
        return HelperUtils.responseBadRequest("It's not right time to join this campaign !");
      }
      // get user info
      const userService = new UserService();
      const userParams = {
        'wallet_address': wallet_address
      }
      const user = await userService.findUser(userParams);
      if (!user || !user.email) {
        return HelperUtils.responseBadRequest("You're not valid user to join this campaign !");
      }
      if (user.is_kyc !== Const.KYC_STATUS.APPROVED) {
        return HelperUtils.responseBadRequest("You must register for KYC successfully to be allowed to join. Or the email address and/or wallet address you used for KYC does not match the one you use on Red Kite. Please check and update on Blockpass to complete KYC verification.");
      }
      let forbidden_countries = [];
      try {
        forbidden_countries = JSON.parse(camp.forbidden_countries);
      } catch (_) {
        forbidden_countries = [];
      }
      if (forbidden_countries.includes(user.national_id_issuing_country)) {
        return HelperUtils.responseBadRequest(`Sorry, citizens and residents of ${CountryList && CountryList[user.national_id_issuing_country] || user.national_id_issuing_country} are restricted to participate in the IGO.`);
      }
      // check user tier
      const userTier = (await HelperUtils.getUserTierSmartWithCached(wallet_address))[0];
      // check user tier with min tier of campaign
      if (camp.min_tier > userTier) {
        return HelperUtils.responseBadRequest("You're not tier qualified for join this campaign!");
      }
      // call to db to get tier info
      const tierService = new TierService();
      const tierParams = {
        'campaign_id': campaign_id,
        'level': userTier
      };
      const tier = await tierService.findByLevelAndCampaign(tierParams);
      if (!tier) {
        return HelperUtils.responseBadRequest("You're not tier qualified for join this campaign!");
      }

      // call to whitelist submission service
      const whitelistSubmissionService = new WhitelistSubmissionService();
      const submissionParams = {
        wallet_address,
        campaign_id,
        user_telegram,
        user_twitter,
      }
      await whitelistSubmissionService.addWhitelistSubmission(submissionParams)

      const socialCheckResult = await whitelistSubmissionService.checkFullSubmission(campaign_id, wallet_address);
      const rejected = socialCheckResult.includes(Const.SOCIAL_SUBMISSION_STATUS.REJECTED);

      const submission = await WhitelistSubmissionModel.query().
        where('campaign_id', campaign_id).
        where('wallet_address', wallet_address).first();

      return {
        status: rejected ? 422 : 200,
        message: rejected ? 'Please follow our instruction correctly' : 'Success',
        data: submission,
      }
    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Submit Whitelist fail !');
      }
    }
  }

  async updateWhitelistSubmission({ request, params }) {
    const campaign_id = params.campaignId;
    const wallet_address = params.walletAddress;

    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    if (!wallet_address) {
      return HelperUtils.responseBadRequest('Bad request with wallet_address');
    }

    try {
      const whitelistSubmissionService = new WhitelistSubmissionService();
      const submissionParams = {
        wallet_address,
        campaign_id,
      }
      const submission = await whitelistSubmissionService.findSubmission(submissionParams)
      const data = request.post();
      submission.merge({
        self_twitter_status: data.self_twitter_status,
        self_group_status: data.self_group_status,
        self_channel_status: data.self_channel_status,
        self_retweet_post_status: data.self_retweet_post_status,
        partner_twitter_status: data.partner_twitter_status,
        partner_group_status: data.partner_group_status,
        partner_channel_status: data.partner_channel_status,
        partner_retweet_post_status: data.partner_retweet_post_status,
      });

      await submission.save();

      return HelperUtils.responseSuccess();

    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Get Whitelist Submission fail !');
      }
    }
  }

  async verifyWhitelistSubmission({ request, params }) {
    const campaign_id = params.campaignId;
    const wallet_address = params.walletAddress;

    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    if (!wallet_address) {
      return HelperUtils.responseBadRequest('Bad request with wallet_address');
    }

    try {
      const whitelistSubmissionService = new WhitelistSubmissionService();

      const socialCheckResult = await whitelistSubmissionService.checkPendingSubmission(campaign_id, wallet_address);
      return HelperUtils.responseSuccess(socialCheckResult);

    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Get Whitelist Submission fail !');
      }
    }
  }

  async verifyBatchWhitelistSubmission({ request, params }) {
    const campaign_id = params.campaignId;
    const inputParams = request.only(['wallet_addresses', 'campaign_id']);

    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    if (!inputParams.wallet_addresses || !inputParams.wallet_addresses.length) {
      return HelperUtils.responseBadRequest('Bad request with wallet_address');
    }

    try {
      const whitelistSubmissionService = new WhitelistSubmissionService();

      for (const wallet_address of inputParams.wallet_addresses) {
        await whitelistSubmissionService.checkPendingSubmission(campaign_id, wallet_address);
      }
      return HelperUtils.responseSuccess();

    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Get Whitelist Submission fail !');
      }
    }
  }

  async approveBatchWhitelistSubmission({ request, params }) {
    const campaign_id = params.campaignId;
    const inputParams = request.only(['wallet_addresses', 'campaign_id']);

    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }
    if (!inputParams.wallet_addresses || !inputParams.wallet_addresses.length) {
      return HelperUtils.responseBadRequest('Bad request with wallet_address');
    }

    try {
      const whitelistSubmissionService = new WhitelistSubmissionService();

      for (const wallet_address of inputParams.wallet_addresses) {
        const submissionParams = {
          wallet_address,
          campaign_id,
        }

        const submission = await whitelistSubmissionService.findSubmission(submissionParams)
        if (!submission) {
          continue;
        }

        await whitelistSubmissionService.approveSubmission(submission)
      }
      return HelperUtils.responseSuccess();

    } catch (e) {
      console.log("error", e)
      if (e instanceof BadRequestException) {
        return HelperUtils.responseBadRequest(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR : Get Whitelist Submission fail !');
      }
    }
  }
}

module.exports = WhiteListSubmissionController
