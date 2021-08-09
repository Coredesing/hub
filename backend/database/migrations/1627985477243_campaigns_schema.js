'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CampaignsSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      // alter table
      table.string('token_type').defaultTo('erc20');
    })
  }

  down () {
    this.table('campaigns', (table) => {
      // reverse alternations
      table.dropColumn('token_type');
    })
  }
}

module.exports = CampaignsSchema
