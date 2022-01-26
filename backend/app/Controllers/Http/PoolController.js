'use strict'

const CampaignModel = use('App/Models/Campaign');
const WalletAccountModel = use('App/Models/WalletAccount');
const WalletAccountService = use('App/Services/WalletAccountService');
const PoolService = use('App/Services/PoolService');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');
const RedisMysteriousBoxUtils = use('App/Common/RedisMysteriousBoxUtils');
const UserBalanceSnapshotModel = use('App/Models/UserBalanceSnapshot');
const WhitelistUserModel = use('App/Models/WhitelistUser');
const WhitelistService = use('App/Services/WhitelistUserService');
const NFTOrderService = use('App/Services/NFTOrderService');
const BigNumber = use('bignumber.js');
const { pick } = require('lodash');
const csv = require('fast-csv');
const CONST = use('App/Common/Const');

class PoolController {
  async createPool({ request, auth }) {
    const inputParams = request.only([
      'registed_by',
      'title', 'website', 'banner', 'mini_banner', 'slug', 'aggregator_slug', 'description', 'process', 'rule', 'address_receiver',
      'token', 'token_images', 'token_type', 'total_sold_coin',
      'token_by_eth', 'token_conversion_rate', 'price_usdt', 'display_price_rate',
      'tokenInfo', 'gleam_link',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time', 'start_pre_order_time', 'pre_order_min_tier',
      'accept_currency', 'network_available', 'buy_type', 'pool_type', 'is_private', 'kyc_bypass',
      'min_tier', 'tier_configuration', 'claim_configuration',
      'self_twitter', 'self_group', 'self_channel', 'self_retweet_post', 'self_retweet_post_hashtag', 'partner_twitter', 'partner_group', 'partner_channel', 'partner_retweet_post', 'partner_retweet_post_hashtag',
      'guide_link', 'whitelist_link', 'announcement_time',
      'token_sold_display', 'progress_display',
      'lock_schedule',
      'medium_link', 'twitter_link', 'telegram_link',
      'claim_policy',
      'forbidden_countries',
      'freeBuyTimeSetting',
      'seriesContentConfig', 'boxTypesConfig', 'acceptedTokensConfig', 'airdrop_network',
      'is_featured'
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
      'mini_banner': inputParams.mini_banner,
      'slug': inputParams.slug ?? null,
      'aggregator_slug': inputParams.aggregator_slug ?? null,
      'address_receiver': inputParams.address_receiver,
      'token_images': inputParams.token_images,
      'total_sold_coin': inputParams.total_sold_coin,
      'release_time': inputParams.release_time,
      'start_join_pool_time': inputParams.start_join_pool_time,
      'end_join_pool_time': inputParams.end_join_pool_time,
      'start_pre_order_time': inputParams.start_pre_order_time,
      'pre_order_min_tier': inputParams.pre_order_min_tier,
      'accept_currency': inputParams.accept_currency,
      'network_available': inputParams.network_available,
      'buy_type': inputParams.buy_type,
      'pool_type': inputParams.pool_type,
      'kyc_bypass': inputParams.kyc_bypass,
      'is_private': inputParams.is_private,
      'min_tier': inputParams.min_tier,

      'is_display': false,  // Default is hidden

      'symbol': tokenInfo && tokenInfo.symbol,
      'name': tokenInfo && tokenInfo.name,
      'decimals': tokenInfo && tokenInfo.decimals,
      'token': tokenInfo && tokenInfo.address,
      'token_type': inputParams.token_type,

      'token_sold_display': inputParams.token_sold_display,
      'progress_display': inputParams.progress_display,
      'lock_schedule': inputParams.lock_schedule,
      'claim_policy': inputParams.claim_policy,
      'airdrop_network': inputParams.airdrop_network,
      'is_featured': inputParams.is_featured,

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

      await poolService.updateSeriesContentConfig(campaign, inputParams.seriesContentConfig || [])
      await poolService.updateBoxTypesConfig(campaign, inputParams.boxTypesConfig || [])
      await poolService.updateAcceptedTokensConfig(campaign, inputParams.acceptedTokensConfig || [])

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
        gleam_link: inputParams.gleam_link,
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
    } finally {
      // Clear cache
      RedisUtils.deleteAllRedisUpcomingPools([1, 2])
      RedisUtils.deleteAllRedisPoolByTokenType([1, 2])
    }
  }

  async updatePool({ request, auth, params }) {
    const inputParams = request.only([
      'registed_by',
      'title', 'website', 'banner', 'mini_banner', 'slug', 'aggregator_slug', 'description', 'process', 'rule', 'address_receiver',
      'token', 'token_type', 'token_images', 'total_sold_coin',
      'token_by_eth', 'token_conversion_rate', 'price_usdt', 'display_price_rate',
      'tokenInfo', 'gleam_link',
      'start_time', 'finish_time', 'release_time', 'start_join_pool_time', 'end_join_pool_time', 'start_pre_order_time', 'pre_order_min_tier',
      'accept_currency', 'network_available', 'buy_type', 'pool_type', 'is_private', 'kyc_bypass',
      'min_tier', 'tier_configuration', 'claim_configuration',
      'self_twitter', 'self_group', 'self_channel', 'self_retweet_post', 'self_retweet_post_hashtag', 'partner_twitter', 'partner_group', 'partner_channel', 'partner_retweet_post', 'partner_retweet_post_hashtag',
      'guide_link', 'whitelist_link', 'announcement_time',
      'token_sold_display', 'progress_display',
      'lock_schedule',
      'medium_link', 'twitter_link', 'telegram_link',
      'claim_policy',
      'forbidden_countries',
      'freeBuyTimeSetting',
      'seriesContentConfig',
      'boxTypesConfig',
      'acceptedTokensConfig',
      'airdrop_network',
      'is_featured'
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
      'mini_banner': inputParams.mini_banner,
      'slug': inputParams.slug ?? null,
      'aggregator_slug': inputParams.aggregator_slug ?? null,
      'address_receiver': inputParams.address_receiver,
      'token_images': inputParams.token_images,
      'total_sold_coin': inputParams.total_sold_coin,
      'release_time': inputParams.release_time,
      'start_join_pool_time': inputParams.start_join_pool_time,
      'end_join_pool_time': inputParams.end_join_pool_time,
      'start_pre_order_time': inputParams.start_pre_order_time,
      'pre_order_min_tier': inputParams.pre_order_min_tier,
      'accept_currency': inputParams.accept_currency,
      'network_available': inputParams.network_available,
      'buy_type': inputParams.buy_type,
      'pool_type': inputParams.pool_type,
      'kyc_bypass': inputParams.kyc_bypass,
      'is_private': inputParams.is_private,
      'min_tier': inputParams.min_tier,

      'symbol': tokenInfo && tokenInfo.symbol,
      'name': tokenInfo && tokenInfo.name,
      'decimals': tokenInfo && tokenInfo.decimals,
      'token': tokenInfo && tokenInfo.address,
      'token_type': inputParams.token_type,

      'token_sold_display': inputParams.token_sold_display,
      'progress_display': inputParams.progress_display,
      'lock_schedule': inputParams.lock_schedule,
      'claim_policy': inputParams.claim_policy,
      'airdrop_network': inputParams.airdrop_network,
      'is_featured': inputParams.is_featured,
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

      await poolService.updateSeriesContentConfig(campaign, inputParams.seriesContentConfig || [])
      await poolService.updateBoxTypesConfig(campaign, inputParams.boxTypesConfig || [])
      await poolService.updateAcceptedTokensConfig(campaign, inputParams.acceptedTokensConfig || [])

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
        gleam_link: inputParams.gleam_link,
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

      if (inputParams.token_type === 'box') {
        RedisMysteriousBoxUtils.deleteAllRedisMysteriousBoxes();
      }

      return HelperUtils.responseSuccess(campaign);
    } catch (e) {
      console.log('[PoolController::updatePool] - ERROR: ', e);
      return HelperUtils.responseErrorInternal();
    } finally {
      // Clear cache
      RedisUtils.deleteAllRedisUpcomingPools([1, 2])
      RedisUtils.deleteAllRedisPoolByTokenType([1, 2])
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
        .with('seriesContentConfig')
        .with('boxTypesConfig')
        .with('acceptedTokensConfig')
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
        .with('seriesContentConfig')
        .with('boxTypesConfig')
        .with('acceptedTokensConfig')
        .where('id', poolId)
        .first();

      if (!pool) {
        return HelperUtils.responseNotFound('Pool not found');
      }

      pool = JSON.parse(JSON.stringify(pool))
      const publicPool = pick(pool, [
        // Pool Info
        'id', 'title', 'website', 'banner', 'mini_banner', 'slug', 'aggregator_slug', 'updated_at', 'created_at',
        'campaign_hash', 'campaign_id', 'description', 'process', 'rule', 'registed_by', 'register_by',
        'campaign_status',

        // Types
        'buy_type', 'accept_currency', 'min_tier', 'network_available',
        'pool_type', 'is_deploy', 'is_display', 'is_pause', 'is_private',
        'public_winner_status',

        // Time
        'release_time', 'start_join_pool_time', 'start_time', 'end_join_pool_time', 'finish_time',

        // Pre-order
        'pre_order_min_tier', 'start_pre_order_time',

        // KYC required
        'kyc_bypass',

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

        'seriesContentConfig',
        'boxTypesConfig',
        'acceptedTokensConfig',
        'airdrop_network',
        'use_external_api',
      ]);

      if (publicPool && publicPool.token_type === CONST.TOKEN_TYPE.MYSTERY_BOX) {
        const ntfService = new NFTOrderService();
        const orders = await ntfService.sumOrderAndRegistered(publicPool.id);
        let totalOrder = 0
        let totalRegistered = 0
        if (orders && orders.length > 0) {
          totalOrder = parseInt(orders[0]['sum(`amount`)'])
        }
        if (orders && orders.length > 0) {
          totalRegistered = parseInt(orders[0]['count(*)'])
        }
        publicPool.totalOrder = isNaN(totalOrder) ? 0 : totalOrder
        publicPool.totalRegistered = isNaN(totalRegistered) ? 0 : totalRegistered
      }

      if (pool.tiers && pool.tiers.length > 0) {
        publicPool.tiers = pool.tiers.map((item, index) => {
          return {
            ...item,
            min_buy: (new BigNumber(item.min_buy)).toNumber(),
            max_buy: (new BigNumber(item.max_buy)).toNumber(),
          }
        });
      }

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
    const limit = param.limit ? param.limit : 10;
    const page = param.page ? param.page : 1;
    param.limit = limit;
    param.page = page;
    param.is_search = true;
    console.log('Start Pool List with params: ', param);

    try {
      let listData = (new PoolService).buildSearchQuery(param).with('campaignClaimConfig');
      listData = listData.orderBy('id', 'DESC');
      listData = await listData.paginate(page, limit);

      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getTopPools({ request }) {
    const inputParams = request.all();
    const limit = inputParams.limit ? inputParams.limit : 10;
    const page = inputParams.page ? inputParams.page : 1;
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
    const limit = inputParams.limit ? inputParams.limit : 20;
    const page = inputParams.page ? inputParams.page : 1;
    inputParams.limit = limit;
    inputParams.page = page;
    inputParams.is_search = true;

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

  async getLatestPools({ request }) {
    const inputParams = request.all();
    console.log('[getLatestPools] - inputParams: ', inputParams);
    try {
      let listData = await (new PoolService).getLatestPools(inputParams);

      console.log('listData', listData);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Latest Pools Fail !!!');
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

  async getMysteriousBoxPoolsV3({ request }) {
    const inputParams = request.all();
    try {
      let listData = await (new PoolService).getMysteriousBoxPoolsV3(inputParams);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('getActivePoolsV3 Fail !!!');
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
      if (!file.tmpPath) {
        return HelperUtils.responseNotFound('File path not found');
      }

      const campaignUpdated = await CampaignModel.query().where('id', campaignId).first();
      if (!campaignUpdated) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await campaignUpdated.userBalanceSnapshots().delete();
      const wlService = new WhitelistService();
      await wlService.buildQueryBuilder({campaign_id: campaignId}).delete()

      csv.parseFile(file.tmpPath, {headers: false})
        .on("data", async (data) => {
          if (data.length < 2) {
            return
          }
          const wallet_address = data[0]
          let ticket = parseInt(data[1]) ?? 1
          ticket = isNaN(ticket) ? 1 : ticket

          try {
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
            await userSnapShot.save()

            let newWhitelist = new WhitelistUserModel();
            newWhitelist.wallet_address = wallet_address;
            newWhitelist.campaign_id = campaignId;
            newWhitelist.email = '';
            await newWhitelist.save();
          }catch (e) {}
        })
        .on("error", (e) => {
          console.log('error', e);
        })
        .on("end", async () => {});

      return HelperUtils.responseSuccess({message: 'upload successfully'});
    } catch (e) {
      return HelperUtils.responseErrorInternal('upload user Fail');
    }
  }

  async getTopBid({ request, auth, params }) {
    const inputParams = request.all();
    // TODO: For testing purpose
    const campaignId = params.campaignId;
    const wallet_address = inputParams.wallet_address;
    try {
      if (!await RedisUtils.checkExistTopBid(campaignId) || !wallet_address) {
        return {
          wallet_address: wallet_address,
          rank: -1,
          limit: 10,
          top: [],
        }
      }

      let dataStr = await RedisUtils.getRedisTopBid(campaignId)
      const data = JSON.parse(dataStr)
      let rank = -1;
      for (let index = 0; index < data.length; index++) {
        if (data[index].wallet_address.toLowerCase() === wallet_address.toLowerCase()) {
          rank = index + 1
          break
        }
      }

      return HelperUtils.responseSuccess({
        wallet_address: wallet_address,
        rank: rank,
        limit: data.length,
        top: data,
      });
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get public pool fail !');
    }
  }
}

module.exports = PoolController
