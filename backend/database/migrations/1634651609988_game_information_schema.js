'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameInformationSchema extends Schema {
  up () {
    this.table('game_informations', (table) => {
      // alter table
      table.string('redkite_ido_link')
      table.string('gamefi_ido_link')
    })
  }

  down () {
    this.table('game_informations', (table) => {
      // reverse alternations
      table.dropColumn('redkite_ido_link')
      table.dropColumn('gamefi_ido_link')
    })
  }
}

module.exports = GameInformationSchema
