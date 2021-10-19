'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameInformationSchema extends Schema {
  up () {
    this.table('game_informations', (table) => {
      // alter table
      table.boolean('is_show').default(false)
    })
  }

  down () {
    this.table('game_informations', (table) => {
      // reverse alternations
      table.dropColumn('is_show')
    })
  }
}

module.exports = GameInformationSchema
