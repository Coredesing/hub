'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NFTOrder extends Model {
  static get table() {
    return 'nft_orders';
  }
}

module.exports = NFTOrder;
