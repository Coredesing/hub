'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MarketplaceNFTListedEvent extends Model {
  static get table() {
    return 'nft_listed_events';
  }
}

module.exports = MarketplaceNFTListedEvent;
