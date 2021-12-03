'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangePriceAcceptedTokensSchema extends Schema {
  up () {
    this.table('accepted_tokens', (table) => {
      // alter table
      table.decimal('price', 10,6).defaultTo(0.0).alter()
    })
  }

  down () {
    this.table('accepted_tokens', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ChangePriceAcceptedTokensSchema
