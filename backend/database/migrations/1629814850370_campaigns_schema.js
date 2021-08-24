'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CampaignsSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      table.text('rule');
      table.text('process').defaultTo('all')
    })
  }

  down () {
    this.table('campaigns', (table) => {
      table.dropColumn('rule');
      table.dropColumn('process')
    })
  }
}

module.exports = CampaignsSchema
