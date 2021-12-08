'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUseExternalApiToCampaginsSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      // alter table
      table.boolean('use_external_api').defaultTo(false);
    })
  }

  down () {
    this.table('campaigns', (table) => {
      table.dropColumn('use_external_api')
    })
  }
}

module.exports = AddUseExternalApiToCampaginsSchema
