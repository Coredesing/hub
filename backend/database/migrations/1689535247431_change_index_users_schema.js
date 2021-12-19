'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangeIndexUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.unique('solana_address');
      table.unique('terra_address');
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropUnique('solana_address');
      table.dropUnique('terra_address');
    })
  }
}

module.exports = ChangeIndexUsersSchema
