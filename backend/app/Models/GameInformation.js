'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class GameInformation extends Model {
  static get table() {
    return 'game_informations';
  }

  tokenomic() {
    return this.hasOne('App/Models/Tokenomic', 'id', 'game_id')
  }

  projectInformation() {
    return this.hasOne('App/Models/ProjectInformation', 'id', 'game_id')
  }
}

module.exports = GameInformation
