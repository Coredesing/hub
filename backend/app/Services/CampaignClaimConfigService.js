'use strict'

const CampaignClaimConfigModel = use('App/Models/CampaignClaimConfig');

class CampaignClaimConfigService {
  buildQueryBuilder(params) {
    // create query
    let builder = CampaignClaimConfigModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    if(params.current_time){
      builder = builder.where('start_time', '<=', params.current_time)
                       // .where('end_time', '>=', params.current_time)
    }

    if (!isNaN(params.claim_type)) {
      builder = builder.where('claim_type', params.claim_type);
    }

    return builder;
  }

  async findLastClaimPhase(params) {
    // default is GameFi
    params.claim_type = 0

    return await this.buildQueryBuilder(params).orderBy('start_time', 'desc').first();
  }
}

module.exports = CampaignClaimConfigService
