'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameInformationSchema extends Schema {
  up () {
    this.table('game_informations', (table) => {
      table.text('short_description')
      table.string('icon_token_link')

    })
  }

  down () {
    this.table('game_informations', (table) => {
      table.dropColumn('short_description')
      table.dropColumn('icon_token_link')
    })
  }
}

module.exports = GameInformationSchema
