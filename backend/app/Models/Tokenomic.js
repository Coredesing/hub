'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tokenomic extends Model {
  static get table() {
    return 'tokenomics';
  }

  gameInfo() {
    return this.hasOne('App/Models/GameInformation', 'game_id', 'id')
  }
}

module.exports = Tokenomic
