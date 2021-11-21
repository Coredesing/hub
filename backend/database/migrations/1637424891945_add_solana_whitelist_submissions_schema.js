'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSolanaWhitelistSubmissionsSchema extends Schema {
  up () {
    this.table('whitelist_submissions', (table) => {
      // alter table
      table.string('solana_address').nullable();
      table.string('terra_address').nullable();
    })
  }

  down () {
    this.table('whitelist_submissions', (table) => {
      // reverse alternations
      table.dropColumn('solana_address');
      table.dropColumn('terra_address');
    })
  }
}

module.exports = AddSolanaWhitelistSubmissionsSchema
