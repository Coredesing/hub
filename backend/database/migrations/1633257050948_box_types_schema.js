'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoxTypesSchema extends Schema {
  up () {
    this.create('box_types', (table) => {
      table.increments()
      table.timestamps()

      table.integer('campaign_id').unsigned().index();
      table.string('name');
      table.string('icon');
      table.string('banner');
      table.integer('limit');
      table.foreign('campaign_id').references('campaigns.id');
    })
  }

  down () {
    this.drop('box_types')
  }
}

module.exports = BoxTypesSchema
