'use strict'

const BigNumber = use('bignumber.js');
const pLimit = use('p-limit');
const moment = use('moment');

const CampaignModel = use('App/Models/Campaign');
const CampaignClaimConfigModel = use('App/Models/CampaignClaimConfig');
const SeriesContentModel = use('App/Models/SeriesContent');
const BoxTypesModel = use('App/Models/BoxType');
const AcceptedTokenModel = use('App/Models/AcceptedToken');
const TierModel = use('App/Models/Tier');
const WhitelistBannerSettingModel = use('App/Models/WhitelistBannerSetting');
const SocialNetworkSettingModel = use('App/Models/SocialNetworkSetting');
const CampaignSocialRequirementModel = use('App/Models/CampaignSocialRequirement');
const FreeBuyTimeSettingModel = use('App/Models/FreeBuyTimeSetting');
const Const = use('App/Common/Const');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');
const RedisMysteriousBoxUtils = use('App/Common/RedisMysteriousBoxUtils');
const ConvertDateUtils = use('App/Common/ConvertDateUtils');
const WhitelistService = use('App/Services/WhitelistUserService');
const NFTOrderService = use('App/Services/NFTOrderService');

class PoolService {
  buildQueryBuilder(params) {
    let builder = CampaignModel.query();

    if (params.id) {
      builder = builder.where('id', params.id);
    }

    if (params.title) {
      if (params.is_search) {
        builder = builder.where(query => {
          query.where('title', 'like', '%' + params.title + '%')
            .orWhere('symbol', 'like', '%' + params.title + '%')
        })
      } else {
        builder = builder.where('title', params.title);
      }
    }

    if (params.start_time && !params.finish_time) {
      builder = builder.where('start_time', '>=', params.start_time)
    }
    if (params.finish_time && !params.start_time) {
      builder = builder.where('finish_time', '<=', params.finish_time)
    }
    if (params.finish_time && params.start_time) {
      builder = builder.where('finish_time', '<=', params.finish_time)
        .where('start_time', '>=', params.start_time)
    }
    if (params.registed_by) {
      builder = builder.where('registed_by', '=', params.registed_by)
    }

    // if (params.is_display === undefined) {
    //   builder = builder.where('is_display', '=', Const.POOL_DISPLAY.DISPLAY);
    // } else {
    //   builder = builder.where('is_display', '=', params.is_display);
    // }

    if (params.token_type) {
      builder = builder.where('token_type', params.token_type)
    }

    if (params.is_private) {
      builder = builder.where('is_private', params.is_private)
    }

    if(params.network_available) {
      builder = builder.where('network_available', params.network_available)
    }

    return builder;
  }

  buildSearchQuery(params) {
    return this.buildQueryBuilder({
      ...params,
      is_search: true,
    })
  }

  getPoolWithTiers(filterParams) {
    const pool = this.buildQueryBuilder(filterParams).with('tiers').with('campaignClaimConfig').first();
    return pool;
  }

  getJoinedPools(walletAddress, params) {
    let query = this.buildSearchQuery(params);
    query = query.where(query => {
      query.whereHas('whitelistUsers', (builder) => {
        builder.where('wallet_address', walletAddress);
      }, '>', 0)
        .orWhereHas('winnerlistUsers', (builder) => {
          builder.where('wallet_address', walletAddress);
        }, '>', 0);
    })

    if (params.type === Const.POOL_IS_PRIVATE.PUBLIC.toString() ||
      params.type === Const.POOL_IS_PRIVATE.PRIVATE.toString() ||
      params.type === Const.POOL_IS_PRIVATE.SEED.toString()) {
      query = query.where('is_private', params.type);
    }

    return query
  }

  async getUpcomingPools(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : Const.DEFAULT_LIMIT
    const page = filterParams.page ? filterParams.page : 1
    filterParams.limit = limit
    filterParams.page = page

    let pools = await this.buildQueryBuilder(filterParams)
      .whereNotIn('campaign_status', [
        Const.POOL_STATUS.CLAIMABLE,
        Const.POOL_STATUS.ENDED,
      ])
      .orderBy('start_join_pool_time', 'DESC')
      .orderBy('priority', 'DESC')
      .orderBy('id', 'DESC')
      .paginate(page, limit);

    return pools;
  }

  async getFeaturedPools(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : Const.DEFAULT_LIMIT;
    const page = filterParams.page ? filterParams.page : 1;
    filterParams.limit = limit;
    filterParams.page = page;

    let pools = await this.buildQueryBuilder(filterParams)
      .whereIn('campaign_status', [
        Const.POOL_STATUS.CLAIMABLE,
        Const.POOL_STATUS.ENDED,
      ])
      .orderBy('priority', 'DESC')
      .orderBy('id', 'DESC')
      .paginate(page, limit);

    return pools;
  }

  /**
   * API Pool List V3
   */
  async getActivePoolsV3(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : 100000;
    const page = filterParams.page ? filterParams.page : 1;
    filterParams.limit = limit;
    filterParams.page = page;

    // Sample SQL
    // select *
    //   from `campaigns`
    //     where
    //       `is_display` = '1'
    //       and (
    //           `campaign_status` in ('Filled', 'Swap')
    //         or (`campaign_status` = 'Claimable' and `actual_finish_time` > 1625339367)
    //       )
    //     order by `priority` DESC, `start_time` ASC
    //     limit 100000;

    const now = moment().unix();
    let pools = await this.buildQueryBuilder(filterParams)
      .with('campaignClaimConfig')
      // .where('start_time', '<=', now)
      // .where('finish_time', '>', now)
      .where(builder => {
        builder
          .whereIn('campaign_status', [
            Const.POOL_STATUS.FILLED,
            Const.POOL_STATUS.SWAP,
          ])
          .orWhere(builderClaim => {
            builderClaim
              .where('campaign_status', Const.POOL_STATUS.CLAIMABLE)
              .where('actual_finish_time', '>', now)
          })
          .where('is_display', Const.POOL_DISPLAY.DISPLAY)
      })
      .orderBy('priority', 'DESC')
      .orderBy('start_time', 'ASC')
      .paginate(page, limit);
    return pools;
  }

  async getMysteriousBoxPoolsV3(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : 20;
    const page = filterParams.page ? filterParams.page : 1;
    filterParams.limit = limit;
    filterParams.page = page;

    if (!filterParams.title && !filterParams.network_available && !filterParams.campaign_status && await RedisMysteriousBoxUtils.existRedisMysteriousBoxes(filterParams)) {
      console.log('existed')
      let data = await RedisMysteriousBoxUtils.getRedisMysteriousBoxes(filterParams)
      data = JSON.parse(data)
      return data
    }

    let pools = await this.buildQueryBuilder(filterParams)
      .orderBy('priority', 'DESC')
      .orderBy('start_time', 'ASC')
      .where('is_display', 1)
      .paginate(page, limit)

    pools = JSON.parse(JSON.stringify(pools))
    await RedisMysteriousBoxUtils.setRedisMysteriousBoxes(filterParams, pools)

    return pools;
  }

  async getNextToLaunchPoolsV3(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : 100000;
    const page = filterParams.page ? filterParams.page : 1;
    filterParams.limit = limit;
    filterParams.page = page;

    const now = moment().unix();
    let pools = await this.buildQueryBuilder(filterParams)
      .with('campaignClaimConfig')
      // .where('start_join_pool_time', '<', now)
      .where('end_join_pool_time', '<', now)
      .whereIn('campaign_status', [
        Const.POOL_STATUS.UPCOMING,
      ])
      .orderBy('priority', 'DESC')
      .orderBy('start_time', 'ASC')
      .paginate(page, limit);
    return pools;
  }

  async getUpcomingPoolsV3(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : 100000;
    const page = filterParams.page ? filterParams.page : 1;

    filterParams.limit = limit;
    filterParams.page = page;

    if (await RedisUtils.checkExistRedisUpcomingPools(page, filterParams.is_private)) {
      const cachedPools = await RedisUtils.getRedisUpcomingPools(page, filterParams.is_private)
      return JSON.parse(cachedPools)
    }

    // const now = moment().unix();
    let pools = await this.buildQueryBuilder(filterParams)
      .with('campaignClaimConfig')
      .where('is_display', Const.POOL_DISPLAY.DISPLAY)
      .whereIn('campaign_status', [
        Const.POOL_STATUS.TBA,
        Const.POOL_STATUS.UPCOMING,
      ])
      .orderBy('priority', 'DESC')
      .orderBy('start_join_pool_time', 'ASC')
      .paginate(page, limit);

    // cache data
    if (page <= 2) {
      await RedisUtils.createRedisUpcomingPools(page, filterParams.is_private, pools)
    }
    return pools;
  }

  async getCompleteSalePoolsV3(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : 20;
    const page = filterParams.page ? filterParams.page : 1;
    filterParams.limit = limit;
    filterParams.page = page;
    if (filterParams.limit > 20) {
      filterParams.limit = 20
    }

    if (await RedisUtils.checkExistRedisCompletedPools(page)) {
      const cachedPools = await RedisUtils.getRedisCompletedPools(page)
      return JSON.parse(cachedPools)
    }

    let pools = await this.buildQueryBuilder(filterParams)
      .where('campaign_status', Const.POOL_STATUS.ENDED)
      .orderBy('priority', 'DESC')
      .orderBy('finish_time', 'DESC')
      .paginate(page, limit);

    // cache data
    if (page <= 2) {
      await RedisUtils.createRedisCompletedPools(page, pools)
    }
    return pools;
  }

  addDefaultClaimConfig(claim_configuration, default_datetime) {
    let claimConfigs = claim_configuration || [];
    if (claimConfigs.length === 0) {
      claimConfigs = [{
        minBuy: 0,
        maxBuy: 100,
        endTime: null,
        startTime: default_datetime,
      }];
    }
    return claimConfigs;
  }

  async updateClaimConfig(campaign, claim_configuration) {
    const campaignClaimConfigs = claim_configuration.map((item, index) => {
      const tierObj = new CampaignClaimConfigModel();
      tierObj.fill({
        start_time: item.startTime,
        end_time: item.endTime,
        min_percent_claim: new BigNumber(item.minBuy || 0).toFixed(),
        max_percent_claim: new BigNumber(item.maxBuy || 0).toFixed(),
        claim_type: item.claimType,
        claim_url: item.claimUrl
      });
      return tierObj;
    });

    await campaign.campaignClaimConfig().delete();
    await campaign.campaignClaimConfig().saveMany(campaignClaimConfigs);
  }

  async updateSeriesContentConfig(campaign, seriesContents) {
    const seriesContentConfig = seriesContents.map((item) => {
      const data = new SeriesContentModel();
      data.fill({
        name: item.name,
        amount: item.amount,
        rate: item.rate,
        icon: item.icon,
        banner: item.banner,
        video: item.video,
        description: item.description,
      });
      return data;
    });

    await campaign.seriesContentConfig().delete();
    await campaign.seriesContentConfig().saveMany(seriesContentConfig);
  }

  async updateBoxTypesConfig(campaign, boxTypes) {
    const boxTypesConfig = boxTypes.map((item) => {
      const data = new BoxTypesModel();
      data.fill({
        name: item.name,
        limit: item.limit,
        icon: item.icon,
        banner: item.banner,
        image: item.image,
        description: item.description,
        currency_ids: item.currency_ids
      });
      return data;
    });

    await campaign.boxTypesConfig().delete();
    await campaign.boxTypesConfig().saveMany(boxTypesConfig);
  }

  async updateAcceptedTokensConfig(campaign, acceptedTokens) {
    const acceptedTokensConfig = acceptedTokens.map((item) => {
      const data = new AcceptedTokenModel();
      data.fill({
        name: item.name,
        address: item.address,
        icon: item.icon,
        price: item.price,
      });
      return data;
    });

    await campaign.acceptedTokensConfig().delete();
    await campaign.acceptedTokensConfig().saveMany(acceptedTokensConfig);
  }

  async updateTierConfig(campaign, tier_configuration) {
    const tiers = tier_configuration.map((item, index) => {
      const tierObj = new TierModel();
      tierObj.fill({
        level: index,
        name: item.name,
        // start_time: moment.utc(item.startTime).unix(),
        // end_time: moment.utc(item.endTime).unix(),
        start_time: item.startTime,
        end_time: item.endTime,

        min_buy: new BigNumber(item.minBuy || 0).toFixed(),
        max_buy: new BigNumber(item.maxBuy || 0).toFixed(),
        ticket_allow_percent: new BigNumber(item.ticket_allow_percent || 0).toFixed(),
        ticket_allow: new BigNumber(item.ticket_allow || 0).toFixed(),
        currency: item.currency,
      });
      return tierObj;
    });
    await campaign.tiers().delete();
    await campaign.tiers().saveMany(tiers);

    console.log('inputParams.tier_configuration', JSON.stringify(tiers));
  }

  async updateWhitelistSocialRequirement(campaign, data) {
    if (!data.self_twitter && !data.self_group && !data.self_channel && !data.self_retweet_post
      && !data.partner_twitter && !data.partner_group && !data.partner_channel && !data.partner_retweet_post && !data.gleam_link) {
      await campaign.socialRequirement().delete();
      console.log('WhitelistSocialRequirement cleared', data);
      return true;
    }

    const requirement = new CampaignSocialRequirementModel();
    requirement.fill(data);
    console.log('[updateWhitelistSocialRequirement] - updating', JSON.stringify(requirement));
    await campaign.socialRequirement().delete();
    await campaign.socialRequirement().save(requirement);

    console.log('WhitelistSocialRequirement updated', JSON.stringify(requirement));
  }

  async updateWhitelistBannerSetting(campaign, data) {
    if (!data.guide_link && !data.whitelist_link && !data.announcement_time) {
      await campaign.whitelistBannerSetting().delete();
      console.log('WhitelistBannerSetting Clear', data);
      return true;
    }

    const setting = new WhitelistBannerSettingModel();
    setting.fill(data);
    console.log('[updateWhitelistBannerSetting] - setting', JSON.stringify(setting));
    await campaign.whitelistBannerSetting().delete();
    await campaign.whitelistBannerSetting().save(setting);

    console.log('WhitelistBannerSetting Setting', JSON.stringify(setting));
  }

  async updateSocialNetworkSetting(campaign, data) {
    const setting = new SocialNetworkSettingModel();
    setting.fill(data);

    console.log('[updateSocialNetworkSetting] - setting', JSON.stringify(setting));
    await campaign.socialNetworkSetting().delete();
    await campaign.socialNetworkSetting().save(setting);

    console.log('SocialNetwork Setting', JSON.stringify(setting));
  }

  async updateFreeBuyTimeSetting(campaign, data) {
    const setting = new FreeBuyTimeSettingModel();
    setting.fill(data);

    console.log('[updateSocialNetworkSetting] - setting', JSON.stringify(setting));
    await campaign.freeBuyTimeSetting().delete();
    await campaign.freeBuyTimeSetting().save(setting);

    console.log('FreeBuyTime Setting', JSON.stringify(setting));
  }

  async getPoolRedisCache(poolId) {
    try {
      if (await RedisUtils.checkExistRedisPoolDetail(poolId)) {
        const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(poolId);
        console.log('[getPoolRedisCache] - Exist cache data Public Pool Detail: ', cachedPoolDetail);
        if (cachedPoolDetail) {
          return JSON.parse(cachedPoolDetail);
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async getPoolById(poolId, byCache = true) {
    // if (byCache) {
    //   let pool = await this.getPoolRedisCache(poolId);
    //   if (pool) {
    //     return pool;
    //   }
    // }

    const pool = await CampaignModel.query().where('id', poolId).first();
    return pool;
  };

  async getPoolWithFreeBuySettingById(poolId) {
    if (await RedisUtils.checkExistRedisPoolDetail(poolId)) {
      let cachedPoolDetail = await RedisUtils.getRedisPoolDetail(poolId);
      if (cachedPoolDetail) {
        return JSON.parse(cachedPoolDetail);
      }
    }

    const pool = await CampaignModel.query().where('id', poolId).with('freeBuyTimeSetting').first();
    return JSON.parse(JSON.stringify(pool));
  };

  async checkPoolExist(poolId) {
    const pool = this.getPoolById(poolId);
    return !!pool;
  };

  /**
   * Task Update Pool Status / Token Sold
   */
  async filterPoolClaimable() {
    let pools = await CampaignModel.query()
      .where('campaign_status', Const.POOL_STATUS.CLAIMABLE)
      .with('campaignClaimConfig')
      .orderBy('id', 'DESC')
      .fetch();
    pools = JSON.parse(JSON.stringify(pools));
    return pools;
  }

  async filterActivePoolWithStatus() {
    let pools = await CampaignModel.query()
      .whereNotIn('campaign_status', [
        Const.POOL_STATUS.ENDED,
        Const.POOL_STATUS.CLAIMABLE
      ])
      .with('campaignClaimConfig')
      .orderBy('id', 'DESC')
      .fetch();
    pools = JSON.parse(JSON.stringify(pools));

    console.log('[filterPoolWithStatus] - pools.length:', pools.length);

    return pools;
  }

  async filterActiveTopBidPool() {
    let pools = await CampaignModel.query()
      .whereNotIn('campaign_status', [
        Const.POOL_STATUS.ENDED,
        Const.POOL_STATUS.CLAIMABLE
      ])
      .where('process', Const.PROCESS.ONLY_STAKE)
      .orderBy('id', 'DESC')
      .fetch();
    pools = JSON.parse(JSON.stringify(pools));

    console.log('[filterActiveTopBidPool] - pools.length:', pools.length);

    return pools;
  }

  async runUpdatePoolStatus() {
    const pools = await this.filterActivePoolWithStatus();
    const limit = pLimit(10);
    await Promise.all(
      pools.map(async pool => {
        return limit(async () => {
          this.updatePoolInformation(pool);
        })
      })
    ).then((res) => {
      console.log('[runUpdatePoolStatus] - Finish');
    }).catch((e) => {
      console.log('[runUpdatePoolStatus] - ERROR: ', e);
    });

    return pools;
  }

  async updatePoolInformation(pool) {
    try {
      const tokenSold = await HelperUtils.getTokenSoldSmartContract(pool);

      const data = await HelperUtils.getPoolStatusByPoolDetail(pool, tokenSold);
      console.log('[PoolService::updatePoolInformation]', pool.id, data.tokenSold, data.status);

      const lastTime = HelperUtils.getLastActualFinishTime(pool); // lastClaimConfig + 12h

      const dataUpdate = {
        token_sold: data.tokenSold || tokenSold,
        campaign_status: data.status,
      };

      // update actual finish time
      if (lastTime) {
        dataUpdate.actual_finish_time = lastTime;
      }

      // update priority
      if (data.status === Const.POOL_STATUS.ENDED) {
        dataUpdate.priority = 0

        if (data.token_type === 'box') {
          await RedisMysteriousBoxUtils.deleteAllRedisMysteriousBoxes();
        }
      }

      await CampaignModel.query().where('id', pool.id).update(dataUpdate);
      if (pool && pool.token_type === Const.TOKEN_TYPE.MYSTERY_BOX && data.status === Const.POOL_STATUS.UPCOMING) {
        let cachedPoolDetail = await RedisUtils.getRedisPoolDetail(pool.id);
        cachedPoolDetail = JSON.parse(cachedPoolDetail)
        const ntfService = new NFTOrderService();
        const orders = await ntfService.sumOrderAndRegistered(pool.id);
        let totalOrder = 0
        let totalRegistered = 0
        if (orders && orders.length > 0) {
          totalOrder = parseInt(orders[0]['sum(`amount`)'])
        }
        if (orders && orders.length > 0) {
          totalRegistered = parseInt(orders[0]['count(*)'])
        }
        cachedPoolDetail.totalOrder = isNaN(totalOrder) ? 0 : totalOrder
        cachedPoolDetail.totalRegistered = isNaN(totalRegistered) ? 0 : totalRegistered
        await RedisUtils.createRedisPoolDetail(pool.id, cachedPoolDetail)
        return
      }

      if (await RedisUtils.checkExistRedisPoolDetail(pool.id)) {
        let cachedPoolDetail = await RedisUtils.getRedisPoolDetail(pool.id);
        cachedPoolDetail = JSON.parse(cachedPoolDetail)
        cachedPoolDetail.token_sold = data.tokenSold
        cachedPoolDetail.campaign_status = data.status
        if (lastTime) {
          cachedPoolDetail.actual_finish_time = lastTime
        }
        if (data.status === Const.POOL_STATUS.ENDED) {
          cachedPoolDetail.priority = 0
        }
        await RedisUtils.createRedisPoolDetail(pool.id, cachedPoolDetail)
      }
    } catch (e) {
      if (pool && pool.id) {
        await RedisUtils.deleteRedisPoolDetail(pool.id);
      }
      console.log('[PoolService::updatePoolInformation] - ERROR: ', e);
    } finally {
      // Clear cache
      RedisUtils.deleteAllRedisUpcomingPools([1, 2])
      RedisUtils.deleteAllRedisPoolByTokenType([1, 2])
    }
  }

  async runUpdatePoolClaimableStatus() {
    const pools = await this.filterPoolClaimable();
    const limit = pLimit(10);
    await Promise.all(
      pools.map(async pool => {
        return limit(async () => {
          this.updatePoolInformation(pool);
        })
      })
    ).then((res) => {
      console.log('[runUpdatePoolStatus] - Finish');
    }).catch((e) => {
      console.log('[runUpdatePoolStatus] - ERROR: ', e);
    });

    return pools;
  }

  /**
   * Free Buy Time
   */
  async getFreeBuyTimeInfo(pool, walletAddress) {
    if (!pool) {
      return {
        maxBonus: 0,
        isFreeBuyTime: false,
        existWhitelist: null,
      }
    }
    const freeBuyTimeSetting = JSON.parse(JSON.stringify(pool)).freeBuyTimeSetting;
    let maxBonus = freeBuyTimeSetting && freeBuyTimeSetting.max_bonus;
    const startFreeBuyTime = freeBuyTimeSetting && freeBuyTimeSetting.start_buy_time;

    const current = ConvertDateUtils.getDatetimeNowUTC();
    let isFreeBuyTime = false;
    if (startFreeBuyTime) {
      isFreeBuyTime = Number(startFreeBuyTime) < current;
    }

    const campaignId = pool && pool.id;
    const whitelistService = new WhitelistService;
    const existWhitelist = await whitelistService.buildQueryBuilder({
      campaign_id: campaignId,
      wallet_address: walletAddress,
    }).first();
    if (!existWhitelist) {
      // isFreeBuyTime = false;
      maxBonus = 0;
    }

    return {
      maxBonus,
      startFreeBuyTime,
      isFreeBuyTime,
      existWhitelist,
    };
  }

  async getPoolByTokenType(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : 5;
    const page = filterParams.page ? filterParams.page : 1;
    const token_type = filterParams.token_type ? filterParams.token_type : 'erc20'

    // if (await RedisUtils.checkExistRedisPoolByTokenType(page)) {
    //   const cachedPools = await RedisUtils.getRedisPoolByTokenType(page)
    //   return JSON.parse(cachedPools)
    // }

    let pools = await this.buildQueryBuilder({})
      .where('token_type', token_type)
      .where('is_display', 1)
      .whereIn('campaign_status', [
        Const.POOL_STATUS.TBA,
        Const.POOL_STATUS.UPCOMING,
        Const.POOL_STATUS.FILLED,
        Const.POOL_STATUS.SWAP,
        Const.POOL_STATUS.CLAIMABLE,
      ])
      .orderBy('priority', 'DESC')
      .orderBy('campaign_status', 'DESC')
      .orderBy('start_join_pool_time', 'DESC')
      .orderBy('id', 'DESC')
      .paginate(page, limit);

    if (token_type === 'erc20' && page <= 2) {
      await RedisUtils.createRedisPoolByTokenType(filterParams.page, pools)
    }
    return pools;
  }
}

module.exports = PoolService;
