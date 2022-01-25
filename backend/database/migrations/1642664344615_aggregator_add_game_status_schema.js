'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AggregatorAddGameStatusSchema extends Schema {
  up () {
    this.table('game_informations', (table) => {
      table.string('game_launch_status');
    })
  }

  down () {
    this.table('game_informations', (table) => {
      table.dropColumn('game_launch_status');
    })
  }
}

module.exports = AggregatorAddGameStatusSchema
