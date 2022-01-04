'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddAggregatorSlugToCampaignSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      // alter table
      table.string('aggregator_slug')
    })
  }

  down () {
    this.table('campaigns', (table) => {
      // reverse alternations
      table.dropColumn('aggregator_slug')
    })
  }
}

module.exports = AddAggregatorSlugToCampaignSchema
