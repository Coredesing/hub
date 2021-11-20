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
    const id = params.id;
    if (!isNaN(id)) {
      return HelperUtils.responseNotFound();
    }

    try {
      let data = await (new MarketplaceService).getCollectionById(id);
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  // TODO:
  async getCollectionItems({ request }) {
    try {

      return HelperUtils.responseSuccess('','Update successfully');
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getCollectionActivities({ request }) {
    try {
      const inputParams = request.all();
      let data = await (new MarketplaceService).getEvents(inputParams);
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
}

module.exports = MarketplaceController;
