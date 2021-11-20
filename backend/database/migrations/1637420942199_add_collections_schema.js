'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCollectionsSchema extends Schema {
  up () {
    this.create('marketplace_collections', (table) => {
      table.increments()
      table.timestamps()

      table.string('token_address').notNullable().defaultTo('');
      table.string('description').nullable().defaultTo('');
      table.string('name').nullable().defaultTo('');
      table.string('logo').nullable().defaultTo('');
      table.string('banner').nullable().defaultTo('');
      table.string('image').nullable().defaultTo('');
      table.string('default_image').nullable().defaultTo('');
      table.string('website').nullable().defaultTo('');
      table.string('telegram').nullable().defaultTo('');
      table.string('twitter').nullable().defaultTo('');
      table.string('medium').nullable().defaultTo('');
      table.string('type').nullable().defaultTo('nft');
      table.boolean('is_show').defaultTo(false);
      table.integer('priority').defaultTo(0);

      // indexes
      table.unique('token_address');
      table.index('token_address');
      table.index('is_show');
      table.index('priority');
    })
  }

  down () {
    this.drop('marketplace_collections')
  }
}

module.exports = AddCollectionsSchema
