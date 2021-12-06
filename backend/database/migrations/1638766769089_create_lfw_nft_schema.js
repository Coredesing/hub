'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateLfwNftSchema extends Schema {
  up () {
    this.create('lfw_nfts', (table) => {
      table.increments()
      table.timestamps()

      table.string('transaction_hash');
      table.integer('transaction_index').unsigned().nullable();
      table.integer('block_number').unsigned().nullable();
      table.integer('dispatch_at').notNullable();
      table.string('slug').defaultTo('');
      table.bool('owner').defaultTo(true)

      // tokenContract, tokenId, owner, seller, currency, value
      table.string('from').notNullable().defaultTo('');
      table.string('to').notNullable().defaultTo('');
      table.integer('token_id');

      // indexes
      table.unique(['transaction_hash', 'transaction_index', 'token_id']);
      table.index('block_number');
      table.index('from');
      table.index('to');
      table.index('owner');
      table.index('dispatch_at');
      table.index('slug');
      table.index(['to', 'token_id', 'owner', 'dispatch_at']);
    })
  }

  down () {
    this.drop('lfw_nfts')
  }
}

module.exports = CreateLfwNftSchema
