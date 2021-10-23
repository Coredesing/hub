'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectInformationSchema extends Schema {
  up () {
    this.table('project_informations', (table) => {
      // alter table
      table.string('medium_link')
      table.string('announcement_telegram_link')
      table.string('coinmartketcap_link')
    })
  }

  down () {
    this.table('project_informations', (table) => {
      table.dropColumn('medium_link')
      table.dropColumn('announcement_telegram_link')
      table.dropColumn('coinmartketcap_link')
      // reverse alternations
    })
  }
}

module.exports = ProjectInformationSchema
