'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameFavouriteSchema extends Schema {
  up () {
    this.create('game_favourites', (table) => {
      table.increments()
      table.integer('game_id')
      table.string('user_address')
      table.integer('status')
      table.timestamps()
    })
  }

  down () {
    this.drop('game_favourites')
  }
}

module.exports = GameFavouriteSchema
