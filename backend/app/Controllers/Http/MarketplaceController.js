'use strict'

const HelperUtils = use('App/Common/HelperUtils');
const MarketplaceService = use('App/Services/MarketplaceService');


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
  async getOffers({ request }) {
    try {
      const inputParams = request.all();
      let data = await (new MarketplaceService).getEvents(inputParams);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  // TODO:
  async discover({ request }) {
    try {

      return HelperUtils.responseSuccess('','Update successfully');
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
      let data = await (new MarketplaceService).getCollectionByAddress(address);
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
      console.log('e', e)
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
}

module.exports = MarketplaceController;
