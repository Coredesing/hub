'use strict'
const kue = use('Kue');
const BigNumber = use('bignumber.js');
const HelperUtils = use('App/Common/HelperUtils')
const LFWModel = use('App/Models/LFW_NFT')

const priority = 'medium'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 3; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => {
  job.backoff();
}; // Function to be run on the job before it is saved

const STEP = 5000

class FetchLFWEvent {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return 'FetchMarketPlaceEvent-job'
  }

  // This is where the work is done.
  async handle({ event_type, from, to, notCached }) {
    try {
      if (!isNaN(from)) {
        from = parseInt(from)
      }
      if (!isNaN(to)) {
        to = parseInt(to)
      }

      const provider = await HelperUtils.getStakingProvider()
      const latestBlockNumber = (await provider.eth.getBlockNumber()) - 1
      if (!to || to > latestBlockNumber || to < from) {
        to = latestBlockNumber
      }

      if (from > latestBlockNumber) {
        return
      }

      // fetch staking
      for (let index = from; index < to; index += STEP) {
        let tmp = index + STEP
        if (tmp >= to) {
          tmp = to
        }

        await this.fetchEvents(provider, event_type, index, tmp)
      }

      if (notCached) {
        return
      }

      await RedisMarketplaceUtils.setRedisMarketplaceBlockNumber({current: to})
    }
    catch (e) {
      console.log('exception', e)
    } finally {
    }
  }

  async fetchEvents(provider, event_type, from, to) {
    console.log(`fetch ${event_type} from ${from} to ${to} in LFW`)
    const instance = await HelperUtils.getMarketplaceInstance()
    const events = await instance.getPastEvents(event_type, {
      fromBlock: from,
      toBlock: to,
    })
    for (const event of events) {
      try {
        const blockData = await provider.eth.getBlock(event.blockNumber)

        let data = new LFWModel();
        data.transaction_hash = event.transactionHash;
        data.transaction_index = event.transactionIndex;
        data.block_number = event.blockNumber;
        data.dispatch_at = blockData.timestamp;
        data.owner = true;
        data.from = event.returnValues.from;
        data.to = event.returnValues.to;
        data.token_id = event.returnValues.token_id;

        // check existed before save
        const tx = await LFWModel.query()
          .where('transaction_hash', data.transaction_hash)
          .where('transaction_index', data.transaction_index)
          .where('from', data.from)
          .where('token_id', data.token_id).first()

        if (!tx) {
          await data.save();
        }

        // update owner
        await LFWModel.query()
          .where('to', data.from)
          .where('token_id', data.token_id)
          .where('owner', true)
          .where('dispatch_at', '<', data.dispatch_at)
          .update({owner: false})
      }
      catch (e) {
        console.log('internal transaction', e)
      }
    }
  }

  // Dispatch
  static doDispatch(data) {
    kue.dispatch(this.key, data, { priority, attempts, remove, jobFn });
  }
}

module.exports = FetchLFWEvent
