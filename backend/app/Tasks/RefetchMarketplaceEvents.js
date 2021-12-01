'use strict'

const Task = use('Task')
const FetchMarketplaceEventJob = use('App/Jobs/FetchMarketplaceEvent');
const HelperUtils = use('App/Common/HelperUtils')
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
    console.log('[RefetchMarketplaceEvents] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      return '0 */5 * * * *';
    } else {
      return '0 */5 * * * *';
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
      const provider = await HelperUtils.getStakingProvider()
      let current_block = (await provider.eth.getBlockNumber()) - 1

      ARRAY_EVENTS.forEach((event_type) => {
        FetchMarketplaceEventJob.doDispatch({ event_type: event_type, from: current_block - 3000, to: current_block, notCached: true })
      })
    }
    catch (e) {
      console.log('error', e)
    }
    finally {
      this.isRunning = false
      await sleep(5000)
    }
  }
}

module.exports = FetchMarketplaceEvents;
