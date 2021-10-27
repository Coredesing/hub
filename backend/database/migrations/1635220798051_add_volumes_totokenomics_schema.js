'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddVolumesTotokenomicsSchema extends Schema {
  up () {
    this.table('tokenomics', (table) => {
      // alter table
      table.dropColumn('price_btc')
      table.dropColumn('price_btc_change_24h')
      table.dropColumn('price_eth')
      table.dropColumn('price_eth_change_24h')

      table.string('volume_24h')
      table.string('volume_change_24h')
      table.string('fully_diluted_market_cap')
    })
  }

  down () {
    this.table('tokenomics', (table) => {
      // reverse alternations
      table.string('price_btc')
      table.string('price_btc_change_24h')
      table.string('price_eth')
      table.string('price_eth_change_24h')

      table.dropColumn('volume_24h')
      table.dropColumn('volume_change_24h')
      table.dropColumn('fully_diluted_market_cap')
    })
  }
}

module.exports = AddVolumesTotokenomicsSchema
