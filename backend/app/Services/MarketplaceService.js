'use strict'

const MarketplaceCollectionModel = use('App/Models/MarketplaceCollection');
const LFWModel = use('App/Models/LFW_NFT')
const MarketplaceAcceptedToken = use('App/Models/MarketplaceAcceptedToken');
const MarketplaceNftEvent = use('App/Models/MarketplaceNFTListedEvent');
const RedisMarketplaceUtils = use('App/Common/RedisMarketplaceUtils');
const HelperUtils = use('App/Common/HelperUtils');
const axios = use('axios');

const SLUG_LFW = 'legend-of-fantasy-war'

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

    if (params.slug) {
      builder = builder.where('slug', params.slug)
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

    if (params.slug) {
      builder = builder.where('slug', params.slug)
    }

    if (params.finish !== null && params.finish !== undefined) {
      builder = builder.where('finish', params.finish)
    }

    if (params.start) {
      builder.where('dispatch_at', '>=', params.start)
    }

    if (params.end) {
      builder.where('dispatch_at', '<=', params.end)
    }

    return builder
  }

  // TODO: cached
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

  // TODO: cached
  async getSupportCollections(filterParams) {
    // if (await RedisMarketplaceUtils.existRedisMarketplaceSupportCollections()) {
    //   let data = await RedisMarketplaceUtils.getRedisMarketplaceSupportCollections()
    //   data = JSON.parse(data)
    //   return data
    // }

    let data = await this.buildQueryCollectionBuilder(filterParams).fetch()
    // data = JSON.parse(JSON.stringify(data))
    // await RedisMarketplaceUtils.setRedisMarketplaceSupportCollections(data)

    return data
  }

  async getCollectionBySlug(address) {
    if (await RedisMarketplaceUtils.existRedisMarketplaceCollectionDetail(address)) {
      let data = await RedisMarketplaceUtils.getRedisMarketplaceCollectionDetail(address)
      data = JSON.parse(data)
      return data
    }

    let data = await this.buildQueryCollectionBuilder({slug: address}).first()
    if (!data) {
      return
    }
    data = JSON.parse(JSON.stringify(data))

    let acceptedTokens = await MarketplaceAcceptedToken.query().whereIn('collection_id', [0, data.id]).fetch()
    acceptedTokens = JSON.parse(JSON.stringify(acceptedTokens))
    data.accepted_tokens = acceptedTokens

    await RedisMarketplaceUtils.setRedisMarketplaceCollectionDetail(address, data)

    return data
  }

  async getOffersOfNFT(address, id, filterParams) {
    filterParams = this.formatPaginate(filterParams)
    filterParams.token_id = id
    filterParams.slug = address
    filterParams.finish = false
    const data = await this.buildQueryNFTEventsBuilder(filterParams).fetch()
    return data
  }

  async getMyOffers(address, filterParams) {
    filterParams = this.formatPaginate(filterParams)
    filterParams.buyer = address
    filterParams.event_type = 'TokenOffered'
    filterParams.finish = false
    const data = await this.buildQueryNFTEventsBuilder(filterParams).fetch()
    return data
  }

  async getMyListings(address, filterParams) {
    filterParams = this.formatPaginate(filterParams)
    filterParams.seller = address
    filterParams.event_type = 'TokenListed'
    filterParams.finish = false
    const data = await this.buildQueryNFTEventsBuilder(filterParams).fetch()
    return data
  }

  async getMyNFT(slug, filterParams) {
    filterParams = this.formatPaginate(filterParams)
    let query = null

    switch (slug) {
      case SLUG_LFW:
        query = LFWModel.query()
          .where('to', filterParams.wallet)
          .where('owner', 1)
          .select('token_id')
        break;
      default:
        return null
    }

    const data = await query.paginate(filterParams.page, filterParams.limit)
    return data
  }

  async getMyNFTByAddress(address, filterParams) {
    filterParams = this.formatPaginate(filterParams)
    let query = null

    switch (address) {
      case process.env.LFW_SMART_CONTRACT:
        query = LFWModel.query()
          .where('to', filterParams.wallet)
          .where('owner', 1)
          .select('token_id')
        break;
      default:
        return null
    }

    const data = await query.paginate(filterParams.page, filterParams.limit)
    return data
  }

  async getDiscoverableCollections(filterParams) {
    filterParams = this.formatPaginate(filterParams)
    if (!filterParams?.event_type) {
      filterParams.event_type = 'TokenListed'
    }
    filterParams.finish = false


    let order = filterParams.sort_by || 'dispatch_at'
    let by = filterParams.sort_desc === 'false' ? 'ASC' : 'DESC'

    const data = await this.buildQueryNFTEventsBuilder(filterParams)
      .orderBy(order, by)
      .paginate(filterParams.page, filterParams.limit);
    return data
  }

  // TODO: cached
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

  async getNFTInfo(address, id) {
    // TODO: filter whitelist address
    const uri = await HelperUtils.getTokenURI({address: address, id: id})
    if (!uri) {
      return
    }

    return await axios.get(uri).then((response) => {
      if (!response || !response.data) {
        return
      }
      return response.data
    }).catch((error) => {})
  }

  async getCollectionItems(address, filterParams) {
    // TODO: filter whitelist address
    filterParams = this.formatPaginate(filterParams)
    if (!filterParams?.event_type) {
      filterParams.event_type = 'TokenListed'
    }
    filterParams.finish = 0
    filterParams.slug = address

    let order = filterParams.sort_by || 'dispatch_at'
    let by = filterParams.sort_desc === 'false' ? 'ASC' : 'DESC'
    
    let data = await this.buildQueryNFTEventsBuilder(filterParams)
      .orderBy(order, by)
      .paginate(filterParams.page, filterParams.limit);

    return data
  }

  async getCollectionActivities(address, filterParams) {
    // TODO: filter whitelist address
    filterParams = this.formatPaginate(filterParams)
    filterParams.slug = address

    let order = filterParams.sort_by || 'dispatch_at'
    let by = filterParams.sort_desc === 'false' ? 'ASC' : 'DESC'

    let data = await this.buildQueryNFTEventsBuilder(filterParams)
      .orderBy(order, by)
      .paginate(filterParams.page, filterParams.limit);

    return data
  }

  async getActivities(filterParams) {
    // TODO: filter whitelist address
    filterParams = this.formatPaginate(filterParams)

    let order = filterParams.sort_by || 'dispatch_at'
    let by = filterParams.sort_desc === 'false' ? 'ASC' : 'DESC'

    let data = await this.buildQueryNFTEventsBuilder(filterParams)
      .orderBy(order, by)
      .paginate(filterParams.page, filterParams.limit);

    return data
  }

  async getHotOffers(filterParams) {
    filterParams = this.formatPaginate(filterParams)
    filterParams.event_type = 'TokenListed'
    filterParams.finish = 0

    let data = await this.buildQueryNFTEventsBuilder(filterParams)
      .orderBy('highest_offer', 'DESC')
      .orderBy('dispatch_at', 'DESC')
      .whereNotNull('highest_offer')
      .paginate(filterParams.page, filterParams.limit);

    return data
  }

  formatPaginate(filterParams) {
    if (!filterParams) {
      filterParams = {}
    }

    if (!filterParams.limit || isNaN(filterParams.limit) || filterParams.limit < 1) {
      filterParams.limit = 10
    }

    if (filterParams.limit >= 20) {
      filterParams.limit = 20
    }

    if (!filterParams.page || isNaN(filterParams.page) || filterParams.page < 0) {
      filterParams.page = 1
    }

    return filterParams
  }

  async setCollection(param, isUpdate, id) {
    let collection = new MarketplaceCollectionModel()
    if (isUpdate) {
      collection = await MarketplaceCollectionModel.find(id)
    }

    collection.token_address = param?.token_address
    collection.name = param?.name
    collection.description = param?.description
    collection.logo = param?.logo
    collection.banner = param?.banner
    collection.image = param?.image
    collection.default_image = param?.default_image
    collection.website = param?.website
    collection.telegram = param?.telegram
    collection.twitter = param?.twitter
    collection.medium = param?.medium
    collection.type = param?.type
    collection.is_show = param?.is_show
    collection.priority = param?.priority
    collection.network = param?.network
    collection.use_external_uri = param?.use_external_uri
    collection.slug = param?.slug

    await collection.save();
    // delete cache here
    await RedisMarketplaceUtils.deleteRedisMarketplaceTopCollections()
    await RedisMarketplaceUtils.deleteRedisMarketplaceCollectionDetail(params?.token_address)
    return collection;
  }
}

module.exports = MarketplaceService;
