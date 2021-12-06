'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUseExternalApiToMarketplaceCollectionsSchema extends Schema {
  up () {
    this.table('marketplace_collections', (table) => {
      // alter table
      table.boolean('use_external_api').defaultTo(false)
    })
  }

  down () {
    this.table('marketplace_collections', (table) => {
      // reverse alternations
      table.dropColumn('use_external_api')
    })
  }
}

module.exports = AddUseExternalApiToMarketplaceCollectionsSchema
