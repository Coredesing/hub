'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSolanaUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.string('solana_address').nullable();
      table.string('terra_address').nullable();
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.dropColumn('solana_address');
      table.dropColumn('terra_address');
    })
  }
}

module.exports = AddSolanaUsersSchema
