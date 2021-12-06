'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateGamefiClaimSchema extends Schema {
  up () {
    this.create('gamefi_vesting_pool', (table) => {
      table.increments()
      table.timestamps()
      table.string('wallet').notNull().unique().index()
      table.integer('option')
      table.string('pools').notNull()
    })
  }

  down () {
    this.drop('gamefi_vesting_pool')
  }
}

module.exports = CreateGamefiClaimSchema
