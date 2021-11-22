'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MarketplaceAcceptedToken extends Model {
  static get table() {
    return 'marketplace_accepted_tokens';
  }
}

module.exports = MarketplaceAcceptedToken;
