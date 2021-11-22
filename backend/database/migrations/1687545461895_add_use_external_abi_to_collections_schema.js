'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUseExternalAbiToCollectionsSchema extends Schema {
  up () {
    this.table('marketplace_collections', (table) => {
      table.boolean('use_external_uri').defaultTo(false)
    })
  }

  down () {
    this.table('marketplace_collections', (table) => {
      table.dropColumn('use_external_uri')
    })
  }
}

module.exports = AddUseExternalAbiToCollectionsSchema
