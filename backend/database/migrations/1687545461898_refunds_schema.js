'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRefundTimeToCampaignsSchema extends Schema {
  up () {
    this.create('refunds', (table) => {
      table.increments()
      table.timestamps()

      table.integer('campaign_id').unsigned().index()
      table.string('wallet_address').index()
      table.text('reason')

      table.foreign('campaign_id').references('campaigns.id')
      table.unique(['campaign_id', 'wallet_address']);
    })
  }

  down () {
    this.drop('refunds')
  }
}

module.exports = AddRefundTimeToCampaignsSchema
