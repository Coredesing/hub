'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddPreOrderToCampaignsSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      table.integer('start_pre_order_time').nullable();
      table.integer('pre_order_min_tier').nullable().default(4);
    })
  }

  down () {
    this.table('campaigns', (table) => {
      table.dropColumn('start_pre_order_time');
      table.dropColumn('pre_order_min_tier');
    })
  }
}

module.exports = AddPreOrderToCampaignsSchema
