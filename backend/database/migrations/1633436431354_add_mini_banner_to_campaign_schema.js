'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddMiniBannerToCampaignSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      // alter table
      table.string('mini_banner')
    })
  }

  down () {
    this.table('campaigns', (table) => {
      // reverse alternations
      table.dropColumn('mini_banner')
    })
  }
}

module.exports = AddMiniBannerToCampaignSchema
