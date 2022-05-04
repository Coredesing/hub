'use strict'

const WhitelistSubmissionModel = use('App/Models/WhitelistSubmission');
const CampaignSocialRequirementModel = use('App/Models/CampaignSocialRequirement');
const ErrorFactory = use('App/Common/ErrorFactory');
const HelperUtils = use('App/Common/HelperUtils');
const requests = require('request');
const Const = use('App/Common/Const');

const SOCIAL_NETWORK_TELEGRAM = 'telegram';
const SOCIAL_NETWORK_TWITTER = 'twitter';
const SOCIAL_NETWORK_CHECK_USER = 'user';
const SOCIAL_NETWORK_CHECK_POST = 'post';
const SOCIAL_CHECK_LINK = process.env.SOCIAL_CHECK_LINK || 'https://redkite-social-api.polkafoundry.com/api/v1/social-network/NETWORK/TYPE';

class WhitelistSubmissionService {
  buildQueryBuilder(params) {
    // create query
    let builder = WhitelistSubmissionModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.wallet_address) {
      builder = builder.where('wallet_address', params.wallet_address);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    if (params.whitelist_user_id) {
      builder = builder.where('whitelist_user_id', params.whitelist_user_id);
    }
    if (params.email) {
      builder = builder.where('email', params.email);
    }

    return builder;
  }

  async findSubmission(params) {
    let builder = this.buildQueryBuilder(params);
    return await builder.first();
  }
  async findLastSubmission(params) {
    let builder = this.buildQueryBuilder(params);
    return await builder.last();
  }

  async countSubmissions(params) {
    let builder = this.buildQueryBuilder(params)
    let result = await builder.count('* as sum').first()

    if (!result) {
      return {
        total: 0
      }
    }

    result = JSON.parse(JSON.stringify(result))

    return {
      total: Number(result?.sum || 0)
    }
  }

  async addWhitelistSubmission(params) {
    if (!params.wallet_address || !params.campaign_id || !params.user_twitter || !params.user_telegram) {
      let empty = [];
      if (!params.wallet_address) {
        empty.push('Wallet address');
      }
      if (!params.campaign_id) {
        empty.push('Campaign');
      }
      if (!params.user_twitter) {
        empty.push('Twitter');
      }
      if (!params.user_telegram) {
        empty.push('Telegram');
      }
      ErrorFactory.badRequest(`Missing required field(s): ${empty.join(', ')}`)
    }

    let wl = await WhitelistSubmissionModel.query().
    where('campaign_id', params.campaign_id).
    where('wallet_address', params.wallet_address).first();
    if (wl) {
      if (wl.whitelist_user_id) {
        ErrorFactory.badRequest('User already joined this campaign');
      } else {
        await WhitelistSubmissionModel.query().
        where('campaign_id', params.campaign_id).
        where('wallet_address', params.wallet_address).delete()
      }
    }

    wl = await WhitelistSubmissionModel.query()
      .where('campaign_id', params.campaign_id)
      .whereNotNull('whitelist_user_id')
      .where((query) => {
        query
          .where('user_twitter', params.user_twitter)
          .orWhere('user_telegram', params.user_telegram)
      }).first();
    if (wl) {
      ErrorFactory.badRequest('Duplicated telegram or twitter username');
    }

    const whitelistSubmission = new WhitelistSubmissionModel;

    whitelistSubmission.fill({
      wallet_address: params.wallet_address,
      campaign_id: params.campaign_id,
      user_telegram: params.user_telegram,
      user_twitter: params.user_twitter,
      solana_address: params.solana_address,
      terra_address: params.terra_address,
      self_retweet_post_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      partner_retweet_post_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
    });
    await whitelistSubmission.save();

    return whitelistSubmission;
  }

  async createWhitelistSubmissionAccount(params) {
    const whitelistSubmission = new WhitelistSubmissionModel;
    whitelistSubmission.fill(params);
    await whitelistSubmission.save();

    return whitelistSubmission;
  }

  async checkFullSubmission(campaign_id, wallet_address) {
    const submission = await WhitelistSubmissionModel.query().
    where('campaign_id', campaign_id).
    where('wallet_address', wallet_address).first();
    if (!submission) {
      ErrorFactory.internal('WhitelistSubbmission not found')
    }

    const userTier = (await HelperUtils.getUserTierSmartWithCached(wallet_address))[0];
    if (userTier >= 3) {
      await this.approveSubmission(submission)
      return Array(8).fill(Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
    }

    const requirement = await CampaignSocialRequirementModel.query().where('campaign_id', campaign_id).first()
    if (!requirement) {
      await this.approveSubmission(submission)
      return Array(8).fill(Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
    }

    return await Promise.all([
      this.checkSubmission(submission, requirement, 'self_twitter_status'),
      this.checkSubmission(submission, requirement, 'self_group_status'),
      this.checkSubmission(submission, requirement, 'self_channel_status'),
      this.checkSubmission(submission, requirement, 'partner_twitter_status'),
      this.checkSubmission(submission, requirement, 'partner_group_status'),
      this.checkSubmission(submission, requirement, 'partner_channel_status'),
    ]);
  }

  async checkPendingSubmission(campaign_id, wallet_address) {
    const submission = await WhitelistSubmissionModel.query().
    where('campaign_id', campaign_id).
    where('wallet_address', wallet_address).first();
    if (!submission) {
      ErrorFactory.internal('WhitelistSubbmission not found')
    }

    const userTier = (await HelperUtils.getUserTierSmartWithCached(wallet_address))[0];
    if (userTier >= 3) {
      await this.approveSubmission(submission)
      return Array(8).fill(Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
    }

    const requirement = await CampaignSocialRequirementModel.query().where('campaign_id', campaign_id).first()
    if (!requirement) {
      await this.approveSubmission(submission)
      return Array(8).fill(Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
    }

    return await Promise.all([
      submission.self_twitter_status === Const.SOCIAL_SUBMISSION_STATUS.COMPLETED ? Const.SOCIAL_SUBMISSION_STATUS.COMPLETED : this.checkSubmission(submission, requirement, 'self_twitter_status'),
      submission.self_group_status === Const.SOCIAL_SUBMISSION_STATUS.COMPLETED ? Const.SOCIAL_SUBMISSION_STATUS.COMPLETED : this.checkSubmission(submission, requirement, 'self_group_status'),
      submission.self_channel_status === Const.SOCIAL_SUBMISSION_STATUS.COMPLETED ? Const.SOCIAL_SUBMISSION_STATUS.COMPLETED : this.checkSubmission(submission, requirement, 'self_channel_status'),
      submission.partner_twitter_status === Const.SOCIAL_SUBMISSION_STATUS.COMPLETED ? Const.SOCIAL_SUBMISSION_STATUS.COMPLETED : this.checkSubmission(submission, requirement, 'partner_twitter_status'),
      submission.partner_group_status === Const.SOCIAL_SUBMISSION_STATUS.COMPLETED ? Const.SOCIAL_SUBMISSION_STATUS.COMPLETED : this.checkSubmission(submission, requirement, 'partner_group_status'),
      submission.partner_channel_status === Const.SOCIAL_SUBMISSION_STATUS.COMPLETED ? Const.SOCIAL_SUBMISSION_STATUS.COMPLETED : this.checkSubmission(submission, requirement, 'partner_channel_status'),
    ]);
  }

  async approveSubmission(submission) {
    submission.merge({
      self_twitter_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      self_group_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      self_channel_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      self_retweet_post_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      partner_twitter_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      partner_group_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      partner_channel_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
      partner_retweet_post_status: Const.SOCIAL_SUBMISSION_STATUS.COMPLETED,
    });
    await submission.save();
  }

  async checkSubmission(submission, requirement, type) {
    let result = Const.SOCIAL_SUBMISSION_STATUS.PENDING

    switch (type) {
      case 'self_twitter_status':
        result = await this.checkFollowTwitter(submission.user_twitter, requirement.self_twitter, Const.SOCIAL_SUBMISSION_STATUS.ERROR);
        if (result !== submission.self_twitter_status) {
          submission.merge({ self_twitter_status: result });
          await submission.save();
        }
        return result;

      case 'self_group_status':
        result = await this.checkJoinTelegram(submission.user_telegram, requirement.self_group, Const.SOCIAL_SUBMISSION_STATUS.ERROR);
        if (result !== submission.self_group_status) {
          submission.merge({ self_group_status: result });
          await submission.save();

        }
        return result;

      case 'self_channel_status':
        result = await this.checkFollowTelegram(submission.user_telegram, requirement.self_channel, Const.SOCIAL_SUBMISSION_STATUS.ERROR);
        if (result !== submission.self_channel_status) {
          submission.merge({ self_channel_status: result });
          await submission.save();
        }
        return result;

      case 'partner_twitter_status':
        result = await this.checkFollowTwitter(submission.user_twitter, requirement.partner_twitter, Const.SOCIAL_SUBMISSION_STATUS.ERROR);
        if (result !== submission.partner_twitter_status) {
          submission.merge({ partner_twitter_status: result });
          await submission.save();
        }
        return result;

      case 'partner_group_status':
        result = await this.checkJoinTelegram(submission.user_telegram, requirement.partner_group, Const.SOCIAL_SUBMISSION_STATUS.ERROR);
        if (result !== submission.partner_group_status) {
          submission.merge({ partner_group_status: result });
          await submission.save();
        }
        return result;

      case 'partner_channel_status':
        result = await this.checkFollowTelegram(submission.user_telegram, requirement.partner_channel, Const.SOCIAL_SUBMISSION_STATUS.ERROR);
        if (result !== submission.partner_channel_status) {
          submission.merge({ partner_channel_status: result });
          await submission.save();
        }
        return result;

      default:
        return Const.SOCIAL_SUBMISSION_STATUS.ERROR;
    }
  }

  async checkJoinTelegram(username, group, fallbackValue) {
    if (!username) {
      return Const.SOCIAL_SUBMISSION_STATUS.REJECTED;
    }

    if (!group) {
      return Const.SOCIAL_SUBMISSION_STATUS.COMPLETED;
    }

    const params = {
      username: username,
      group: group,
    }
    return await this.checkSocial(SOCIAL_NETWORK_TELEGRAM, SOCIAL_NETWORK_CHECK_USER, params, fallbackValue);
  }

  async checkFollowTelegram(username, group, fallbackValue) {
    if (!username) {
      return Const.SOCIAL_SUBMISSION_STATUS.REJECTED;
    }

    if (!group) {
      return Const.SOCIAL_SUBMISSION_STATUS.COMPLETED;
    }

    const params = {
      username: username,
      group: group,
    }
    return await this.checkSocial(SOCIAL_NETWORK_TELEGRAM, SOCIAL_NETWORK_CHECK_USER, params, fallbackValue);
  }

  async checkFollowTwitter(username, group, fallbackValue) {
    if (!username) {
      return Const.SOCIAL_SUBMISSION_STATUS.REJECTED;
    }

    if (!group) {
      return Const.SOCIAL_SUBMISSION_STATUS.COMPLETED;
    }

    const params = {
      username: username,
      group: group,
    }
    return await this.checkSocial(SOCIAL_NETWORK_TWITTER, SOCIAL_NETWORK_CHECK_USER, params, fallbackValue);
  }

  async checkSocial(network, type, params, fallbackValue) {
    try {
      const url = SOCIAL_CHECK_LINK.replace('NETWORK', network).replace('TYPE', type)
      const options = {
        url: url,
        method: 'GET',
        qs: params,
      }

      const response = await new Promise((resolve, reject) => {
        requests(options, function (error, response, body) {
          if (error) reject(error)
          else resolve(response)
        })
      })

      if (!response || response.statusCode !== 200) {
        return Const.SOCIAL_SUBMISSION_STATUS.ERROR
      }

      const res = JSON.parse(response.body)
      if (!res || res.code !== 200) {
        return Const.SOCIAL_SUBMISSION_STATUS.ERROR
      }

      return res.data ? Const.SOCIAL_SUBMISSION_STATUS.COMPLETED : fallbackValue
    } catch (e) {
      return Const.SOCIAL_SUBMISSION_STATUS.ERROR
    }
  }
}

module.exports = WhitelistSubmissionService;
