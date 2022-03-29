'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangeTextToMarketplaceCollectionsSchema extends Schema {
  up () {
    this.table('marketplace_collections', (table) => {
      // alter table
      table.text('description').default('').alter();
      table.text('sale_description').default('').alter();
    })
  }

  down () {
    this.table('marketplace_collections', (table) => {
      // reverse alternations
      table.string('description').default('').alter();
      table.string('sale_description').default('').alter();
    })
  }
}

module.exports = ChangeTextToMarketplaceCollectionsSchema
