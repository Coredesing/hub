'use strict'

const HelperUtils = use('App/Common/HelperUtils');
const MarketplaceService = use('App/Services/MarketplaceService');
const MarketplaceCollections = use('App/Models/MarketplaceCollections');
const RedisMarketplaceUtils = use('App/Common/RedisMarketplaceUtils');

class MarketplaceController {
  async getCollections({ request }) {
    try {
      const inputParams = request.all();
      let data = await (new MarketplaceService).getTopCollections(inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  // filters: event_type
  async getHotOffers({ request }) {
    try {
      const inputParams = request.all();
      let data = await (new MarketplaceService).getHotOffers(inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  // TODO:
  async discover({ request }) {
    try {
      const inputParams = request.all();
      let data = await (new MarketplaceService).getDiscoverableCollections(inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getCollection({ request, auth, params }) {
    const address = params.address;
    if (!address) {
      return HelperUtils.responseNotFound();
    }

    try {
      let data = await (new MarketplaceService).getCollectionBySlug(address);
      if (!data) {
        return HelperUtils.responseNotFound()
      }

      return HelperUtils.responseSuccess(data)
    } catch (e) {
      return HelperUtils.responseErrorInternal()
    }
  }

  async getCollectionItems({ request, auth, params }) {
    try {
      const address = params.address;
      if (!address) {
        return HelperUtils.responseNotFound();
      }

      const inputParams = request.all();

      let data = await (new MarketplaceService).getCollectionItems(address, inputParams);
      if (!data) {
        return HelperUtils.responseNotFound()
      }
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getCollectionActivities({ request, auth, params }) {
    try {
      const address = params.address;
      if (!address) {
        return HelperUtils.responseNotFound();
      }

      const inputParams = request.all();

      let data = await (new MarketplaceService).getCollectionActivities(address, inputParams);
      if (!data) {
        return HelperUtils.responseNotFound()
      }
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getActivities({ request, auth, params }) {
    try {
      const inputParams = request.all();

      let data = await (new MarketplaceService).getActivities(inputParams);
      if (!data) {
        return HelperUtils.responseNotFound()
      }
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  // filters: type
  async getSupportCollections({ request }) {
    try {
      const inputParams = request.all();
      let data = await (new MarketplaceService).getSupportCollections(inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getOffersOfNFT({ request, auth, params }) {
    const address = params.address;
    const id = params.id;
    const inputParams = request.all();

    try {
      let data = await (new MarketplaceService).getOffersOfNFT(address, id, inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getMyOffers({ request, auth, params }) {
    const address = params.address;
    const inputParams = request.all();

    try {
      let data = await (new MarketplaceService).getMyOffers(address, inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getMyListings({ request, auth, params }) {
    const address = params.address;
    const inputParams = request.all();

    try {
      let data = await (new MarketplaceService).getMyListings(address, inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getMyNFT({ request, auth, params }) {
    const slug = params.slug;
    const inputParams = request.all();

    try {
      let data = await (new MarketplaceService).getMyNFT(slug, inputParams);
      if (!data) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getMyNFTByAddress({ request, auth, params }) {
    const address = params.address;
    const inputParams = request.all();

    try {
      let data = await (new MarketplaceService).getMyNFTByAddress(address, inputParams);
      if (!data) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getNFTInfo({ request, auth, params }) {
    const address = params.address;
    const id = params.id;

    try {
      const data = await (new MarketplaceService).getNFTInfo(address, id);
      if (!data) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getCollectionsAdmin({ request }) {
    try {
      const params = request.all();
      const page = params?.page ? parseInt(params?.page) : 1
      const perPage = params?.per_page ? parseInt(params?.per_page) : 10
      const name = params?.name
      const search = params?.search
      const priority = params?.priority
      const type = params?.type
      let builder = MarketplaceCollections.query()
      if (search) {
        builder = builder.where((q) => {
          q.where('priority', 'like', `%${search}%`)
            .orWhere('name', 'like', `%${search}%`)
            .orWhere('type', 'like', `%${search}%`);
        })
      }
      if (name) {
        builder = builder.where(``, 'name', `%${category}%`)
      }
      if (type) {
        builder = builder.where('type', 'like', `%${display_area}%`)
      }
      if (priority) {
        builder = builder.where('priority', verified)
      }

      builder = builder.orderBy('created_at', 'DESC')
      const list = await builder.paginate(page, perPage)
      return HelperUtils.responseSuccess(list);
    }catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async collectionCreate({request}) {
    try {
      const params = request.all();
      const marketplaceService = new MarketplaceService()
      const collection = await marketplaceService.setCollection(params, false, 0)

      if (!collection) {
        return HelperUtils.responseNotFound();
      }

      // if (collection && collection.slug) {
      //   await RedisAggregatorUtils.deleteRedisAggregatorDetail(aggregator.slug)
      // }
      return HelperUtils.responseSuccess(collection);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async collectionUpdate({ request }) {
    try {
      const params = request.all();
      const marketplaceService = new MarketplaceService()
      const collection = marketplaceService.setCollection(params, true, request.params.id)

      if (!collection) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(collection);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async findCollection({request}) {
    try {
      let info = await MarketplaceCollections.find(request.params.id)
      if (!info) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(info);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async changeDisplay({ request, auth, params }) {
    const inputParams = request.only([
      'status'
    ]);

    console.log('Update Show with data: ', inputParams);
    const id = params.id;
    try {
      const collection = await MarketplaceCollections.query().where('id', id).first();
      if (!collection) {
        return HelperUtils.responseNotFound('Collection not found');
      }
      await MarketplaceCollections.query().where('id', id).update({
        is_show: inputParams.status,
      });
      
      await RedisMarketplaceUtils.deleteRedisMarketplaceTopCollections()
      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async removeCollection({request}) {
    try {
      const collection = await MarketplaceCollections.findBy('id', request.params.id)
      if (collection) collection.delete()

      if (collection && collection.slug) {
        await RedisMarketplaceUtils.deleteRedisMarketplaceTopCollections()
        await RedisMarketplaceUtils.deleteRedisMarketplaceCollectionDetail(params?.token_address)
      }
      return HelperUtils.responseSuccess();
    }catch (e) {
      return HelperUtils.responseErrorInternal(e);
    }
  }
}

module.exports = MarketplaceController;
