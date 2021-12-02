'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSlugToMarketplaceCollectionSchema extends Schema {
  up () {
    this.table('marketplace_collections', (table) => {
      // alter table
      table.string('slug').unique()
      table.index('slug')
    })
  }

  down () {
    this.table('marketplace_collections', (table) => {
      // reverse alternations
      table.dropColumn('slug')
    })
  }
}

module.exports = AddSlugToMarketplaceCollectionSchema
