'use strict'

const NFTOrderModel = use('App/Models/NFTOrder');

class NFTOrderService {
  buildQueryBuilder(params) {
    let builder = NFTOrderModel.query();
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }

    if (params.wallet_address) {
      builder = builder.where('wallet_address', params.wallet_address)
    }

    return builder;
  }

  async createOrUpdate(params) {
    const data = this.buildQueryBuilder(params);
    const firstData = await data.first()

    if (!firstData) {
      const order = new NFTOrderModel();
      order.wallet_address = params.wallet_address;
      order.campaign_id = params.campaign_id;
      order.amount = params.amount;
      await order.save();
      return
    }

    await data.update({amount: params.amount});
  }

  async getOrder(params) {
    return this.buildQueryBuilder(params).first();
  }

  async sumOrderAndRegistered(campaign_id) {
    return this.buildQueryBuilder({campaign_id: campaign_id}).sum('amount').count('*');
  }
}

module.exports = NFTOrderService;
