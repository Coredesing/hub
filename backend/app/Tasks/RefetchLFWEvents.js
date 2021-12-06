'use strict'

const Task = use('Task')
const FetchLFWEventJob = use('App/Jobs/FetchLFWEventJob')
const HelperUtils = use('App/Common/HelperUtils')
const LFW_START_BLOCK_NUMBER = process.env.LFW_START_BLOCK_NUMBER
const REFETCH_EVENTS_DELAY_BLOCKS = 3000

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class FetchLFWEvents extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[FetchLFW] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
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
    if (!LFW_START_BLOCK_NUMBER) {
      return
    }

    try {
      const provider = await HelperUtils.getLFWInstance()
      let current_block = (await provider.eth.getBlockNumber()) - 1

      if (current_block < REFETCH_EVENTS_DELAY_BLOCKS) {
        return
      }

      FetchLFWEventJob.doDispatch({from: current_block - REFETCH_EVENTS_DELAY_BLOCKS, to: current_block, notCached: true })
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

module.exports = FetchLFWEvents;
