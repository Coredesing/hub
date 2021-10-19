'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class GameFavourite extends Model {
  static get table() {
    return 'game_favourites';
  }
}

module.exports = GameFavourite
