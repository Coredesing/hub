'use strict'

const { Command } = require('@adonisjs/ace');
const FetchMarketplaceEventJob = use('App/Jobs/FetchMarketplaceEvent');
const HelperUtils = use('App/Common/HelperUtils')
const EVENT_TYPE_LISTED = 'TokenListed'
const EVENT_TYPE_DELISTED = 'TokenDelisted'
const EVENT_TYPE_BOUGHT = 'TokenBought'
const EVENT_TYPE_OFFERED = 'TokenOffered'
const EVENT_TYPE_CANCEL_OFFERED = 'TokenOfferCanceled'
const REFETCH_EVENTS_DELAY_BLOCKS = 3000
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
    const provider = await HelperUtils.getStakingProvider()
    const latestBlockNumber = (await provider.eth.getBlockNumber()) - 1
    if (latestBlockNumber < REFETCH_EVENTS_DELAY_BLOCKS) {
      return
    }
    const fromBlock = latestBlockNumber - REFETCH_EVENTS_DELAY_BLOCKS
    ARRAY_EVENTS.forEach((event_type) => {
      FetchMarketplaceEventJob.doDispatch({ event_type: event_type, from: fromBlock, latestBlockNumber, notCached: true })
    })

    await sleep(5000)
    process.exit(0);
  }
}

module.exports = RefetchEvents;
