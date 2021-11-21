'use strict'
const kue = use('Kue');
const BigNumber = use('bignumber.js');
const HelperUtils = use('App/Common/HelperUtils')
const MarketplaceEventModel = use('App/Models/MarketplaceNFTListedEvent')


const priority = 'high'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 5; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => {
  job.backoff();
}; // Function to be run on the job before it is saved

const EVENT_TYPE_LISTED = 'TokenListed'
const EVENT_TYPE_DELISTED = 'TokenDelisted'
const EVENT_TYPE_BOUGHT = 'TokenBought'
const EVENT_TYPE_OFFERED = 'TokenOffered'
const EVENT_TYPE_CANCEL_OFFERED = 'TokenOfferCanceled'

// Listed:
// - SC data: tokensOnSale[tokenContract][tokenId]
// - Event: TokenListed(tokenContract, tokenId, tokenOwner, currency, price);
// - Event: TokenDelisted(tokenContract, tokenId, currentListing.tokenOwner);
// - Event: TokenBought(tokenContract, tokenId, buyer, seller, currency, price);

// Offer:
// - SC data: tokensWithOffers[tokenContract][tokenId][buyer]
// - Event: TokenOffered(tokenContract, tokenId, buyer, currency, offerValue);
// - Event: TokenOfferCanceled(tokenContract, tokenId, buyer);

// Offers: tokenContract, tokenId, buyer, currency, value (time, hash, index)
// List: tokenContract, tokenId, owner, currency, value
// Buy: tokenContract, tokenId, owner, seller, currency, value
// Delist: tokenContract, tokenId, owner, seller,

class FetchMarketplaceEvent {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 10
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return 'FetchMarketPlaceEvent-job'
  }

  // This is where the work is done.
  async handle({ event_type, from, to }) {
    try {
      const provider = await HelperUtils.getStakingProvider()
      console.log(`fetch ${event_type} from ${from} to ${to} in marketplace`)
      const instance = await HelperUtils.getMarketplaceInstance()
      const ONE_UNIT = new BigNumber(1e9).multipliedBy(new BigNumber(1e9))

      const events = await instance.getPastEvents(event_type, {
        fromBlock: from,
        toBlock: to,
      })
      for (const event of events) {
        try {
          const blockData = await provider.eth.getBlock(event.blockNumber)

          // event TokenListed(
          //         address indexed tokenContract,
          //         uint256 indexed tokenId,
          //         address tokenOwner,
          //         address currency,
          //         uint256 price
          //     );
          //
          //     event TokenDelisted(
          //         address indexed tokenContract,
          //         uint256 indexed tokenId,
          //         address tokenOwner
          //     );
          // vent TokenBought(
          //         address indexed tokenContract,
          //         uint256 indexed tokenId,
          //         address buyer,
          //         address seller,
          //         address currency,
          //         uint256 price
          //     );
          //
          //     event TokenOffered(
          //         address indexed tokenContract,
          //         uint256 indexed tokenId,
          //         address buyer,
          //         address currency,
          //         uint256 amount
          //     );
          //
          //     event TokenOfferCanceled(
          //         address indexed tokenContract,
          //         uint256 indexed tokenId,
          //         address buyer
          //     );

          let data = new MarketplaceEventModel();
          data.transaction_hash = event.transactionHash;
          data.transaction_index = event.transactionIndex;

          console.log('data', event)
          switch(event_type) {
            case EVENT_TYPE_LISTED:
              break;
            case EVENT_TYPE_DELISTED:
              break;
            case EVENT_TYPE_BOUGHT:
              break;
            case EVENT_TYPE_OFFERED:
              break;
            case EVENT_TYPE_CANCEL_OFFERED:
              break;
            default:
              console.log('event not support', event_type)
              return
          }

          // data.wallet_address = event.returnValues.account;
          // data.event_type = event_type;
          // data.block_number = event.blockNumber;
          // data.dispatch_at = blockData.timestamp;
          // data.raw_amount = event.returnValues.amount;
          // data.amount = parseFloat(new BigNumber(data.raw_amount).dividedBy(ONE_UNIT).toFixed(6)) * sign;
          //
          // await data.save();
          //
          // const tierInfo = await HelperUtils.getUserTierSmart(event.returnValues.account);
          // await RedisUtils.createRedisUserTierBalance(event.returnValues.account, tierInfo);
          //
          // if (HelperUtils.getLegendIdByOwner(event.returnValues.account)) {
          //   await RedisLegendSnapshotUtils.setRedisLegendLastTime(event.returnValues.account, blockData.timestamp);
          // }
        }
        catch (e) {}
      }
    }
    catch (e) {
    } finally {
    }
  }

  // Dispatch
  static doDispatch(data) {
    console.log('Dispatch ExportUser: ', data);
    kue.dispatch(this.key, data, { priority, attempts, remove, jobFn });
  }
}

module.exports = FetchMarketplaceEvent
