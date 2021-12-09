'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangeForbiddenCountryToCampaignSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      table.text('forbidden_countries').alter();
    })
  }

  down () {
    this.table('campaigns', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ChangeForbiddenCountryToCampaignSchema
