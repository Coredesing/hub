'use strict'

const RefundModel = use('App/Models/Refund');

class RefundService {
  async createRefundRequest(campaign_id, wallet_address, reason) {
    try {
      const newRefundRequest = new RefundModel()
      newRefundRequest.campaign_id = campaign_id
      newRefundRequest.wallet_address = wallet_address
      newRefundRequest.reason = reason

      await newRefundRequest.save()
      return true
    }
    catch (e) {
      return false
    }
  }
}

module.exports = RefundService
