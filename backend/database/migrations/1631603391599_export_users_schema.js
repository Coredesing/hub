'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExportUsersSchema extends Schema {
  up () {
    this.create('export_users', (table) => {
      table.increments()
      table.string('file_name', 254).notNullable().unique()
      table.string('status', 8).notNullable()
      table.integer('download_number').unsigned().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('export_users')
  }
}

module.exports = ExportUsersSchema
