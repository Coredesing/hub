'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldClaimTypeToCampaignClaimConfigSchema extends Schema {
  up () {
    this.table('campaign_claim_config', (table) => {
      // alter table
      table.string('claim_type').default(0);
      table.string('claim_url').nullable();
    })
  }

  down () {
    this.table('campaign_claim_config', (table) => {
      // reverse alternations
      table.dropColumn('claim_type')
      table.dropColumn('claim_url')
    })
  }
}

module.exports = AddFieldClaimTypeToCampaignClaimConfigSchema
