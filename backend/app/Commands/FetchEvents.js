'use strict'

const { Command } = require('@adonisjs/ace');
const FetchMarketplaceEventJob = use('App/Jobs/FetchMarketplaceEvent');
const EVENT_TYPE_LISTED = 'TokenListed'
const EVENT_TYPE_DELISTED = 'TokenDelisted'
const EVENT_TYPE_BOUGHT = 'TokenBought'
const EVENT_TYPE_OFFERED = 'TokenOffered'
const EVENT_TYPE_CANCEL_OFFERED = 'TokenOfferCanceled'
const MARKETPLACE_START_BLOCK_NUMBER = process.env.MARKETPLACE_START_BLOCK
let ARRAY_EVENTS = [
  EVENT_TYPE_LISTED, EVENT_TYPE_DELISTED, EVENT_TYPE_BOUGHT, EVENT_TYPE_OFFERED, EVENT_TYPE_CANCEL_OFFERED
]

class FetchEvents extends Command {
  static get signature () {
    return 'fetch:events'
  }

  static get description () {
    return 'Fetch events of marketplace'
  }

  async handle (args, options) {
    this.info('Implementation for fetch:events command');
    ARRAY_EVENTS.forEach((event_type) => {
      FetchMarketplaceEventJob.doDispatch({ event_type: event_type, from: MARKETPLACE_START_BLOCK_NUMBER })
    })
    process.exit(0);
  }
}

module.exports = FetchEvents;
