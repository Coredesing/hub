'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDescriptionToBoxesSchema extends Schema {
  up () {
    this.table('series_contents', (table) => {
      // alter table
      table.string('description').nullable().default('');
    })
  }

  down () {
    this.table('series_contents', (table) => {
      // reverse alternations
      table.dropColumn('description');
    })
  }
}

module.exports = AddDescriptionToBoxesSchema
