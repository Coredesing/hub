'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSlugToCampaignSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      // alter table
      table.string('slug').unique()
      table.index('slug')
    })
  }

  down () {
    this.table('campaigns', (table) => {
      // reverse alternations
      table.dropColumn('slug')
    })
  }
}

module.exports = AddSlugToCampaignSchema
