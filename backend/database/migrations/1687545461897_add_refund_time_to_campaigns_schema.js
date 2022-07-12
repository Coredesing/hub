'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRefundTimeToCampaignsSchema extends Schema {
  up() {
    this.table('campaigns', (table) => {
      // alter table
      table.string('start_refund_time').nullable();
      table.string('end_refund_time').nullable();
    })
  }

  down() {
    this.table('campaigns', (table) => {
      // reverse alternations
      table.dropColumn('start_refund_time')
      table.dropColumn('end_refund_time')
    })
  }
}

module.exports = AddRefundTimeToCampaignsSchema
