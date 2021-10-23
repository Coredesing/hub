'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddIndexToAggregatorSchema extends Schema {
  up () {
    this.table('tokenomics', (table) => {
      table.integer('game_id').unsigned().notNullable().alter()
      table.foreign('game_id').references('game_informations.id')
    })
    this.table('project_informations', (table) => {
      table.integer('game_id').unsigned().notNullable().alter()
      table.foreign('game_id').references('game_informations.id')
    })
    this.table('game_favourites', (table) => {
      table.integer('game_id').unsigned().notNullable().alter()
      table.foreign('game_id').references('game_informations.id')
    })
  }

  down () {
    this.table('tokenomics', (table) => {table.dropForeign('game_id')})
    this.table('project_informations', (table) => {table.dropForeign('game_id')})
    this.table('game_favourites', (table) => {table.dropForeign('game_id')})
  }
}

module.exports = AddIndexToAggregatorSchema
