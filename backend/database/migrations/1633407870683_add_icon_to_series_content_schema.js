'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddIconToSeriesContentSchema extends Schema {
  up () {
    this.table('series_contents', (table) => {
      // alter table
      table.string('icon').nullable().default('');
      table.string('banner').nullable().default('');
    })
  }

  down () {
    this.table('series_contents', (table) => {
      // reverse alternations
      table.dropColumn('icon');
      table.dropColumn('banner');
    })
  }
}

module.exports = AddIconToSeriesContentSchema
