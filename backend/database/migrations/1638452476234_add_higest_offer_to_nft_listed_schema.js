'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddHigestOfferToNftListedSchema extends Schema {
  up () {
    this.table('nft_listed_events', (table) => {
      // alter table
      table.string('highest_offer')
    })
  }

  down () {
    this.table('nft_listed_events', (table) => {
      // reverse alternations
      table.dropColumn('highest_offer')
    })
  }
}

module.exports = AddHigestOfferToNftListedSchema
