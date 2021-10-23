'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddAcceptedTokensSchema extends Schema {
  up () {
    this.create('accepted_tokens', (table) => {
      table.increments()
      table.timestamps()

      table.integer('campaign_id').unsigned().index();
      table.string('name');
      table.string('address');
      table.string('icon');
      table.float('price');
      table.foreign('campaign_id').references('campaigns.id');
    })
  }

  down () {
    this.drop('accepted_tokens')
  }
}

module.exports = AddAcceptedTokensSchema
