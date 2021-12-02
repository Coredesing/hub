'use strict'
const kue = use('Kue');
const BigNumber = use('bignumber.js');
const HelperUtils = use('App/Common/HelperUtils')
const MarketplaceEventModel = use('App/Models/MarketplaceNFTListedEvent')
const MarketplaceCollectionModel = use('App/Models/MarketplaceCollection')
const RedisMarketplaceUtils = use('App/Common/RedisMarketplaceUtils')

const priority = 'medium'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 3; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => {
  job.backoff();
}; // Function to be run on the job before it is saved

const EVENT_TYPE_LISTED = 'TokenListed'
const EVENT_TYPE_DELISTED = 'TokenDelisted'
const EVENT_TYPE_BOUGHT = 'TokenBought'
const EVENT_TYPE_OFFERED = 'TokenOffered'
const EVENT_TYPE_CANCEL_OFFERED = 'TokenOfferCanceled'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const STEP = 5000

// Listed:
// - SC data: tokensOnSale[tokenContract][tokenId]
// - Event: TokenListed(tokenContract, tokenId, tokenOwner, currency, price);
// - Event: TokenDelisted(tokenContract, tokenId, currentListing.tokenOwner);
// - Event: TokenBought(tokenContract, tokenId, buyer, seller, currency, price);

// Offer:
// - SC data: tokensWithOffers[tokenContract][tokenId][buyer]
// - Event: TokenOffered(tokenContract, tokenId, buyer, currency, offerValue);
// - Event: TokenOfferCanceled(tokenContract, tokenId, buyer);

class FetchMarketplaceEvent {
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
    console.log(`fetch ${event_type} from ${from} to ${to} in marketplace`)
    const instance = await HelperUtils.getMarketplaceInstance()
    const events = await instance.getPastEvents(event_type, {
      fromBlock: from,
      toBlock: to,
    })
    for (const event of events) {
      try {
        const blockData = await provider.eth.getBlock(event.blockNumber)

        let data = new MarketplaceEventModel();
        data.transaction_hash = event.transactionHash;
        data.transaction_index = event.transactionIndex;
        data.block_number = event.blockNumber;
        data.dispatch_at = blockData.timestamp;
        data.event_type = event_type;
        switch(event_type) {
          case EVENT_TYPE_LISTED:
            data.token_address = event.returnValues.tokenContract
            data.buyer = ZERO_ADDRESS
            data.seller = event.returnValues.tokenOwner
            data.currency = event.returnValues.currency
            data.token_id = parseInt(event.returnValues.tokenId)
            data.raw_amount = event.returnValues.price
            data.value = new BigNumber(data.raw_amount)
            data.value = data.value.dividedBy(new BigNumber(1e9).multipliedBy(new BigNumber(1e9)))
            data.value = data.value.toFixed(3)
            try {
              data.amount = parseFloat(data.value)
            } catch (e) {
              data.amount = 0.0
            }
            break;
          case EVENT_TYPE_DELISTED:
            data.token_address = event.returnValues.tokenContract
            data.buyer = ZERO_ADDRESS
            data.seller = event.returnValues.tokenOwner
            data.currency = ZERO_ADDRESS
            data.token_id = parseInt(event.returnValues.tokenId)
            data.raw_amount = "0"
            data.value = "0"
            data.amount = 0.0

            // clear finish
            break;
          case EVENT_TYPE_BOUGHT:
            data.token_address = event.returnValues.tokenContract
            data.buyer = event.returnValues.buyer
            data.seller = event.returnValues.seller
            data.currency = event.returnValues.currency
            data.token_id = parseInt(event.returnValues.tokenId)
            data.raw_amount = event.returnValues.price
            data.value = new BigNumber(data.raw_amount)
            data.value = data.value.dividedBy(new BigNumber(1e9).multipliedBy(new BigNumber(1e9)))
            data.value = data.value.toFixed(3)
            try {
              data.amount = parseFloat(data.value)
            } catch (e) {
              data.amount = 0.0
            }
            break;
          case EVENT_TYPE_OFFERED:
            data.token_address = event.returnValues.tokenContract
            data.buyer = event.returnValues.buyer
            data.seller = ZERO_ADDRESS
            data.currency = event.returnValues.currency
            data.token_id = parseInt(event.returnValues.tokenId)
            data.raw_amount = event.returnValues.amount
            data.value = new BigNumber(data.raw_amount)
            data.value = data.value.dividedBy(new BigNumber(1e9).multipliedBy(new BigNumber(1e9)))
            data.value = data.value.toFixed(3)
            try {
              data.amount = parseFloat(data.value)
            } catch (e) {
              data.amount = 0.0
            }
            break;
          case EVENT_TYPE_CANCEL_OFFERED:
            data.token_address = event.returnValues.tokenContract
            data.buyer = event.returnValues.buyer
            data.seller = ZERO_ADDRESS
            data.currency = ZERO_ADDRESS
            data.token_id = parseInt(event.returnValues.tokenId)
            data.raw_amount = "0"
            data.value = "0"
            data.amount = 0.0

            // clear finish
            break;
          default:
            console.log('event not supported', event_type)
            return
        }

        // get slug -> by cached
        const slug = await MarketplaceCollectionModel.query().where('token_address', data.token_address).first()
        if (slug && slug.slug) {
          data.slug = slug.slug
        }

        // check existed before save
        const tx = await MarketplaceEventModel.query()
          .where('transaction_hash', data.transaction_hash)
          .where('transaction_index', data.transaction_index)
          .where('event_type', event_type).first()

        if (!tx) {
          await data.save();
        }
        switch(event_type) {
          case EVENT_TYPE_DELISTED:
            await MarketplaceEventModel.query()
              .where('token_address', data.token_address)
              .where('seller', data.seller)
              .where('event_type', EVENT_TYPE_LISTED)
              .where('token_id', data.token_id)
              .where('finish', 0)
              .where('dispatch_at', '<', data.dispatch_at)
              .update({finish: 1})
            break
          case EVENT_TYPE_CANCEL_OFFERED:
            await MarketplaceEventModel.query()
              .where('token_address', data.token_address)
              .where('buyer', data.buyer)
              .where('event_type', EVENT_TYPE_OFFERED)
              .where('token_id', data.token_id)
              .where('finish', 0)
              .where('dispatch_at', '<', data.dispatch_at)
              .update({finish: 1})
            break
          case EVENT_TYPE_BOUGHT:
            await MarketplaceEventModel.query()
              .where('token_address', data.token_address)
              .where('seller', data.seller)
              .where('event_type', EVENT_TYPE_LISTED)
              .where('token_id', data.token_id)
              .where('finish', 0)
              .where('dispatch_at', '<', data.dispatch_at)
              .update({finish: 1})
            break
          case EVENT_TYPE_OFFERED:
            await MarketplaceEventModel.query()
              .where('token_address', data.token_address)
              .where('buyer', data.buyer)
              .where('event_type', EVENT_TYPE_OFFERED)
              .where('token_id', data.token_id)
              .where('finish', 0)
              .where('dispatch_at', '<', data.dispatch_at)
              .update({finish: 1})

            const currentListed = await MarketplaceEventModel.query()
              .where('token_address', data.token_address)
              .where('buyer', data.buyer)
              .where('event_type', EVENT_TYPE_LISTED)
              .where('token_id', data.token_id)
              .where('finish', 0)
              .where('dispatch_at', '<', data.dispatch_at)
            
            if (data.highest_offer > currentListed?.highest_offer) {
              await MarketplaceEventModel.query()
                .where('token_address', data.token_address)
                .where('buyer', data.buyer)
                .where('event_type', EVENT_TYPE_OFFERED)
                .where('token_id', data.token_id)
                .where('finish', 0)
                .where('dispatch_at', '<', data.dispatch_at)
                .update({highest_offer: data.highest_offer})
            }
            break
          case EVENT_TYPE_LISTED:
            await MarketplaceEventModel.query()
              .where('token_address', data.token_address)
              .where('seller', data.seller)
              .where('event_type', EVENT_TYPE_LISTED)
              .where('token_id', data.token_id)
              .where('finish', 0)
              .where('dispatch_at', '<', data.dispatch_at)
              .update({finish: 1})
            break
          default:
        }
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

module.exports = FetchMarketplaceEvent
