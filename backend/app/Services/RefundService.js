'use strict'

const RefundModel = use('App/Models/Refund');

class RefundService {
  async createRefundRequest(campaign_id, wallet_address, reason) {
    const newRefundRequest = new RefundModel()
    newRefundRequest.campaign_id = campaign_id
    newRefundRequest.wallet_address = wallet_address
    newRefundRequest.reason = reason

    await newRefundRequest.save()
    return true
  }
}

module.exports = RefundService
