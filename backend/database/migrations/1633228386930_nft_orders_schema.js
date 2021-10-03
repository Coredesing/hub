'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NFTOrdersSchema extends Schema {
  up () {
    this.create('nft_orders', (table) => {
      table.increments()
      table.timestamps()
      table.integer('campaign_id').unsigned().index();
      table.string('wallet_address').index();
      table.integer('amount');
      table.foreign('campaign_id').references('campaigns.id');
      table.unique(['campaign_id', 'wallet_address']);
    })
  }

  down () {
    this.drop('nft_orders')
  }
}

module.exports = NFTOrdersSchema
