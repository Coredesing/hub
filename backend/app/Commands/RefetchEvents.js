'use strict'

const { Command } = require('@adonisjs/ace');
const RefetchMarketplaceEventJob = use('App/Jobs/RefetchMarketplaceEvent');
const EVENT_TYPE_LISTED = 'TokenListed'
const EVENT_TYPE_DELISTED = 'TokenDelisted'
const EVENT_TYPE_BOUGHT = 'TokenBought'
const EVENT_TYPE_OFFERED = 'TokenOffered'
const EVENT_TYPE_CANCEL_OFFERED = 'TokenOfferCanceled'
const MARKETPLACE_START_BLOCK_NUMBER = process.env.MARKETPLACE_START_BLOCK
const REFETCH_EVENTS_DELAY_BLOCKS = process.env.REFETCH_EVENTS_DELAY_BLOCKS
let ARRAY_EVENTS = [
  EVENT_TYPE_LISTED, EVENT_TYPE_DELISTED, EVENT_TYPE_BOUGHT, EVENT_TYPE_OFFERED, EVENT_TYPE_CANCEL_OFFERED
]
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class RefetchEvents extends Command {
  static get signature () {
    return 'refetch:events'
  }

  static get description () {
    return 'Refetch events of marketplace'
  }

  async handle (args, options) {
    this.info('Implementation for refetch:events command');
    const fromBlock = MARKETPLACE_START_BLOCK_NUMBER - REFETCH_EVENTS_DELAY_BLOCKS
    ARRAY_EVENTS.forEach((event_type) => {
      RefetchMarketplaceEventJob.doDispatch({ event_type: event_type, from: fromBlock, MARKETPLACE_START_BLOCK_NUMBER })
    })

    await sleep(5000)
    process.exit(0);
  }
}

module.exports = RefetchEvents;
