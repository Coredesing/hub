'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenomicsSchema extends Schema {
  up () {
    this.table('tokenomics', (table) => {
      // alter table
      table.string('coinmarketcap_slug')
    })
  }

  down () {
    this.table('tokenomics', (table) => {
      // reverse alternations
      table.dropColumn('coinmarketcap_slug')
    })
  }
}

module.exports = TokenomicsSchema
