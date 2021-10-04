'use strict'

const LegendSnapshotModel = use('App/Models/LegendSnapshot');
const DEFAULT_LIMIT = 60 // 5 pools

class LegendSnapshotService {
  async query(param) {
    param = param || {}
    try {
      let data = await LegendSnapshotModel.query()
        .select('wallet_address', 'campaign_id', 'amount', 'snapshot_at')
        .orderBy('snapshot_at', 'asc')
        .orderBy('campaign_id', 'desc')
        .orderBy('amount', 'desc')
        .limit(param.limit || DEFAULT_LIMIT)
        .fetch()
      data = JSON.parse(JSON.stringify(data))
      return data;
    }
    catch (e) {
      console.log('error', e)
    }
  }

}

module.exports = LegendSnapshotService
