'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddImageToBoxTypesSchema extends Schema {
  up () {
    this.table('box_types', (table) => {
      // alter table
      table.string('image').nullable().default('');
    })
  }

  down () {
    this.table('box_types', (table) => {
      // reverse alternations
      table.dropColumn('image');
    })
  }
}

module.exports = AddImageToBoxTypesSchema
