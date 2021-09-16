'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StakingEventsSchema extends Schema {
  up () {
    this.create('staking_events', (table) => {
      table.increments()
      table.timestamps()
      table.string('transaction_hash');
      table.integer('transaction_index').unsigned().nullable();
      table.string('wallet_address').notNullable().defaultTo('');
      table.string('event_type');
      table.integer('block_number').unsigned().nullable();
      table.string('raw_amount').notNullable();
      table.integer('dispatch_at').notNullable();
      table.float('amount');

      table.unique(['transaction_hash', 'transaction_index']);
      table.index('wallet_address');
      table.index('block_number');
      table.index('event_type');
      table.index('dispatch_at');
    })
  }

  down () {
    this.drop('staking_events')
  }
}

module.exports = StakingEventsSchema
