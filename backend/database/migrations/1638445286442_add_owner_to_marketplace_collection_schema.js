'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddOwnerToMarketplaceCollectionSchema extends Schema {
  up () {
    this.table('marketplace_collections', (table) => {
      // alter table
      table.string('sale_address').default('')
      table.string('creator').default('').index()
    })
  }

  down () {
    this.table('marketplace_collections', (table) => {
      // reverse alternations
      table.dropColumn('sale_address')
      table.dropColumn('creator')
    })
  }
}

module.exports = AddOwnerToMarketplaceCollectionSchema
