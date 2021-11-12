'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRankToTokenomicsSchema extends Schema {
  up () {
    this.table('tokenomics', (table) => {
      // alter table
      table.string('price_change_7d')
      table.integer('cmc_rank')
      table.string('token_address')
      table.integer('cmc_id')

      // table.decimal('price',20,5).alter()
      // table.index('price')
      table.index('cmc_rank')
    })
  }

  down () {
    this.table('tokenomics', (table) => {
      // reverse alternations
      table.dropColumn('price_change_7d')
      table.dropColumn('cmc_rank')
      table.dropColumn('token_address')
      table.dropColumn('cmc_id')
    })
  }
}

module.exports = AddRankToTokenomicsSchema
