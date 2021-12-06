'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LFW_NFT extends Model {
  static get table() {
    return 'lfw_nfts';
  }
}

module.exports = LFW_NFT;
