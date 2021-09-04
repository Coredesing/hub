'use strict'

const BigNumber = use('bignumber.js');
const pLimit = use('p-limit');
const moment = use('moment');

const CampaignModel = use('App/Models/Campaign');
const CampaignClaimConfigModel = use('App/Models/CampaignClaimConfig');
const TierModel = use('App/Models/Tier');
const WhitelistBannerSettingModel = use('App/Models/WhitelistBannerSetting');
const SocialNetworkSettingModel = use('App/Models/SocialNetworkSetting');
const CampaignSocialRequirementModel = use('App/Models/CampaignSocialRequirement');
const FreeBuyTimeSettingModel = use('App/Models/FreeBuyTimeSetting');
const Config = use('Config');
const Const = use('App/Common/Const');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');
const ConvertDateUtils = use('App/Common/ConvertDateUtils');
const WhitelistService = use('App/Services/WhitelistUserService');

const CONFIGS_FOLDER = '../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const CONTRACT_FACTORY_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGNFACTORY];

const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_FACTORY_ABI } = CONTRACT_FACTORY_CONFIGS.CONTRACT_DATA;

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
            .orWhere('token', 'like', '%' + params.title + '%')
            .orWhere('campaign_hash', 'like', '%' + params.title + '%');

          if ((params.title).toLowerCase() == Config.get('const.suspend')) {
            query.orWhere('is_pause', '=', 1)
          }
          if ((params.title).toLowerCase() == Config.get('const.active')) {
            query.orWhere('is_pause', '=', 0)
          }
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

    if (params.is_display === undefined) {
      builder = builder.where('is_display', '=', Const.POOL_DISPLAY.DISPLAY);
    } else {
      builder = builder.where('is_display', '=', params.is_display);
    }

    if (params.token_type) {
      builder = builder.where('token_type', params.token_type)
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
    const query = this.buildSearchQuery(params);
    query
      .whereHas('whitelistUsers', (builder) => {
        builder.where('wallet_address', walletAddress);
      }, '>', 0)
      .orWhereHas('winnerlistUsers', (builder) => {
        builder.where('wallet_address', walletAddress);
      }, '>', 0);
    return query;
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
          });
      })
      .orderBy('priority', 'DESC')
      .orderBy('start_time', 'ASC')
      .paginate(page, limit);
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

    const now = moment().unix();
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
    return pools;
  }

  async getCompleteSalePoolsV3(filterParams) {
    const limit = filterParams.limit ? filterParams.limit : 100000;
    const page = filterParams.page ? filterParams.page : 1;
    filterParams.limit = limit;
    filterParams.page = page;

    // Sample Filter SQL: CompleteSalePools
    // `actual_finish_time`: field will maintaining in /app/Tasks/UpdateClaimablePoolInformationTask
    // select *
    //   from `campaigns`
    //   where
    //     `is_display` = '1'
    //     and (`campaign_status` in ('Filled', 'Ended'))
    //     or (`campaign_status` = 'Claimable' and `actual_finish_time` < '1625336933')
    //     order by `priority` DESC, `finish_time` ASC
    //     limit 100000;

    const now = moment().unix();
    let pools = await this.buildQueryBuilder(filterParams)
      .with('campaignClaimConfig')
      .where(builder => {
        builder
          .where('campaign_status', Const.POOL_STATUS.ENDED)
          .orWhere(builder1 => {
            builder1
              .where('campaign_status', Const.POOL_STATUS.CLAIMABLE)
              .where('actual_finish_time', '<', now);
          });
      })
      .orderBy('priority', 'DESC')
      .orderBy('finish_time', 'DESC')
      .paginate(page, limit);

    return pools;
  }

  checkExist(campaignId) {

  }

  updatePoolAdmin() {

  }

  addDefaultClaimConfig(claim_configuration, default_datetime) {
    let claimConfigs = claim_configuration || [];
    if (claimConfigs.length == 0) {
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
      });
      return tierObj;
    });

    await campaign.campaignClaimConfig().delete();
    await campaign.campaignClaimConfig().saveMany(campaignClaimConfigs);
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
      && !data.partner_twitter && !data.partner_group && !data.partner_channel && !data.partner_retweet_post) {
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

      const status = await HelperUtils.getPoolStatusByPoolDetail(pool, tokenSold);
      console.log('[PoolService::updatePoolInformation]', pool.id, tokenSold, status);

      const lastTime = HelperUtils.getLastActualFinishTime(pool); // lastClaimConfig + 12h

      const dataUpdate = {
        token_sold: tokenSold,
        campaign_status: status,
      };
      if (lastTime) {
        dataUpdate.actual_finish_time = lastTime;
      }
      const result = await CampaignModel.query().where('id', pool.id).update(dataUpdate);
      RedisUtils.deleteRedisPoolDetail(pool.id);
    } catch (e) {
      console.log('[PoolService::updatePoolInformation] - ERROR: ', e);
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
    console.log('Campaign freeBuyTimeSetting:', freeBuyTimeSetting);
    let maxBonus = freeBuyTimeSetting && freeBuyTimeSetting.max_bonus;
    const startFreeBuyTime = freeBuyTimeSetting && freeBuyTimeSetting.start_buy_time;

    const current = ConvertDateUtils.getDatetimeNowUTC();
    let isFreeBuyTime = false;
    if (maxBonus && startFreeBuyTime) {
      console.log('startFreeBuyTime:', startFreeBuyTime);
      isFreeBuyTime = Number(startFreeBuyTime) < current;
      console.log('isFreeTime', isFreeBuyTime, current);
    }

    const campaignId = pool && pool.id;
    const whitelistService = new WhitelistService;
    const existWhitelist = await whitelistService.buildQueryBuilder({
      campaign_id: campaignId,
      wallet_address: walletAddress,
    }).first();
    // if (!existWhitelist && pool.token_type === Const.TOKEN_TYPE.ERC20) {
    //   isFreeBuyTime = false;
    //   maxBonus = 0;
    // }

    console.log('[PoolService::getFreeBuyTimeInfo] - isFreeBuyTime:', isFreeBuyTime, maxBonus, startFreeBuyTime);

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

    let pools = await this.buildQueryBuilder({})
      .where('token_type', token_type)
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

    return pools;
  }
}

module.exports = PoolService;
