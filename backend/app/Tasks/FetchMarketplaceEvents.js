'use strict'

const Task = use('Task')
const FetchMarketplaceEventJob = use('App/Jobs/FetchMarketplaceEvent');
const RedisMarketplaceUtils = use('App/Common/RedisMarketplaceUtils')
const MARKETPLACE_START_BLOCK_NUMBER = process.env.MARKETPLACE_START_BLOCK
const EVENT_TYPE_LISTED = 'TokenListed'
const EVENT_TYPE_DELISTED = 'TokenDelisted'
const EVENT_TYPE_BOUGHT = 'TokenBought'
const EVENT_TYPE_OFFERED = 'TokenOffered'
const EVENT_TYPE_CANCEL_OFFERED = 'TokenOfferCanceled'
let ARRAY_EVENTS = [
  EVENT_TYPE_LISTED, EVENT_TYPE_DELISTED, EVENT_TYPE_BOUGHT, EVENT_TYPE_OFFERED, EVENT_TYPE_CANCEL_OFFERED
]

class FetchMarketplaceEvents extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[FetchMarketplaceEvents] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      return '*/15 * * * * *';
    } else {
      return '*/15 * * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      console.log('stop FetchMarketplaceEvents')
      return
    }
    this.isRunning = true

    try {
      let current_block = MARKETPLACE_START_BLOCK_NUMBER
      if (await RedisMarketplaceUtils.existRedisMarketplaceBlockNumber()) {
        let data = await RedisMarketplaceUtils.getRedisMarketplaceBlockNumber()
        data = JSON.parse(data)
        if (data && data.current) {
          current_block = data.current
        }
      }

      ARRAY_EVENTS.forEach((event_type) => {
        FetchMarketplaceEventJob.doDispatch({ event_type: event_type, from: current_block })
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

module.exports = FetchMarketplaceEvents;
