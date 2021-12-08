'use strict'

const { Command } = require('@adonisjs/ace');
const FetchLFWEventJob = use('App/Jobs/FetchLFWEventJob');
const HelperUtils = use('App/Common/HelperUtils')
const REFETCH_EVENTS_DELAY_BLOCKS = 3000

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class FetchLFWEvents extends Command {
  static get signature () {
    return 'fetch:events:lfw'
  }

  static get description () {
    return 'Fetch events of lfw'
  }

  async handle (args, options) {
    this.info('Implementation for fetch:events:lfw command');
    const provider = await HelperUtils.getLFWInstance()
    const latestBlockNumber = (await provider.eth.getBlockNumber()) - 1
    if (latestBlockNumber < REFETCH_EVENTS_DELAY_BLOCKS) {
      return
    }
    const fromBlock = latestBlockNumber - REFETCH_EVENTS_DELAY_BLOCKS

    FetchLFWEventJob.doDispatch({from: fromBlock, notCached: true })

    await sleep(5000)
    process.exit(0);
  }
}

module.exports = FetchLFWEvents;
