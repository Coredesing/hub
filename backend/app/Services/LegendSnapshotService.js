'use strict'

const LegendSnapshotModel = use('App/Models/LegendSnapshot');
const RedisLegendSnapshotUtils = use('App/Common/RedisLegendSnapshotUtils')
const DEFAULT_LIMIT = 60 // 5 pools

class LegendSnapshotService {
  async query(param) {
    param = param || {}
    try {
      let data = await LegendSnapshotModel.query()
        .orderBy('snapshot_at', 'desc')
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
