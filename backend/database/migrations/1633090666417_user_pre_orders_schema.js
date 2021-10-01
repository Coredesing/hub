'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPreOrdersSchema extends Schema {
  up() {
    this.create('user_pre_orders', (table) => {
      table.increments();
      table.integer('user_id').nullable();
      table.integer('campaign_id').unsigned().index();
      table.string('wallet_address').index();
      table.string('amount');
      table.timestamps();
      table.foreign('campaign_id').references('campaigns.id');
    })
  }

  down() {
    this.drop('user_pre_orders')
  }
}

module.exports = UserPreOrdersSchema
