'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenomicsSchema extends Schema {
  up () {
    this.create('tokenomics', (table) => {
      table.increments('id')
      table.integer('game_id')
      table.string('ticker')
      table.string('network_chain')
      table.string('project_valuation')
      table.string('initial_token_cir')
      table.string('initial_token_market')
      table.string('token_supply')
      table.text('token_utilities')
      table.text('token_economy')
      table.text('token_metrics')
      table.text('token_distribution')
      table.text('token_release')
      table.timestamps()
    })
  }

  down () {
    this.drop('tokenomics')
  }
}

module.exports = TokenomicsSchema
