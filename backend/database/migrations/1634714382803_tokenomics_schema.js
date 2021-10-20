'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenomicsSchema extends Schema {
  up () {
    this.table('tokenomics', (table) => {
      // alter table
      table.string('price')
      table.string('price_change_24h')
      table.string('price_btc')
      table.string('price_btc_change_24h')
      table.string('price_eth')
      table.string('price_eth_change_24h')
      table.string('market_cap')
    })
  }

  down () {
    this.table('tokenomics', (table) => {
      // reverse alternations
      table.dropColumn('price')
      table.dropColumn('price_change_24h')
      table.dropColumn('price_btc')
      table.dropColumn('price_btc_change_24h')
      table.dropColumn('price_eth')
      table.dropColumn('price_eth_change_24h')
      table.dropColumn('market_cap')
    })
  }
}

module.exports = TokenomicsSchema
