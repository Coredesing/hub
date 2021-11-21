'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddMarketplaceListEventSchema extends Schema {
  up () {
    this.create('nft_listed_events', (table) => {
      table.increments()
      table.timestamps()

      table.string('transaction_hash');
      table.integer('transaction_index').unsigned().nullable();
      table.integer('block_number').unsigned().nullable();
      table.integer('dispatch_at').notNullable();
      table.string('event_type');

      // tokenContract, tokenId, owner, seller, currency, value
      table.string('token_address').notNullable().defaultTo('');
      table.string('buyer').notNullable().defaultTo('');
      table.string('seller').notNullable().defaultTo('');
      table.string('currency').notNullable().defaultTo('');
      table.integer('token_id');
      table.string('raw_amount').notNullable();
      table.decimal('amount',20,5)
      table.string('value').notNullable();

      // indexes
      table.unique(['transaction_hash', 'transaction_index']);
      table.index('token_address');
      table.index('block_number');
      table.index('event_type');
      table.index('dispatch_at');
      table.index(['token_address', 'token_id']);
      table.index(['event_type', 'token_address']);
    })
  }

  down () {
    this.drop('nft_listed_events')
  }
}

module.exports = AddMarketplaceListEventSchema
