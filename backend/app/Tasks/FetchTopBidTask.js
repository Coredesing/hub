'use strict'

const Task = use('Task')
const PoolService = use('App/Services/PoolService');

class FetchTopBidTask extends Task {
  static get schedule () {
    console.log('[FetchTopBidTask] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/15 * * * * *';
      return '0 */1 * * * *';
    } else {
      return '*/30 * * * * *';
    }
  }

  async handle () {
    console.log('Task FetchTopBidTask handle');

    const pools = (new PoolService).runUpdateTopBid();

  }
}

module.exports = FetchTopBidTask;
