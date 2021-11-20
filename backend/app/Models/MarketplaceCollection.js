'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MarketplaceCollection extends Model {
  static get table() {
    return 'marketplace_collections';
  }
}

module.exports = MarketplaceCollection;
