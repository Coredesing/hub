'use strict'

const Task = use('Task')
const FetchLFWEventJob = use('App/Jobs/FetchLFWEventJob');
const RedisLFWUtils = use('App/Common/RedisLFWUtils')
const LFW_START_BLOCK_NUMBER = process.env.MARKETPLACE_START_BLOCK

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class FetchLFWEvents extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[FetchLFW] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
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
    if (!LFW_START_BLOCK_NUMBER) {
      return
    }

    try {
      let current_block = LFW_START_BLOCK_NUMBER
      if (await RedisLFWUtils.existRedisLFWBlockNumber()) {
        let data = await RedisLFWUtils.getRedisLFWBlockNumber()
        data = JSON.parse(data)
        if (data && data.current) {
          current_block = data.current
        }
      }

      FetchLFWEventJob.doDispatch({from: current_block })
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
