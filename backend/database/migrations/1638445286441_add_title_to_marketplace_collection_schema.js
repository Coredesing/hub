'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTitleToMarketplaceCollectionSchema extends Schema {
  up () {
    this.table('marketplace_collections', (table) => {
      // alter table
      table.string('title').default('')
      table.string('sale_description').default('')
    })
  }

  down () {
    this.table('marketplace_collections', (table) => {
      // reverse alternations
      table.dropColumn('title')
      table.dropColumn('sale_description')
    })
  }
}

module.exports = AddTitleToMarketplaceCollectionSchema
