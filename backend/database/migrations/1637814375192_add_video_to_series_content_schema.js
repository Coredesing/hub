'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddVideoToSeriesContentSchema extends Schema {
  up () {
    this.table('series_contents', (table) => {
      // alter table
      table.string('video').nullable().default('');
    })
  }

  down () {
    this.table('series_contents', (table) => {
      // reverse alternations
      table.dropColumn('video');
    })
  }
}

module.exports = AddVideoToSeriesContentSchema
