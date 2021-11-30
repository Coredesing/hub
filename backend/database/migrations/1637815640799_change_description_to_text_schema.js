'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangeDescriptionToTextSchema extends Schema {
  up () {
    this.table('series_contents', (table) => {
      table.text('description').nullable().default('').alter();
    })

    this.table('box_types', (table) => {
      table.text('description').nullable().default('').alter();
    })
  }

  down () {
    this.table('series_contents', (table) => {
      table.string('description').nullable().default('').alter();
    })

    this.table('box_types', (table) => {
      table.string('description').nullable().default('').alter();
    })
  }

  // text
}

module.exports = ChangeDescriptionToTextSchema
