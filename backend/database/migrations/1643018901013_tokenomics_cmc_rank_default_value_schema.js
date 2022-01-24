'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenomicsCmcRankDefaultValueSchema extends Schema {
  up () {
    this.table('tokenomics', (table) => {
      table.integer('cmc_rank').default(99999).alter();
    })
  }

  down () {
    this.table('tokenomics', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TokenomicsCmcRankDefaultValueSchema
