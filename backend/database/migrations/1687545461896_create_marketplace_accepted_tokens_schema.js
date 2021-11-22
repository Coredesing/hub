'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateMarketplaceAcceptedTokensSchema extends Schema {
  up () {
    this.create('marketplace_accepted_tokens', (table) => {
      table.increments()
      table.timestamps()

      table.integer('collection_id').index()
      table.string('name')
      table.string('address').index()
      table.string('icon')
      table.string('network').defaultTo('bsc')
      table.boolean('default').defaultTo(false)
      table.unique(['collection_id', 'address'])
    })
  }

  down () {
    this.drop('marketplace_accepted_tokens')
  }
}

module.exports = CreateMarketplaceAcceptedTokensSchema
