'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCurrencyIdsToBoxTypesSchema extends Schema {
  up () {
    this.table('box_types', (table) => {
      // alter table
      table.string('currency_ids').nullable().default('');
    })
  }

  down () {
    this.table('box_types', (table) => {
      // reverse alternations
      table.dropColumn('currency_ids');
    })
  }
}

module.exports = AddCurrencyIdsToBoxTypesSchema
