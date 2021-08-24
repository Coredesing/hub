'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CampaignsSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      table.text('rule');
    })
  }

  down () {
    this.table('campaigns', (table) => {
      table.dropColumn('rule');
    })
  }
}

module.exports = CampaignsSchema
