'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddNetworkToCollectionsSchema extends Schema {
  up () {
    this.table('marketplace_collections', (table) => {
      table.string('network').defaultTo('bsc')
    })
  }

  down () {
    this.table('marketplace_collections', (table) => {
      table.dropColumn('network')
    })
  }
}

module.exports = AddNetworkToCollectionsSchema
