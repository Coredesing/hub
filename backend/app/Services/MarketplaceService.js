'use strict'

const MarketplaceCollectionModel = use('App/Models/MarketplaceCollection');
const MarketplaceNftEvent = use('App/Models/MarketplaceNFTListedEvent');
const RedisMarketplaceUtils = use('App/Common/RedisMarketplaceUtils');

class MarketplaceService {
  buildQueryCollectionBuilder(params) {
    let builder = MarketplaceCollectionModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }

    if (params.token_address) {
      builder = builder.where('token_address', params.token_address)
    }

    if (params.is_show === undefined) {
      builder = builder.where('is_show', true);
    } else {
      builder = builder.where('is_show', params.is_show);
    }

    if (params.type) {
      builder = builder.where('type', params.type)
    }

    return builder
  }

  buildQueryNFTEventsBuilder(params) {
    let builder = MarketplaceNftEvent.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }

    if (params.token_address) {
      builder = builder.where('token_address', params.token_address)
    }

    if (params.buyer) {
      builder = builder.where('buyer', params.buyer)
    }

    if (params.seller) {
      builder = builder.where('seller', params.seller)
    }

    if (params.currency) {
      builder = builder.where('currency', params.currency)
    }

    if (params.token_id) {
      builder = builder.where('token_id', params.token_id)
    }

    if (params.event_type) {
      builder = builder.where('event_type', params.event_type)
    }

    return builder
  }

  async getTopCollections(filterParams) {
    if (await RedisMarketplaceUtils.existRedisMarketplaceTopCollections()) {
      let data = await RedisMarketplaceUtils.getRedisMarketplaceTopCollections()
      data = JSON.parse(data)
      return data
    }

    filterParams = this.formatPaginate(filterParams)
    let data = await this.buildQueryCollectionBuilder(filterParams)
      .orderBy('priority', 'DESC')
      .paginate(filterParams.page, filterParams.limit);

    data = JSON.parse(JSON.stringify(data))
    await RedisMarketplaceUtils.setRedisMarketplaceTopCollections(data)

    return data
  }

  async getSupportCollections(filterParams) {
    if (await RedisMarketplaceUtils.existRedisMarketplaceSupportCollections()) {
      let data = await RedisMarketplaceUtils.getRedisMarketplaceSupportCollections()
      data = JSON.parse(data)
      return data
    }

    let data = await this.buildQueryCollectionBuilder(filterParams)
    data = JSON.parse(JSON.stringify(data))
    await RedisMarketplaceUtils.setRedisMarketplaceSupportCollections(data)

    return data
  }

  async getCollectionById(id) {
    if (await RedisMarketplaceUtils.existRedisMarketplaceCollectionDetail(id)) {
      let data = await RedisMarketplaceUtils.getRedisMarketplaceCollectionDetail()
      data = JSON.parse(data)
      return data
    }

    let data = await this.buildQueryCollectionBuilder({id: id}).first()
    if (!data) {
      return
    }

    data = JSON.parse(JSON.stringify(data))
    await RedisMarketplaceUtils.setRedisMarketplaceCollectionDetail(id, data)

    return data
  }

  async getEvents(filterParams) {
    // if (await RedisMarketplaceUtils.existRedisMarketplaceTopCollections()) {
    //   let data = await RedisMarketplaceUtils.getRedisMarketplaceTopCollections()
    //   data = JSON.parse(data)
    //   return data
    // }

    filterParams = this.formatPaginate(filterParams)
    let data = await this.buildQueryNFTEventsBuilder(filterParams)
      .orderBy('dispatch_at', 'DESC')
      .paginate(filterParams.page, filterParams.limit);

    return data
  }

  formatPaginate(filterParams) {
    if (!filterParams.limit || isNaN(filterParams.limit) || filterParams.limit < 1 || filterParams.limit > 10) {
      filterParams.limit = 10
    }

    if (!filterParams.page || isNaN(filterParams.page) || filterParams.page < 0) {
      filterParams.page = 1
    }

    return filterParams
  }
}

module.exports = MarketplaceService;
