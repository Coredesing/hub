'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class GameInformation extends Model {
  static get table() {
    return 'game_informations';
  }
}

module.exports = GameInformation
