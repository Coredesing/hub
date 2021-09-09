'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StakingPoolSchema extends Schema {
  up() {
    this.create('staking_pools', (table) => {
      table.increments();
      table.string('pool_id');
      table.string('title');
      table.string('staking_type');
      table.float('rkp_rate'); // Red Kite Points rate
      table.string('logo');
      table.string('website');
      table.boolean('is_display').notNullable().defaultTo(0);
      table.string('pool_address');
      table.string('network_available');
      table.float('accepted_token_price').defaultTo(1);
      table.float('reward_token_price').defaultTo(1);

      table.timestamps();
    })
  }

  down() {
    this.drop('staking_pools')
  }
}

module.exports = StakingPoolSchema
