'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddIndexToNftListedSchema extends Schema {
  up () {
    this.table('nft_listed_events', (table) => {
      table.string('network').defaultTo('bsc')
      table.bool('finish').defaultTo(false)

      table.unique(['transaction_hash', 'transaction_index', 'event_type'], 'unique index by transaction')
      table.dropUnique(['transaction_hash', 'transaction_index'])
      table.index('network')
      table.index('finish')
    })
  }

  down () {
    this.table('nft_listed_events', (table) => {
      table.dropColumn('network')
      table.dropColumn('finish')
      table.dropIndex(['transaction_hash', 'transaction_index', 'event_type'], 'unique index by transaction')
      table.unique(['transaction_hash', 'transaction_index'])
    })
  }
}

module.exports = AddIndexToNftListedSchema
