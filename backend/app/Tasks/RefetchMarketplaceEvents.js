'use strict'

const Task = use('Task')
const RefetchMarketplaceEventJob = use('App/Jobs/RefetchMarketplaceEvent');
const RedisMarketplaceUtils = use('App/Common/RedisMarketplaceUtils')
const MARKETPLACE_START_BLOCK_NUMBER = process.env.MARKETPLACE_START_BLOCK
const REFETCH_EVENTS_DELAY_BLOCKS = process.env.REFETCH_EVENTS_DELAY_BLOCKS
const EVENT_TYPE_LISTED = 'TokenListed'
const EVENT_TYPE_DELISTED = 'TokenDelisted'
const EVENT_TYPE_BOUGHT = 'TokenBought'
const EVENT_TYPE_OFFERED = 'TokenOffered'
const EVENT_TYPE_CANCEL_OFFERED = 'TokenOfferCanceled'
let ARRAY_EVENTS = [
  EVENT_TYPE_LISTED, EVENT_TYPE_DELISTED, EVENT_TYPE_BOUGHT, EVENT_TYPE_OFFERED, EVENT_TYPE_CANCEL_OFFERED
]

class RefetchMarketplaceEvents extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[RefetchMarketplaceEvents] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      return '*/15 * * * * *';
    } else {
      return '*/15 * * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      return
    }
    this.isRunning = true
    if (!MARKETPLACE_START_BLOCK_NUMBER) {
      return
    }

    try {
      let current_block = MARKETPLACE_START_BLOCK_NUMBER
      if (await RedisMarketplaceUtils.existRedisMarketplaceBlockNumber()) {
        let data = await RedisMarketplaceUtils.getRedisMarketplaceBlockNumber()
        data = JSON.parse(data)
        if (data && data.current) {
          current_block = data.current
        }
      }

      const fromBlock = current_block - REFETCH_EVENTS_DELAY_BLOCKS

      ARRAY_EVENTS.forEach((event_type) => {
        RefetchMarketplaceEventJob.doDispatch({ event_type: event_type, from: fromBlock, to: current_block })
      })
    }
    catch (e) {
      console.log('error', e)
    }
    finally {
      this.isRunning = false
    }
  }
}

module.exports = RefetchMarketplaceEvents;
