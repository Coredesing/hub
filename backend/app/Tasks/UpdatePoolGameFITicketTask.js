'use strict'

const Task = use('Task')
const PoolService = use('App/Services/PoolService');
const GameFIUtils = use('App/Common/GameFIUtils');
const CampaignModel = use('App/Models/Campaign');
const RedisUtils = use('App/Common/RedisUtils');

class UpdatePoolGameFITicketTask extends Task {
  static get schedule () {
    console.log('[UpdatePoolGameFITicketTask] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/15 * * * * *';
      return '0 */1 * * * *';
      // return '0 */5000 * * * *';  // 5 minutes
      // return '0 */350 * * * *';
    } else {
      return '0 */5 * * * *';
    }
  }

  async handle () {
    console.log('Task UpdatePoolGameFITicketTask handle');

    let pool = await GameFIUtils.getGameFIPool(CampaignModel)
    if (!pool) {
      return;
    }

    (new PoolService).updatePoolInformation(pool);
    RedisUtils.deleteRedisPoolDetail(0);
  }
}

module.exports = UpdatePoolGameFITicketTask;
