'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDescriptionToBoxTypesSchema extends Schema {
  up () {
    this.table('box_types', (table) => {
      // alter table
      table.string('description').nullable().default('');
    })
  }

  down () {
    this.table('box_types', (table) => {
      // reverse alternations
      table.dropColumn('description');
    })
  }
}

module.exports = AddDescriptionToBoxTypesSchema
