'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSlugToMarketplaceCollectionSchema extends Schema {
  up () {
    this.table('nft_listed_events', (table) => {
      // alter table
      table.string('slug')
      table.index('slug')
    })
  }

  down () {
    this.table('nft_listed_events', (table) => {
      // reverse alternations
      table.dropColumn('slug')
    })
  }
}

module.exports = AddSlugToMarketplaceCollectionSchema
