'use strict'

const CampaignModel = use('App/Models/Campaign');
const WalletAccountModel = use('App/Models/WalletAccount');
const UserModel = use('App/Models/User');
const WalletAccountService = use('App/Services/WalletAccountService');
const PoolService = use('App/Services/PoolService');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');
const GameFIUtils = use('App/Common/GameFIUtils');
const Config = use('Config')
const UserBalanceSnapshotModel = use('App/Models/UserBalanceSnapshot');
const moment = require('moment');
const BigNumber = use('bignumber.js');
const { pick } = require('lodash');
const csv = require('fast-csv');

class PoolController {
  // special pool: GamefiTicket
  async getGameFITicket() {
    try {
      if (await RedisUtils.checkExistRedisPoolDetail(0)) {
        const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(0);
        return HelperUtils.responseSuccess(JSON.parse(cachedPoolDetail));
      }

      let pool = await GameFIUtils.getGameFIPool(CampaignModel)
      if (!pool) {
        return HelperUtils.responseNotFound('Pool not found');
      }

      let count = await UserModel.query()
        .where('is_kyc', 1)
        .where('status', 1)
        .count('* as total');

      let participants = (count && count.length > 0) ? count[0].total : 0
      participants = parseInt(participants) || 0
      let publicPool = pick(pool, [
        // Pool Info
        'id', 'title', 'website', 'banner', 'updated_at', 'created_at',
        'campaign_hash', 'description', 'registed_by', 'register_by',
        'campaign_status',

        // Types
        'buy_type', 'accept_currency', 'min_tier', 'network_available',
        'pool_type', 'is_deploy', 'is_display', 'is_pause', 'is_private',
        'public_winner_status',

        // Time
        'release_time', 'start_join_pool_time', 'start_time', 'end_join_pool_time', 'finish_time',

        // Token Info
        'name', 'symbol', 'decimals', 'token', 'token_type', 'token_images', 'total_sold_coin',
        'token_conversion_rate', 'ether_conversion_rate',
        'price_usdt', 'display_price_rate',
        'token_sold',

        // social network
        'socialNetworkSetting',

        // Progress Display Setting
        'token_sold_display',
        'progress_display',

        // Lock Schedule Setting
        'whitelist_country',
      ]);

      publicPool.participants = participants;
      publicPool.max_buy_ticket = new BigNumber(pool.tiers[0].max_buy).dividedBy(new BigNumber(pool.token_conversion_rate)).integerValue(BigNumber.ROUND_DOWN);
      publicPool.max_buy_ticket = parseInt(publicPool.max_buy_ticket.toFixed())

      // Cache data
      RedisUtils.createRedisPoolDetail(0, publicPool);

      return HelperUtils.responseSuccess(publicPool);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get public pool fail !');
    }
  }

  async createPool({ request, auth }) {
    const inputParams = request.only([
      'registed_by',
      'title', 'website', 'banner', 'description', 'process', 'rule', 'address_receiver',
      'token', 'token_images', 'total_sold_coin',
      'token_by_eth', 'token_conversion_rate', 'price_usdt', 'display_price_rate',
      'tokenInfo',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type', 'is_private',
      'min_tier', 'tier_configuration', 'claim_configuration',
      'self_twitter', 'self_group', 'self_channel', 'self_retweet_post', 'self_retweet_post_hashtag', 'partner_twitter', 'partner_group', 'partner_channel', 'partner_retweet_post', 'partner_retweet_post_hashtag',
      'guide_link', 'whitelist_link', 'announcement_time',
      'token_sold_display', 'progress_display',
      'lock_schedule',
      'medium_link', 'twitter_link', 'telegram_link',
      'claim_policy',
      'forbidden_countries',
      'freeBuyTimeSetting',
    ]);

    const tokenInfo = inputParams.tokenInfo;
    const data = {
      'registed_by': inputParams.registed_by,

      'title': inputParams.title,
      'website': inputParams.website,
      'description': inputParams.description,
      'rule': inputParams.rule,
      'process': inputParams.process,
      // 'token': inputParams.token,
      'start_time': inputParams.start_time,
      'finish_time': inputParams.finish_time,
      'ether_conversion_rate': inputParams.token_by_eth,
      'token_conversion_rate': inputParams.token_conversion_rate,
      'price_usdt': inputParams.price_usdt,
      'display_price_rate': inputParams.display_price_rate,

      'banner': inputParams.banner,
      'address_receiver': inputParams.address_receiver,
      'token_images': inputParams.token_images,
      'total_sold_coin': inputParams.total_sold_coin,
      'release_time': inputParams.release_time,
      'start_join_pool_time': inputParams.start_join_pool_time,
      'end_join_pool_time': inputParams.end_join_pool_time,
      'accept_currency': inputParams.accept_currency,
      'network_available': inputParams.network_available,
      'buy_type': inputParams.buy_type,
      'pool_type': inputParams.pool_type,
      'is_private': inputParams.is_private,
      'min_tier': inputParams.min_tier,

      'is_display': false,  // Default is hidden

      'symbol': tokenInfo && tokenInfo.symbol,
      'name': tokenInfo && tokenInfo.name,
      'decimals': tokenInfo && tokenInfo.decimals,
      'token': tokenInfo && tokenInfo.address,
      'token_type': tokenInfo && tokenInfo.token_type,

      'token_sold_display': inputParams.token_sold_display,
      'progress_display': inputParams.progress_display,
      'lock_schedule': inputParams.lock_schedule,
      'claim_policy': inputParams.claim_policy,

      'forbidden_countries': JSON.stringify(inputParams && inputParams.forbidden_countries || []),
    };
    console.log('Create Pool with data: ', data);

    try {
      // Create Pool
      const poolService = new PoolService;
      const campaign = new CampaignModel();
      campaign.fill(data);
      await campaign.save();

      // Update Claim Config
      let claimConfigs = inputParams.claim_configuration || [];
      claimConfigs = poolService.addDefaultClaimConfig(claimConfigs, campaign.finish_time);
      console.log('[createPool] - Update Claim Config - claimConfigs', claimConfigs);
      await poolService.updateClaimConfig(campaign, claimConfigs);

      // Update Tier Config
      console.log('[createPool] - Update Tier Config - inputParams.tier_configuration', inputParams.tier_configuration);
      await poolService.updateTierConfig(campaign, inputParams.tier_configuration || []);

      // Update Whitelist Social Requirements
      await poolService.updateWhitelistSocialRequirement(campaign, {
        self_twitter: inputParams.self_twitter,
        self_group: inputParams.self_group,
        self_channel: inputParams.self_channel,
        self_retweet_post: inputParams.self_retweet_post,
        self_retweet_post_hashtag: inputParams.self_retweet_post_hashtag,
        partner_twitter: inputParams.partner_twitter,
        partner_group: inputParams.partner_group,
        partner_channel: inputParams.partner_channel,
        partner_retweet_post: inputParams.partner_retweet_post,
        partner_retweet_post_hashtag: inputParams.partner_retweet_post_hashtag,
      });

      // Update Whitelist Banner Setting
      await poolService.updateWhitelistBannerSetting(campaign, {
        guide_link: inputParams.guide_link,
        whitelist_link: inputParams.whitelist_link,
        announcement_time: inputParams.announcement_time,
      });

      // Update Social Network Setting
      await poolService.updateSocialNetworkSetting(campaign, {
        twitter_link: inputParams.twitter_link,
        telegram_link: inputParams.telegram_link,
        medium_link: inputParams.medium_link,
      });

      // Update Social Network Setting
      await poolService.updateFreeBuyTimeSetting(campaign, {
        start_buy_time: inputParams.freeBuyTimeSetting.start_time_free_buy,
        max_bonus: inputParams && inputParams.freeBuyTimeSetting && inputParams.freeBuyTimeSetting.max_bonus_free_buy,
      });

      // Create Web3 Account
      const campaignId = campaign.id;
      const account = await (new WalletAccountService).createWalletAddress(campaignId);
      console.log('[createPool] - Create Walllet Account:', account.wallet_address);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log('[PoolController::createPool] - ERROR: ', e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async updatePool({ request, auth, params }) {
    const inputParams = request.only([
      'registed_by',
      'title', 'website', 'banner', 'description', 'process', 'rule', 'address_receiver',
      'token', 'token_images', 'total_sold_coin',
      'token_by_eth', 'token_conversion_rate', 'price_usdt', 'display_price_rate',
      'tokenInfo',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time',
      'accept_currency', 'network_available', 'buy_type', 'pool_type', 'is_private',
      'min_tier', 'tier_configuration', 'claim_configuration',
      'self_twitter', 'self_group', 'self_channel', 'self_retweet_post', 'self_retweet_post_hashtag', 'partner_twitter', 'partner_group', 'partner_channel', 'partner_retweet_post', 'partner_retweet_post_hashtag',
      'guide_link', 'whitelist_link', 'announcement_time',
      'token_sold_display', 'progress_display',
      'lock_schedule',
      'medium_link', 'twitter_link', 'telegram_link',
      'claim_policy',
      'forbidden_countries',
      'freeBuyTimeSetting',
    ]);

    const tokenInfo = inputParams.tokenInfo;
    const data = {
      // 'registed_by': inputParams.registed_by,

      'title': inputParams.title,
      'website': inputParams.website,
      'description': inputParams.description,
      'process': inputParams.process,
      'rule': inputParams.rule,
      'start_time': inputParams.start_time,
      'finish_time': inputParams.finish_time,
      'ether_conversion_rate': inputParams.token_by_eth,
      'token_conversion_rate': inputParams.token_conversion_rate,
      'price_usdt': inputParams.price_usdt,
      'display_price_rate': inputParams.display_price_rate,

      'banner': inputParams.banner,
      'address_receiver': inputParams.address_receiver,
      'token_images': inputParams.token_images,
      'total_sold_coin': inputParams.total_sold_coin,
      'release_time': inputParams.release_time,
      'start_join_pool_time': inputParams.start_join_pool_time,
      'end_join_pool_time': inputParams.end_join_pool_time,
      'accept_currency': inputParams.accept_currency,
      'network_available': inputParams.network_available,
      'buy_type': inputParams.buy_type,
      'pool_type': inputParams.pool_type,
      'is_private': inputParams.is_private,
      'min_tier': inputParams.min_tier,

      'symbol': tokenInfo && tokenInfo.symbol,
      'name': tokenInfo && tokenInfo.name,
      'decimals': tokenInfo && tokenInfo.decimals,
      'token': tokenInfo && tokenInfo.address,
      'token_type': tokenInfo && tokenInfo.token_type,

      'token_sold_display': inputParams.token_sold_display,
      'progress_display': inputParams.progress_display,
      'lock_schedule': inputParams.lock_schedule,
      'claim_policy': inputParams.claim_policy,

      'forbidden_countries': JSON.stringify((inputParams && inputParams.forbidden_countries) || []),
    };

    const campaignId = params.campaignId;
    try {
      const poolService = new PoolService;
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await CampaignModel.query().where('id', campaignId).update(data);

      // Update Claim Config
      await poolService.updateClaimConfig(campaign, inputParams.claim_configuration || []);

      // Update Tier Config
      if (!campaign.is_deploy) {
        await poolService.updateTierConfig(campaign, inputParams.tier_configuration || []);
      }

      // Update Whitelist Social Requirements
      await poolService.updateWhitelistSocialRequirement(campaign, {
        self_twitter: inputParams.self_twitter,
        self_group: inputParams.self_group,
        self_channel: inputParams.self_channel,
        self_retweet_post: inputParams.self_retweet_post,
        self_retweet_post_hashtag: inputParams.self_retweet_post_hashtag,
        partner_twitter: inputParams.partner_twitter,
        partner_group: inputParams.partner_group,
        partner_channel: inputParams.partner_channel,
        partner_retweet_post: inputParams.partner_retweet_post,
        partner_retweet_post_hashtag: inputParams.partner_retweet_post_hashtag,
      });

      // Update Whitelist Banner Setting
      await poolService.updateWhitelistBannerSetting(campaign, {
        guide_link: inputParams.guide_link,
        whitelist_link: inputParams.whitelist_link,
        announcement_time: inputParams.announcement_time,
      });

      // Update Social Network Setting
      await poolService.updateSocialNetworkSetting(campaign, {
        twitter_link: inputParams.twitter_link,
        telegram_link: inputParams.telegram_link,
        medium_link: inputParams.medium_link,
      });

      // Update Social Network Setting
      await poolService.updateFreeBuyTimeSetting(campaign, {
        start_buy_time: inputParams && inputParams.freeBuyTimeSetting && inputParams.freeBuyTimeSetting.start_time_free_buy,
        max_bonus: inputParams && inputParams.freeBuyTimeSetting && inputParams.freeBuyTimeSetting.max_bonus_free_buy,
      });

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);
      RedisUtils.deleteRedisTierList(campaignId);

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log('[PoolController::updatePool] - ERROR: ', e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async updateDeploySuccess({ request, auth, params }) {
    const inputParams = request.only([
      'campaign_hash', 'token_symbol', 'token_name', 'token_decimals', 'token_address',
    ]);

    console.log('Update Deploy Success with data: ', inputParams);
    const campaignId = params.campaignId;
    try {
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      campaign.is_deploy = true;
      campaign.campaign_hash = inputParams.campaign_hash;
      campaign.token = inputParams.token_address;
      campaign.name = inputParams.token_name;
      campaign.symbol = inputParams.token_symbol;
      campaign.decimals = inputParams.token_decimals;
      campaign.save();

      console.log('[updateDeploySuccess] - CAMPAIGN: ', campaign);
      // const camp = await CampaignModel.query().where('id', campaignId).update({
      //   is_deploy: true,
      //   campaign_hash: inputParams.campaign_hash,
      //   token: inputParams.token_address,
      //   name: inputParams.name,
      //   symbol: inputParams.symbol,
      //   decimals: inputParams.decimals,
      // });

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);

      return HelperUtils.responseSuccess(campaign);
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
    const campaignId = params.campaignId;
    try {
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await CampaignModel.query().where('id', campaignId).update({
        is_display: inputParams.is_display,
      });

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);

      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async changePublicWinnerStatus({ request, auth, params }) {
    const inputParams = request.only([
      'public_winner_status'
    ]);

    console.log('[changePublicWinnerStatus] - Update Public Winner Status with data: ', inputParams);
    const campaignId = params.campaignId;

    try {
      const campaign = await CampaignModel.query().where('id', campaignId).first();
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      const res = await CampaignModel.query().where('id', campaignId).update({
        public_winner_status: inputParams.public_winner_status,
      });

      console.log('[changePublicWinnerStatus] - Update Success campaign ID: ', res);

      // Delete cache
      RedisUtils.deleteRedisPoolDetail(campaignId);

      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPoolAdmin({ request, auth, params }) {
    const poolId = params.campaignId;
    console.log('[getPoolAdmin] - Start getPool (Admin) with poolId: ', poolId);
    try {
      let pool = await CampaignModel.query()
        .with('tiers')
        .with('campaignClaimConfig')
        .with('socialRequirement')
        .with('whitelistBannerSetting')
        .with('socialNetworkSetting')
        .with('freeBuyTimeSetting')
        .where('id', poolId)
        .first();
      if (!pool) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      pool = JSON.parse(JSON.stringify(pool));
      try {
        pool.forbidden_countries = JSON.parse(pool.forbidden_countries)
      } catch (_) {
        pool.forbidden_countries = []
      }
      console.log('[getPool] - pool.tiers: ', JSON.stringify(pool.tiers));
      if (pool.tiers && pool.tiers.length > 0) {
        pool.tiers = pool.tiers.map((item, index) => {
          return {
            ...item,
            min_buy: (new BigNumber(item.min_buy)).toNumber(),
            max_buy: (new BigNumber(item.max_buy)).toNumber(),
          }
        });
      }

      const walletAccount = await WalletAccountModel.query().where('campaign_id', poolId).first();
      if (walletAccount) {
        pool.wallet = {
          id: walletAccount.id,
          wallet_address: walletAccount.wallet_address,
        };
      }

      // Cache data
      RedisUtils.createRedisPoolDetail(poolId, pool);

      return HelperUtils.responseSuccess(pool);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPoolPublic({ request, auth, params }) {
    const poolId = params.campaignId;
    console.log('[getPublicPool] - Start getPublicPool with poolId: ', poolId);
    try {
      if (await RedisUtils.checkExistRedisPoolDetail(poolId)) {
        const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(poolId);
        return HelperUtils.responseSuccess(JSON.parse(cachedPoolDetail));
      }

      let pool = await CampaignModel.query()
        .with('tiers')
        .with('campaignClaimConfig')
        .with('whitelistBannerSetting')
        .with('socialNetworkSetting')
        .with('socialRequirement')
        .with('freeBuyTimeSetting')
        .where('id', poolId)
        .first();
      if (!pool) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      pool = JSON.parse(JSON.stringify(pool));

      const publicPool = pick(pool, [
        // Pool Info
        'id', 'title', 'website', 'banner', 'updated_at', 'created_at',
        'campaign_hash', 'campaign_id', 'description', 'process', 'rule', 'registed_by', 'register_by',
        'campaign_status',

        // Types
        'buy_type', 'accept_currency', 'min_tier', 'network_available',
        'pool_type', 'is_deploy', 'is_display', 'is_pause', 'is_private',
        'public_winner_status',

        // Time
        'release_time', 'start_join_pool_time', 'start_time', 'end_join_pool_time', 'finish_time',

        // Token Info
        'name', 'symbol', 'decimals', 'token', 'token_type', 'token_images', 'total_sold_coin',
        'token_conversion_rate', 'ether_conversion_rate',
        'price_usdt', 'display_price_rate',
        'token_sold',

        // Claim Config
        'campaignClaimConfig',

        // Whitelist Social Requirement
        'socialRequirement',

        // Whitelist Banner Setting
        'whitelistBannerSetting',

        // Progress Display Setting
        'token_sold_display',
        'progress_display',

        // Lock Schedule Setting
        'lock_schedule',
        'whitelist_country',

        // Social Network Setting
        'socialNetworkSetting',

        // Claim Policy
        'claim_policy',

        // Free Buy Time Setting
        'freeBuyTimeSetting',
      ]);

      console.log('[getPublicPool] - pool.tiers: ', JSON.stringify(pool.tiers));
      if (pool.tiers && pool.tiers.length > 0) {
        publicPool.tiers = pool.tiers.map((item, index) => {
          return {
            ...item,
            min_buy: (new BigNumber(item.min_buy)).toNumber(),
            max_buy: (new BigNumber(item.max_buy)).toNumber(),
          }
        });
      }
      console.log('[getPublicPool] - pool.campaignClaimConfig: ', JSON.stringify(pool.campaignClaimConfig));

      // Cache data
      RedisUtils.createRedisPoolDetail(poolId, publicPool);

      return HelperUtils.responseSuccess(publicPool);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get public pool fail !');
    }
  }

  async getPoolList({ request }) {
    const param = request.all();
    const limit = param.limit ? param.limit : Config.get('const.limit_default');
    const page = param.page ? param.page : Config.get('const.page_default');
    param.limit = limit;
    param.page = page;
    param.is_search = true;
    console.log('Start Pool List with params: ', param);

    try {
      // if (await RedisUtils.checkExistRedisPoolList(param)) {
      //   const cachedPoolDetail = await RedisUtils.getRedisPoolList(param);
      //   console.log('Exist cache data Public Pool List: ', cachedPoolDetail);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedPoolDetail));
      // }

      let listData = (new PoolService).buildSearchQuery(param).with('campaignClaimConfig');
      if (process.env.NODE_ENV == 'development') {
        listData = listData.orderBy('id', 'DESC');
      } else {
        listData = listData.orderBy('id', 'ASC');
      }
      listData = await listData.paginate(page, limit);

      // // Cache data
      // RedisUtils.createRedisPoolList(param, listData);

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal('Get Pools Fail !!!');
    }
  }

  async getTopPools({ request }) {
    const inputParams = request.all();
    const limit = inputParams.limit ? inputParams.limit : Config.get('const.limit_default');
    const page = inputParams.page ? inputParams.page : Config.get('const.page_default');
    inputParams.limit = limit;
    inputParams.page = page;
    inputParams.is_search = true;
    console.log('[getTopPools] - inputParams: ', inputParams);

    try {
      let listData = (new PoolService).buildSearchQuery(inputParams);
      listData = listData.orderBy('created_at', 'DESC');
      listData = await listData.paginate(page, limit);

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Top Pools Fail !!!');
    }
  }

  async getJoinedPools({ request, params }) {
    const inputParams = request.all();
    const limit = inputParams.limit ? inputParams.limit : Config.get('const.limit_default');
    const page = inputParams.page ? inputParams.page : Config.get('const.page_default');
    inputParams.limit = limit;
    inputParams.page = page;
    inputParams.is_search = true;
    console.log('[getJoinedPools] - inputParams: ', inputParams);

    const walletAddress = params.walletAddress;
    try {
      let listData = (new PoolService).getJoinedPools(walletAddress, inputParams);
      listData = listData.orderBy('created_at', 'DESC');
      listData = await listData.paginate(page, limit);

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Joined Pool Fail !!!');
    }
  }


  async getUpcomingPools({ request }) {
    const inputParams = request.all();
    console.log('[getUpcomingPools] - inputParams: ', inputParams);
    try {
      let listData = await (new PoolService).getUpcomingPools(inputParams);

      console.log('listData', listData);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Upcoming Pools Fail !!!');
    }
  }

  async getFeaturedPools({ request }) {
    const inputParams = request.all();
    console.log('[getFeaturedPools] - inputParams: ', inputParams);
    try {
      let listData = await (new PoolService).getFeaturedPools(inputParams);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Featured Pools Fail !!!');
    }
  }

  async getActivePoolsV3({ request }) {
    const inputParams = request.all();
    console.log('[getActivePoolsV3] - inputParams: ', inputParams);
    try {
      let listData = await (new PoolService).getActivePoolsV3(inputParams);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('getActivePoolsV3 Fail !!!');
    }
  }

  async getNextToLaunchPoolsV3({ request }) {
    const inputParams = request.all();
    console.log('[getNextToLaunchPoolsV3] - inputParams: ', inputParams);
    try {
      let listData = await (new PoolService).getNextToLaunchPoolsV3(inputParams);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('getNextToLaunchPoolsV3 Fail !!!');
    }
  }

  async getUpcomingPoolsV3({ request }) {
    const inputParams = request.all();
    console.log('[getUpcomingPoolsV3] - inputParams: ', inputParams);
    try {
      let listData = await (new PoolService).getUpcomingPoolsV3(inputParams);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('getUpcomingPoolsV3 Fail !!!');
    }
  }

  async getCompleteSalePoolsV3({ request }) {
    const inputParams = request.all();
    console.log('[getCompleteSalePoolsV3] - inputParams: ', inputParams);
    try {
      let listData = await (new PoolService).getCompleteSalePoolsV3(inputParams);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('getCompleteSalePoolsV3 Fail !!!');
    }
  }

  async getPoolByTokenType({ request, params }) {
    const inputParams = request.all();
    try {
      let listData = await (new PoolService).getPoolByTokenType(inputParams);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      return HelperUtils.responseErrorInternal('getPoolByTokenType Fail');
    }
  }

  async poolStatus({ request, params }) {
    console.log('[poolStatus] - runUpdatePoolStatus: ');
    const poolService = new PoolService;
    const pools = await poolService.runUpdatePoolStatus();

    return pools;
  }

  async uploadWinners({ request, auth, params }) {
    const campaignId = params.campaignId;
    const file = request.file('file');

    if (!campaignId) {
      return HelperUtils.responseNotFound('Pool not found');
    }

    try {
      let userSnapshots = []
      csv.parseFile(file.tmpPath, {headers: false})
        .on("data", (data) => {
          if (data.length < 2) {
            return
          }
          const wallet_address = data[0]
          let ticket = parseInt(data[1]) ?? 1
          ticket = isNaN(ticket) ? 1 : ticket
          if (ticket < 1) {
            ticket = 1
          }

          let userSnapShot = new UserBalanceSnapshotModel();
          userSnapShot.fill({
            campaign_id: campaignId,
            wallet_address: wallet_address,
            level: 0,
            winner_ticket: ticket,
            lottery_ticket: ticket,
            pkf_balance: 0,
            pkf_balance_with_weight_rate: 0,
          });
          userSnapshots.push(userSnapShot);
        })
        .on("error", (e) => {
          console.log('error', e);
        })
        .on("end", async () => {
          const campaignUpdated = await CampaignModel.query().where('id', campaignId).first();
          if (!campaignUpdated) {
            return
          }
          await campaignUpdated.userBalanceSnapshots().delete();
          await campaignUpdated.userBalanceSnapshots().saveMany(userSnapshots);
        });

      return HelperUtils.responseSuccess({message: 'upload successfully'});
    } catch (e) {
      return HelperUtils.responseErrorInternal('getPoolByTokenType Fail');
    }
  }
}

module.exports = PoolController
