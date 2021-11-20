'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddAirdropNetworkCampaignSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      // alter table
      table.string('airdrop_network').nullable();
    })
  }

  down () {
    this.table('campaigns', (table) => {
      // reverse alternations
      table.dropColumn('airdrop_network');
    })
  }
}

module.exports = AddAirdropNetworkCampaignSchema
